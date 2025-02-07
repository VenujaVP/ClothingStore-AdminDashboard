import sqldb from '../config/sqldb.js';

const cleanupExpiredTokens = async () => {
    try {
        const currentTime = new Date(Date.now());
        await sqldb.query(`
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
