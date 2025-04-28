import cron from 'node-cron';
import { RefreshToken } from '../mongodb/models.js';

// Run the deleteExpired function every hour
cron.schedule('0 * * * *', async () => {
    try {
        const result = await RefreshToken.deleteExpired();
        console.log(`Expired tokens deleted: ${result.deletedCount}`);
    } catch (error) {
        console.error('Error deleting expired tokens:', error);
    }
}, {
    scheduled: true,
    timezone: "America/New_York"
});
