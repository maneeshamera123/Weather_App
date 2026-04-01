const cron = require('node-cron');
const User = require('../models/usermodel');
const tokenModel = require('../models/saveToken');
const { checkWeatherForCity } = require('./weatherService');
const { sendWeatherAlertNotification, shouldSendNotification } = require('./notificationService');

async function checkWeatherAndNotifyAllUsers() {
    console.log(`[${new Date().toISOString()}] Starting weather check for all users...`);
    
    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users to check`);

        if (users.length === 0) {
            console.log('No users found in database');
            return;
        }

        const usersByLocation = {};
        users.forEach(user => {
            const location = user.location?.toLowerCase().trim();
            if (location) {
                if (!usersByLocation[location]) {
                    usersByLocation[location] = [];
                }
                usersByLocation[location].push(user);
            }
        });

        console.log(`Checking weather for ${Object.keys(usersByLocation).length} unique locations`);

        for (const [location, locationUsers] of Object.entries(usersByLocation)) {
            try {
                console.log(`Checking weather for: ${location}`);
                
                const weatherResult = await checkWeatherForCity(location);
                
                if (!weatherResult.success) {
                    console.log(`Failed to get weather for ${location}: ${weatherResult.error}`);
                    continue;
                }

                if (!weatherResult.hasAlerts) {
                    console.log(`No weather alerts for ${location}`);
                    continue;
                }

                console.log(`Found ${weatherResult.alerts.length} alerts for ${location}`);

                for (const user of locationUsers) {
                    const tokens = await tokenModel.find({ userId: user._id.toString() });
                    
                    if (tokens.length === 0) {
                        console.log(`No tokens found for user ${user.name}`);
                        continue;
                    }

                    const userTokens = tokens.map(t => t.token);
                    const lastNotificationTime = user.lastNotificationSent;

                    if (!shouldSendNotification(lastNotificationTime)) {
                        console.log(`Skipping notification for ${user.name} - too soon since last notification`);
                        continue;
                    }

                    const result = await sendWeatherAlertNotification(
                        userTokens,
                        user.name,
                        location,
                        weatherResult.alerts
                    );

                    if (result.success) {
                        user.lastNotificationSent = new Date();
                        await user.save();
                        console.log(`Notification sent to ${user.name} for ${location}`);
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`Error processing location ${location}:`, error.message);
            }
        }

        console.log(`[${new Date().toISOString()}] Weather check completed`);

    } catch (error) {
        console.error('Error in weather check job:', error.message);
    }
}

function startWeatherAlertScheduler() {
    console.log('Starting weather alert scheduler...');
    
    cron.schedule('0 * * * *', () => {
        console.log('Weather alert cron job triggered');
        checkWeatherAndNotifyAllUsers();
    });

    console.log('Weather alert scheduler started. Will check every hour.');
    
    setTimeout(() => {
        checkWeatherAndNotifyAllUsers();
    }, 5000);
}

module.exports = {
    startWeatherAlertScheduler,
    checkWeatherAndNotifyAllUsers
};
