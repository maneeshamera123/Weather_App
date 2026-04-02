module.exports = {
    jwtSecret: process.env.JWT_SECRET_KEY || 'default-secret',
    jwtSecretKey: process.env.JWTSCE || 'default-key',
    weatherApiKey: process.env.WEATHER_API_KEY,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/weatherapp',
    firebase: {
        type: process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderCertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        clientCertUrl: process.env.FIREBASE_CLIENT_CERT_URL
    },
    notification: {
        minIntervalHours: 12,
        enabled: true
    }
};
