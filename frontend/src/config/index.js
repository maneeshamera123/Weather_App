const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    register: `${API_BASE_URL}/api/creatuser`,
    login: `${API_BASE_URL}/api/loginuser`,
    weather: `${API_BASE_URL}/api/weather`,
    weatherByCity: `${API_BASE_URL}/api/weather-by-city`,
    publicWeather: `${API_BASE_URL}/api/public-weather`,
    saveToken: `${API_BASE_URL}/api/save-token`,
    sendNotification: `${API_BASE_URL}/api/send-notification`
};
