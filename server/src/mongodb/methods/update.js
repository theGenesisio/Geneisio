import { User, KYC, Billing, Notification, Investment, Plan } from '../models.js';

/**
 * Update user fields by user ID.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updatedFields - The fields to update.
 * @returns {Object|boolean} - The updated user document or false on error.
 */
const updateUserFields = async (userId, updatedFields) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: userId },          // Filter criteria
            { $set: updatedFields },  // Fields to update
            { new: true }             // Return updated document
        );
        return result;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        return false;
    }
};

/**
 * Upsert KYC data for a user.
 * @param {string} userId - The ID of the user.
 * @param {Object} kycData - The KYC data to upsert.
 * @returns {Object|boolean} - The updated or created KYC document or false on error.
 */
const upsertKYC = async (userId, kycData) => {
    try {
        const updatedKYC = await KYC.findOneAndUpdate(
            { user: userId }, // Query by user ID
            { $set: kycData }, // Data to update or set
            {
                new: true, // Return the updated document
                upsert: true, // Create a new document if it doesn't exist
                runValidators: true // Run schema validators
            }
        );
        return updatedKYC;
    } catch (error) {
        console.error(`Error updating or creating KYC for user with ID ${userId}:`, error);
        return false;
    }
};

/**
 * Update or create a deposit option.
 * @param {Object} optionData - The deposit option data to upsert.
 * @returns {Object|boolean} - The updated or created deposit option document or false on error.
 */
const updateDepositOption = async (optionData) => {
    try {
        const option = await Billing.findOneAndUpdate(
            { name: optionData.name }, // Query by name
            { $set: optionData }, // Data to update or set
            {
                new: true, // Return the updated document
                upsert: true, // Create a new document if it doesn't exist
                runValidators: true // Run schema validators
            }
        );
        return option;
    } catch (error) {
        console.error(`Error updating or creating deposit option with name ${optionData.name}:`, error);
        return false;
    }
};

/**
 * Update the readBy field of a notification by adding a user ID.
 * @param {Object} details - The details for the update.
 * @param {string} details.userId - The ID of the user.
 * @param {string} details.notificationId - The ID of the notification.
 * @returns {Object|boolean} - The updated notification document or false on error.
 */
const updateNotificationReadBy = async (details) => {
    const { userId, notificationId } = details;
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            console.error(`Notification with ID ${notificationId} not found.`);
            return false;
        }
        const updatedReadBy = [...new Set([...notification.readBy, userId])];
        notification.readBy = updatedReadBy;
        await notification.save();
        return notification;
    } catch (error) {
        console.error(`Error updating readBy for notification with ID ${notificationId}:`, error);
        return false;
    }
};

/**
 * Update investment request.
 * @param {Object} details - The details for the update.
 * @param {Object} details.plan - The investment plan.
 * @param {number} details.amount - The investment amount.
 * @param {string} details.userId - The ID of the user.
 * @param {string} details.email - The email of the user.
 * @returns {Object|boolean} - The updated investment request or false on error.
 */
const updateInvestmentRequest = async (details) => {
    const { plan, amount, userId, email } = details;
    try {
        // Sanitize the plan object and ensure it's a valid Mongoose document
        const { name, limits: { min, max }, ROIPercentage, duration } = plan;

        // Update the investment request with the validated plan
        const request = await Investment.findOneAndUpdate(
            { 'user.id': userId, status: { $ne: 'active' } },
            {
                $set: {
                    plan: { name, limits: { min, max }, ROIPercentage, duration },
                    amount,
                    user: { email, id: userId },
                    status: 'pending',
                },
            },
            { new: true, runValidators: true, upsert: true } // Ensure validators run during the update
        );

        return request;
    } catch (error) {
        console.error(`Error updating investment request for ${email}:`, error);
        return false;
    }
};

export { updateUserFields, upsertKYC, updateDepositOption, updateNotificationReadBy, updateInvestmentRequest };