import sqldb from '../config/sqldb.js';

const cleanupExpiredTokens = async () => {
    try {
        const currentTime = new Date();
        await sqldb.execute(`
            UPDATE User 
            SET resetToken = NULL, resetTokenExpiry = NULL
            WHERE resetTokenExpiry <= ?
        `, [currentTime]);
    } catch (error) {
        console.error('❌ Error clearing expired tokens:', error);
    }
};

export default cleanupExpiredTokens;
