import sqldb from '../config/sqldb.js';

const cleanupExpiredTokens = async () => {
    try {
        const currentTime = new Date();
        const formattedCurrentTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');  // Format to 'YYYY-MM-DD HH:MM:SS'

        console.log("Current time:", formattedCurrentTime);

        // Compare formatted current time with resetTokenExpiry in the DB
        await sqldb.execute(`
            UPDATE User
            SET resetToken = NULL, resetTokenExpiry = NULL
            WHERE resetTokenExpiry <= ?
        `, [formattedCurrentTime]);

        console.log("Expired tokens cleaned up.");

    } catch (error) {
        console.error('❌ Error clearing expired tokens:', error);
    }
};

export default cleanupExpiredTokens;
