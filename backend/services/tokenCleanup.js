import db from '../config/database.js'; // Adjust based on your DB setup

const cleanupExpiredTokens = async () => {
    try {
        const currentTime = new Date(Date.now()); // Get current backend time
        await db.query(`
            UPDATE User 
            SET resetToken = NULL, resetTokenExpiry = NULL
            WHERE resetTokenExpiry <= ?
        `, [currentTime]);
    } catch (error) {
        console.error('❌ Error clearing expired tokens:', error);
    }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredTokens, 5 * 60 * 1000);

export default cleanupExpiredTokens;
