const { db } = require('../config/firebase-config');

const logLevels = {
    INFO: 'info',
    ERROR: 'error',
    WARNING: 'warning'
};

const log = async (level, message, data = {}) => {
    const logEntry = {
        timestamp: new Date(),
        level,
        message,
        data
    };

    // Log to console
    console[level.toLowerCase()](message, data);

    // Store in Firestore
    try {
        await db.collection('logs').add(logEntry);
    } catch (error) {
        console.error('Error writing to logs:', error);
    }
};

module.exports = {
    info: (message, data) => log(logLevels.INFO, message, data),
    error: (message, data) => log(logLevels.ERROR, message, data),
    warning: (message, data) => log(logLevels.WARNING, message, data)
};
