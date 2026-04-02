import { API_ENDPOINTS } from '../config';

export const authService = {
    register: async (userData) => {
        const response = await fetch(API_ENDPOINTS.register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    login: async (credentials) => {
        const response = await fetch(API_ENDPOINTS.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return response.json();
    }
};

export const weatherService = {
    getWeather: async (token) => {
        const response = await fetch(API_ENDPOINTS.weather, {
            headers: { 'Authorization': token }
        });
        return response.json();
    },

    getWeatherByCity: async (city, token) => {
        const response = await fetch(`${API_ENDPOINTS.weatherByCity}?city=${encodeURIComponent(city)}`, {
            headers: { 'Authorization': token }
        });
        return response.json();
    },

    getPublicWeather: async (city) => {
        const response = await fetch(`${API_ENDPOINTS.publicWeather}?city=${encodeURIComponent(city)}`);
        return response.json();
    }
};

export const tokenService = {
    saveToken: async (tokenData) => {
        const response = await fetch(API_ENDPOINTS.saveToken, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tokenData)
        });
        return response;
    }
};
