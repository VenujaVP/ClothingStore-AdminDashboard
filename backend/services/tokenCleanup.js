import sqldb from '../config/sqldb.js';

const cleanupExpiredTokens = async () => {
    try {
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format the current time for MySQL
        
        await sqldb.execute(`
            UPDATE USER 
            SET resetToken = NULL, resetTokenExpiry = NULL
            WHERE resetTokenExpiry <= ?
        `, [currentTime]);
        
        console.log('✅ Expired tokens cleaned up successfully');
    } catch (error) {
        console.error('❌ Error clearing expired tokens:', error);
    }
};

export default cleanupExpiredTokens;
