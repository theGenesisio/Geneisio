import { RefreshToken } from '../models.js';

/**
 * Delete a refresh token entry.
 * @param {string} token - The refresh token to delete.
 * @returns {boolean} - True if the token was deleted, false on error or if no token matched.
 */
const deleteRefreshTokenEntry = async (token) => {
    try {
        const result = await RefreshToken.findOneAndDelete({ token });

        if (result) {
            return true; // Indicating success
        } else {
            console.warn(`No refresh token found with token: ${token}`);
            return false; // If no token matched, return false
        }
    } catch (error) {
        // Log the error with more context for easier debugging
        console.error('Error deleting refresh token entry:', {
            message: error.message || error,
            stack: error.stack || 'No stack trace available',
        });
        return false; // Return false if there was an error during the deletion process
    }
};

export { deleteRefreshTokenEntry };