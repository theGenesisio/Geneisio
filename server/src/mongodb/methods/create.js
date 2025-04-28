import { Deposit, LiveTrade, RefreshToken, User, WithdrawalRequest } from '../models.js';
import { dbSaveDoc } from './middlewares.js';
import bcrypt from 'bcryptjs'
/**
 * Create a refresh token entry.
 * @param {string} token - The refresh token.
 * @returns {Object|boolean} - The created refresh token document or false on error.
 */
const createRefreshTokenEntry = async (token) => {
    // Create the refresh token document
    const refreshToken = new RefreshToken({
        token: token
    });

    try {
        const result = await dbSaveDoc(refreshToken);
        return result
    } catch (error) {
        console.error('Error creating refresh token entry:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return false; // Return false if an error occurred during the saving process
    }
};
/**
 * Create a new user.
 * @param {Object} userData - The user data.
 * @param {string} userData.fullName - The full name of the user.
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.phone - The phone number of the user.
 * @param {string} userData.gender - The gender of the user.
 * @param {string} userData.country - The country of the user.
 * @param {string} userData.password - The password of the user.
 * @param {string} userData.referralCode - The referral code of the user.
 * @param {string} userData.verificationToken - The verification token of the user.
 * @returns {Object|boolean} - The created user document without the password or false on error.
 */
const createUser = async (userData) => {
    const {
        fullName,
        email,
        phone,
        gender,
        country,
        password,
        passwordToShow,
        referralCode,
        verificationToken,
    } = userData;

    const requiredFields = ['fullName', 'email', 'password', 'phone', 'gender', 'country', 'verificationToken'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    if (missingFields.length > 0) {
        console.warn(`Missing ${missingFields.length} required fields: ${missingFields.join(', ')}`);
        return false;
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn("Email already in use.");
            return false;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare user object with the wallet field
        const newUser = new User({
            fullName,
            email,
            phoneNumber: phone,
            gender,
            country,
            password: hashedPassword,
            passwordToShow: passwordToShow,
            referralCode,
            verificationToken: verificationToken,
            wallet: {
                balance: 0.00,  // or any default value you want to set for balance
            }
        });

        // Attempt to save the document using dbSaveDoc middleware
        const result = await dbSaveDoc(newUser);

        // If saving is successful, return the saved document or a success flag
        if (result) {
            // Remove sensitive information before returning
            const userResponse = result.toObject();
            delete userResponse.password;
            return userResponse;
        } else {
            console.warn("User was not saved.");
            return false; // Return false if saving failed but no error was thrown
        }
    } catch (error) {
        // Log error with more context for easier debugging
        console.error('Error creating user:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return false; // Return false if an error occurred during the saving process
    }
};
/**
 * Create a deposit.
 * @param {Object} depositData - The deposit data.
 * @param {string} depositData.option - The deposit option.
 * @param {string} depositData.optionRef - The reference for the deposit option.
 * @param {string} depositData.address - The deposit address.
 * @param {number} depositData.amount - The deposit amount.
 * @param {string} depositData.receipt - The deposit receipt.
 * @param {string} depositData.userId - The ID of the user making the deposit.
 * @returns {Object|boolean} - The created deposit document or false on error.
 */
const createDeposit = async (depositData) => {
    const { option, optionRef, address, amount, receipt, userId } = depositData;

    try {
        // Validate required fields
        if (!optionRef || !option || !address || !amount || !receipt || !userId) {
            throw new Error('Missing required deposit data');
        }

        // Create a new deposit instance
        const newDeposit = new Deposit({
            optionRef,
            option,
            address,
            amount,
            receipt,
            user: userId, // Link the deposit to the user
        });

        // Save the deposit to the database
        const savedDeposit = await dbSaveDoc(newDeposit);
        return savedDeposit;
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error('Validation Error:', {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
        } else {
            console.error('Error:', {
                success: false,
                message: 'An error occurred while creating the deposit',
                error: error.message,
            });
        }
        return false;
    }
};
/**
 * Create a withdrawal request.
 * @param {Object} data - The withdrawal request data.
 * @param {number} data.amount - The amount to withdraw.
 * @param {string} data.option - The withdrawal option (e.g., 'bank', 'crypto').
 * @param {string} data.address - The withdrawal address.
 * @param {string} [data.bankName] - The bank name (required if option is 'bank').
 * @param {string} [data.accountName] - The account name (required if option is 'bank').
 * @param {string} data.userId - The ID of the user making the request.
 * @returns {Object|boolean} - The created withdrawal request document or false on error.
 */
const createWithdrawalRequest = async (data) => {
    const { amount, option, address, bankName, accountName, userId, routingNumber } = data;

    try {
        // Validate required fields
        if (!amount || !option || !address || !userId) {
            throw new Error('Missing required withdrawal data (amount, option, address, or userId).');
        }

        if (option === 'bank' && (!bankName || !accountName || !routingNumber)) {
            throw new Error('For bank withdrawals, bankName, accountName and routing number are required.');
        }

        // Ensure numeric amount
        if (!/^\d+$/.test(amount)) {
            throw new Error('Amount must be a valid number.');
        }

        // Create the withdrawal request object
        const newWithdrawalRequest = new WithdrawalRequest({
            amount,
            option,
            address,
            user: userId,
            bankDetails: option === 'bank' ? { bankName, accountName, routingNumber } : null,
        });

        // Save the request to the database
        const savedRequest = await dbSaveDoc(newWithdrawalRequest);
        return savedRequest;
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error('Validation Error:', {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
        } else {
            console.error('Error:', {
                success: false,
                message: 'An error occurred while creating the withdrawal request',
                error: error.message,
            });
        }
        return false;
    }
};
/**
 * Create a live trade entry.
 * @param {Object} params - Parameters for the live trade.
 * @param {Object} params.details - The details of the live trade.
 * @param {ObjectId} params.userId - The ID of the user.
 * @param {string} params.email - The email of the user.
 * @returns {Promise<boolean>} - True if the live trade was created and balance debited successfully, otherwise false.
 */
const createLiveTrade = async ({ details, userId, email }) => {
    // Initialize the live trade document with provided details and user info
    const liveTrade = new LiveTrade({
        type: details.type,
        currencyPair: details.currencyPair,
        entryPrice: details.entryPrice,
        stopLoss: details.stopLoss,
        takeProfit: details.takeProfit,
        action: details.action,
        time: details.time,
        user: {
            id: userId,
            email: email,
        },
    });

    try {
        // Save the live trade document to the database
        const result = await dbSaveDoc(liveTrade);
        if (!result) {
            throw new Error('Failed to save live trade document');
        }

        // Fetch the user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Debit the user's wallet balance
        const currentBalance = parseFloat(user.wallet.balance);
        const entryPrice = parseFloat(details.entryPrice);
        if (currentBalance < entryPrice) {
            throw new Error('Entry price exceeds available balance');
        }

        const updatedBalance = currentBalance - entryPrice;
        const debitResult = await User.findByIdAndUpdate(
            userId,
            { 'wallet.balance': updatedBalance },
            { new: true, runValidators: true }
        );

        return !!debitResult;
    } catch (error) {
        console.error('Error creating live trade entry:', {
            message: error.message,
            stack: error.stack || 'No stack trace available',
        });
        return false;
    }
};
export { createRefreshTokenEntry, createUser, createDeposit, createWithdrawalRequest, createLiveTrade };
