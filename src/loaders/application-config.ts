import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const environmentFound = dotenv.config();
if (environmentFound.error) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
    /**
     * Your favorite port
     */
    port: Number.parseInt(process.env.PORT, 10),

    /**
     * That long string from mlab
     */
    databaseURL: process.env.MONGODB_URI,

    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },
    /**
     * Mailgun email credentials
     */
    emails: {
        // apiKey: process.env.MAILGUN_API_KEY,
        // domain: process.env.MAILGUN_DOMAIN,
    },
};

export default config;
