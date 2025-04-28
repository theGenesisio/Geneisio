import JWT from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import crypto from 'crypto'
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) { return res.status(401).json({ message: 'Missing access token' }) }
    JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (!user) {
            return res.status(401).json({
                message: 'An error occured, please login again'
            });
        }
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Handle token expiration differently
                return res.status(403).json({
                    message: 'Expired access token',
                    expiredAt: err.expiredAt, // Include the expiration timestamp if needed
                });
            } else {
                // Handle other JWT-related errors
                return res.status(500).json({
                    message: 'An error occured, please login again'
                });
            }
        }
        req.user = user
        next()
    })
}
// I think this became dormant in this project but can be useful later 
const handlePreflight = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.status(200).json({});
    }
    next();
};
// Constructor for new code request forgot password
async function createCodeRequest(email, array) {
    const code = crypto.randomBytes(4).toString('hex').slice(0, 8);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const codeRequest = {
        _id: uuid(),
        email,
        code,
        expiresAt,

        // Check if the code has expired
        isExpired() {
            return Date.now() > this.expiresAt;
        },

        // Delete from the provided array
        delete() {
            const index = array.indexOf(this);
            if (index > -1) {
                array.splice(index, 1); // Remove this object from the array
            } else {
                console.log(`CodeRequest with ID ${this._id} not found in the array.`);
            }
        },

        // Automatically handle expiration and deletion after 5 minutes
        scheduleDeletion() {
            setTimeout(() => {
                if (this.isExpired()) {
                    this.delete();
                }
            }, 24 * 60 * 60 * 1000);// 24 hours
        }
    };

    // Automatically add to the provided array
    array.push(codeRequest);
    return codeRequest;
}
export { authenticate, handlePreflight, createCodeRequest }