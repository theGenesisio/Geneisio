import { models } from '../models.js';

/**
 * Find all documents in a specified model.
 * @param {number} modelIndex - Index of the model in the models array.
 * @returns {Array|boolean} - Array of found documents or false on error.
 */
const findAny = async (modelIndex = 0) => {
    if (modelIndex < 0 || modelIndex >= models.length) {
        console.error("Invalid model index:", modelIndex);
        return false;
    }
    const Model = models[modelIndex];
    try {
        const found = await Model.find();
        return found || [];
    } catch (error) {
        console.error("Error querying model:", error);
        return false;
    }
};

/**
 * Find documents by filter with an optional limit.
 * @param {Object} filter - MongoDB filter object.
 * @param {number} modelIndex - Index of the model in the models array.
 * @param {number} limit - Maximum number of documents to return.
 * @returns {Array|boolean} - Array of found documents or false on error.
 */
const findAnyFilter = async (filter = {}, modelIndex = 0, limit = 0) => {
    if (modelIndex < 0 || modelIndex >= models.length) {
        console.error("Invalid model index:", modelIndex);
        return false;
    }
    const Model = models[modelIndex];
    try {
        const found = await Model.find(filter).limit(limit);
        return found || [];
    } catch (error) {
        console.error("Error finding documents:", error);
        return false;
    }
};

/**
 * Find a single document by filter.
 * @param {Object} filter - MongoDB filter object.
 * @param {number} modelIndex - Index of the model in the models array.
 * @returns {Object|boolean} - Found document or false on error.
 */
const findOneFilter = async (filter = {}, modelIndex = 0) => {
    if (modelIndex < 0 || modelIndex >= models.length) {
        console.error("Invalid model index:", modelIndex);
        return false;
    }
    const Model = models[modelIndex];
    try {
        const found = await Model.findOne(filter).sort({ createdAt: -1 });
        return found;
    } catch (error) {
        console.error("Error querying model:", error);
        return false;
    }
};

/**
 * Find notifications that have not been read by the user.
 * @param {number} modelIndex - Index of the model in the models array.
 * @param {string} userId - User ID to check against the readBy field.
 * @returns {Array|boolean} - Array of unread notifications or false on error.
 */
const findNotification = async (modelIndex, userId) => {
    if (modelIndex < 0 || modelIndex >= models.length) {
        console.error("Invalid model index:", modelIndex);
        return false;
    }
    const Model = models[modelIndex];
    try {
        const notifications = await Model.find(({
            readBy: { $ne: userId },
            $or: [
                { targets: '*' },
                { targets: { $in: [userId] } }
            ]
        }));
        return notifications || [];
    } catch (error) {
        console.error("Error querying model:", error);
        return false;
    }
};
/**
 * Fetches the last created objects for a specific userId and modelIndex.
 * @param {mongoose.Types.ObjectId} userId - The ID of the user.
 * @param {Number} modelIndex - The index of the model.
 * @param {Number} limit - The inumber of return objects.
 * @returns {Promise<Array>} - An array of the most recently created objects.
 */
async function findLastCreatedObjects(filter, modelIndex, limit = 1) {
    if (modelIndex < 0 || modelIndex >= models.length) {
        console.error("Invalid model index:", modelIndex);
        return false;
    }
    const Model = models[modelIndex];
    try {
        const results = await Model.find(filter)
            .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
            .limit(limit) // Limit to the last element by default
            .exec();
        return results;
    } catch (err) {
        console.error('Error fetching the last five created objects:', err);
        return false
    }
}
/**
 * Fetches the last updated objects for a specific userId and modelIndex.
 * @param {mongoose.Types.ObjectId} userId - The ID of the user.
 * @param {Number} modelIndex - The index of the model.
 * @param {Number} limit - The inumber of return objects.
 * @returns {Promise<Array>} - An array of the most recently created objects.
 */
async function findLastUpdatedObjects(filter, modelIndex, limit = 1) {
    if (modelIndex < 0 || modelIndex >= models.length) {
        console.error("Invalid model index:", modelIndex);
        return false;
    }
    const Model = models[modelIndex];
    try {
        const results = await Model.find(filter)
            .sort({ updatedAt: -1 }) // Sort by `createdAt` in descending order
            .limit(limit) // Limit to the last element by default
            .exec();
        return results;
    } catch (err) {
        console.error('Error fetching the last five updated objects:', err);
        return false
    }
}
export { findAny, findOneFilter, findAnyFilter, findNotification, findLastCreatedObjects, findLastUpdatedObjects };