const axios = require('axios');

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const weatherCodeDescriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};

function getWeatherDescription(code) {
    return weatherCodeDescriptions[code] || 'Unknown';
}

function isExtremeWeather(weatherCode, temperature, precipitationProb, windSpeed) {
    const extremeConditions = [];

    if (weatherCode >= 95) {
        extremeConditions.push('Thunderstorm');
    }
    if (weatherCode >= 61 && weatherCode <= 67) {
        extremeConditions.push('Rain');
    }
    if (weatherCode >= 71 && weatherCode <= 77) {
        extremeConditions.push('Snow');
    }
    if (weatherCode >= 80 && weatherCode <= 82) {
        extremeConditions.push('Rain showers');
    }
    if (weatherCode >= 85 && weatherCode <= 86) {
        extremeConditions.push('Snow showers');
    }
    if (weatherCode >= 51 && weatherCode <= 57) {
        extremeConditions.push('Drizzle');
    }
    if (weatherCode === 45 || weatherCode === 48) {
        extremeConditions.push('Fog');
    }

    if (temperature > 35) {
        extremeConditions.push(`High temperature: ${temperature}°C`);
    }
    if (temperature < 5) {
        extremeConditions.push(`Low temperature: ${temperature}°C`);
    }
    if (precipitationProb > 70) {
        extremeConditions.push(`High rain probability: ${precipitationProb}%`);
    }
    if (windSpeed > 50) {
        extremeConditions.push(`High wind: ${windSpeed} km/h`);
    }

    return extremeConditions;
}

async function getCoordinatesForCity(cityName) {
    try {
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
        const response = await axios.get(geocodeUrl);
        
        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0];
            return {
                latitude: location.latitude,
                longitude: location.longitude,
                city: location.name,
                country: location.country
            };
        }
        return null;
    } catch (error) {
        console.error(`Error geocoding city ${cityName}:`, error.message);
        return null;
    }
}

async function getWeatherForecast(latitude, longitude) {
    try {
        const url = `${OPEN_METEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weathercode,wind_speed_10m&forecast_days=2&timezone=auto`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching weather:`, error.message);
        return null;
    }
}

function analyzeWeatherForAlerts(weatherData) {
    const alerts = [];
    const hourly = weatherData.hourly;
    const currentHour = new Date().getHours();

    for (let i = 0; i < Math.min(12, hourly.time.length); i++) {
        const hour = parseInt(hourly.time[i].split('T')[1].split(':')[0]);
        if (hour < currentHour) continue;

        const weatherCode = hourly.weathercode[i];
        const temperature = hourly.temperature_2m[i];
        const precipitationProb = hourly.precipitation_probability[i];
        const windSpeed = hourly.wind_speed_10m[i];
        const time = hourly.time[i];

        const extremes = isExtremeWeather(weatherCode, temperature, precipitationProb, windSpeed);
        
        if (extremes.length > 0) {
            alerts.push({
                time,
                weatherCode,
                description: getWeatherDescription(weatherCode),
                temperature,
                precipitationProb,
                windSpeed,
                conditions: extremes
            });
        }
    }

    return alerts;
}

async function checkWeatherForCity(cityName) {
    const location = await getCoordinatesForCity(cityName);
    if (!location) {
        return { success: false, error: 'City not found' };
    }

    const weatherData = await getWeatherForecast(location.latitude, location.longitude);
    if (!weatherData) {
        return { success: false, error: 'Failed to fetch weather data' };
    }

    const alerts = analyzeWeatherForAlerts(weatherData);

    return {
        success: true,
        location,
        alerts,
        hasAlerts: alerts.length > 0
    };
}

module.exports = {
    getCoordinatesForCity,
    getWeatherForecast,
    checkWeatherForCity,
    analyzeWeatherForAlerts,
    getWeatherDescription,
    isExtremeWeather
};
