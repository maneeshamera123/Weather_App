const admin = require('firebase-admin');

const NotificationConfig = {
    minIntervalHours: 12,
    enabled: true
};

async function sendPushNotification(tokens, title, body, data = {}) {
    if (!tokens || tokens.length === 0) {
        console.log('No tokens provided for notification');
        return { success: false, error: 'No tokens provided' };
    }

    if (!admin.apps.length) {
        console.log('Firebase Admin not initialized');
        return { success: false, error: 'Firebase Admin not initialized' };
    }

    const validTokens = tokens.filter(token => token && token.length > 0);
    if (validTokens.length === 0) {
        return { success: false, error: 'No valid tokens' };
    }

    const message = {
        notification: {
            title,
            body
        },
        data: {
            ...data,
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        tokens: validTokens
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`Successfully sent ${response.successCount} notifications`);
        if (response.failureCount > 0) {
            console.log(`Failed to send ${response.failureCount} notifications`);
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.log(`Token ${idx} error:`, resp.error.message);
                }
            });
        }
        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount
        };
    } catch (error) {
        console.error('Error sending push notification:', error.message);
        return { success: false, error: error.message };
    }
}

async function sendWeatherAlertNotification(tokens, userName, location, alerts) {
    const alertDescriptions = alerts.map(a => a.conditions.join(', ')).join(' | ');
    const firstAlert = alerts[0];
    
    const title = `⚠️ Weather Alert for ${location}`;
    const body = `${firstAlert.description}, ${firstAlert.temperature}°C. ${alertDescriptions}`;
    
    const data = {
        type: 'weather_alert',
        location,
        alertCount: alerts.length.toString()
    };

    return sendPushNotification(tokens, title, body, data);
}

function shouldSendNotification(lastNotificationTime) {
    if (!NotificationConfig.enabled) {
        return false;
    }

    if (!lastNotificationTime) {
        return true;
    }

    const hoursSinceLastNotification = (Date.now() - lastNotificationTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastNotification >= NotificationConfig.minIntervalHours;
}

module.exports = {
    sendPushNotification,
    sendWeatherAlertNotification,
    shouldSendNotification,
    NotificationConfig
};
