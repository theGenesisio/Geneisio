import { Router as _Router } from "express";
import { Readable } from 'stream';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import { updateUserFields, upsertKYC } from '../mongodb/methods/update.js';
import { getSafeUser } from '../helpers.js';
import { findOneFilter } from '../mongodb/methods/read.js';

const Router = _Router();

// Set up GridFS Buckets
let gfsProfilePics, gfsDeposits, gfsKYC, gfsTraderImg;
//** Always sync with admin */
let gfsBilling;
mongoose.connection.once('open', () => {
    gfsProfilePics = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'profile_pics' });
    gfsDeposits = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'deposits' });
    gfsKYC = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'kyc' });
    gfsBilling = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'billingOptions' });
    gfsTraderImg = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'traderImg' });
})

// Configure Multer for file uploads (store temporarily in memory)
const storageProfilePics = multer.memoryStorage();
const storageDeposits = multer.memoryStorage();
const storageKYC = multer.memoryStorage();
const uploadProfilePics = multer({ storage: storageProfilePics });
const uploadDeposits = multer({ storage: storageDeposits });
const uploadKYC = multer({ storage: storageKYC });

// Routes for Profile Pictures
Router.route('/upload/profile-pic/:userId/:currentImageFilename')
    .post(uploadProfilePics.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${req.params.userId}_pfp_.${fileExtension}`;
        const readableStream = Readable.from(req.file.buffer);

        const uploadStream = gfsProfilePics.openUploadStream(fileName, {
            contentType: req.file.mimetype,
        });

        readableStream.pipe(uploadStream)
            .on('error', (err) => {
                console.error('Error uploading profile picture:', err);
                res.status(500).json({ message: 'Error uploading file' });
            })
            .on('finish', async () => {
                // Save previous image ID for cleanup
                let previousImageId = req.params.currentImageFilename || null;
                try {
                    const id = uploadStream.id.toString();
                    const updatedUser = await updateUserFields(req.params.userId, { imageFilename: id });
                    if (!updatedUser) {
                        return res.status(400).json({ message: 'File not saved' });
                    }

                    const safeUserData = await getSafeUser(updatedUser);
                    res.status(200).json({ message: 'Profile picture uploaded successfully', user: safeUserData });
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                } finally {
                    try {
                        if (previousImageId) {
                            await gfsProfilePics.delete(new mongoose.Types.ObjectId(previousImageId));
                            console.log(`Deleted previous profile picture with ID: ${previousImageId}`);
                        }
                    } catch (cleanupError) {
                        console.error('Error during cleanup of previous profile picture:', cleanupError);
                    }
                }
            });
    });

Router.route('/image/profile-pic/:id')
    .get((req, res) => {
        const fileId = req.params.id;
        // MongoDB ObjectId regex pattern
        const objectIdRegex = /^[a-fA-F0-9]{24}$/;

        // Validate fileId against the regex
        if (!objectIdRegex.test(fileId)) {
            return res.status(400).json({ message: 'Invalid fileId format' });
        }
        const downloadStream = gfsProfilePics.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        downloadStream.on('error', (err) => {
            console.error('Error retrieving profile picture:', err);
            res.status(404).json({ message: 'File not found' });
        });

        res.setHeader('Content-Type', 'image/jpeg'); // Adjust MIME type as needed
        downloadStream.pipe(res);
    });
Router.route('/image/qrcode/:id')
    .get((req, res) => {
        const fileId = req.params.id;

        // MongoDB ObjectId regex pattern
        const objectIdRegex = /^[a-fA-F0-9]{24}$/;

        // Validate fileId against the regex
        if (!objectIdRegex.test(fileId)) {
            return res.status(400).json({ message: 'Invalid fileId format' });
        }

        const downloadStream = gfsBilling.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        downloadStream.on('error', (err) => {
            console.error('Error retrieving QR Code:', err);
            res.status(404).json({ message: 'QR Code not found' });
        });

        res.setHeader('Content-Type', 'image/jpeg'); // Adjust MIME type as needed
        downloadStream.pipe(res);
    });
// Routes for KYC
Router.route('/upload/kyc/:userId/:kycId')
    .post(uploadKYC.array('images', 2), async (req, res) => {
        const { kycId, userId } = req.params;
        let kycRecord = null;

        try {
            kycRecord = kycId ? await findOneFilter({ _id: kycId }, 2) : null;
            // const { frontFilename = null, backFilename = null } = kycRecord || {};
            const documentType = req.body.documentType;

            // Validate request
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }
            if (!documentType) {
                return res.status(400).json({ message: 'Document type is required' });
            }

            const validDocumentTypes = ["Driver's License", "ID Card", "Passport"];
            if (!validDocumentTypes.includes(documentType)) {
                return res.status(400).json({ message: 'Invalid document type' });
            }

            // Upload files to GridFS
            const uploadedFiles = await Promise.all(
                req.files.map((file, index) => {
                    const fileExtension = file.originalname.split('.').pop();
                    const fileName = `${userId}_${documentType}_kyc_${index + 1}.${fileExtension}`;
                    const readableStream = Readable.from(file.buffer);

                    const uploadStream = gfsKYC.openUploadStream(fileName, {
                        contentType: file.mimetype,
                    });

                    return new Promise((resolve, reject) => {
                        readableStream.pipe(uploadStream)
                            .on('error', reject)
                            .on('finish', () => resolve({
                                fileId: uploadStream.id.toString(),
                                fileName,
                            }));
                    });
                })
            );

            // Create or update KYC record
            const kycRecordData = {
                state: false,
                type: documentType,
                frontFilename: uploadedFiles[0]?.fileName,
                backFilename: (documentType === "Driver's License" || documentType === "ID Card")
                    ? uploadedFiles[1]?.fileName
                    : null,
            };

            const newKycRecord = await upsertKYC(userId, kycRecordData);
            if (!newKycRecord) {
                return res.status(500).json({ message: 'Failed to save KYC record' });
            }

            // Associate KYC record with the user
            const updatedUser = await updateUserFields(userId, { KYC: newKycRecord._id });
            if (!updatedUser) {
                return res.status(400).json({ message: 'Failed to associate KYC with user' });
            }

            const safeUserData = await getSafeUser(updatedUser);
            return res.status(200).json({
                message: 'KYC document uploaded successfully, awaiting admin validation',
                user: safeUserData,
            });

        } catch (error) {
            console.error('Error processing KYC upload:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            try {
                if (kycRecord) {
                    const filesToDelete = [kycRecord.frontFilename, kycRecord.backFilename].filter(Boolean);
                    if (filesToDelete.length > 0) {
                        const deletionResults = await Promise.allSettled(
                            filesToDelete.map(async (filename) => {
                                const file = await gfsKYC.find({ filename }).toArray();
                                if (file.length > 0) {
                                    console.log(`Deleting file: ${filename}`);
                                    return gfsKYC.delete(file[0]._id);
                                }
                            })
                        );
                        console.log('Deletion results:', deletionResults);
                    }
                }
            } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError);
            }
        }
    });
// view trader img
Router.route('/image/trader/:id')
    .get((req, res) => {
        const fileId = req.params.id;
        // MongoDB ObjectId regex pattern
        const objectIdRegex = /^[a-fA-F0-9]{24}$/;

        // Validate fileId against the regex
        if (!objectIdRegex.test(fileId)) {
            return res.status(400).json({ message: 'Invalid fileId format' });
        }
        const downloadStream = gfsTraderImg.openDownloadStream(new mongoose.Types.ObjectId(fileId));

        downloadStream.on('error', (err) => {
            console.error('Error retrieving trader  img:', err);
            res.status(404).json({ message: 'File not found' });
        });

        downloadStream.on('file', (file) => {
            res.setHeader('Content-Type', file.contentType || 'application/octet-stream'); // Adjust MIME type as needed
        });

        downloadStream.pipe(res);
    });
// Export your configured constants if needed
export {
    gfsProfilePics,
    gfsDeposits,
    gfsKYC,
    gfsBilling,
    gfsTraderImg,
    uploadProfilePics,
    uploadDeposits,
    uploadKYC,
};
export default Router;