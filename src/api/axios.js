import axios from "axios";

export const authorizedClient = axios.create({
    headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
    },
    baseURL: import.meta.env.VITE_APP_API_URL + '/api',
})
export const unAuthorizedClient = axios.create({
    headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
    },
    baseURL: import.meta.env.VITE_APP_API_URL + '/api',
})

authorizedClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('tt_accessToken')}`

    if (config.method === 'patch') {
        config.headers['Content-Type'] = 'application/merge-patch+json'
    }

    config.headers['Accept-Languages'] = localStorage.getItem('tt_lang') || 'uz'

    return config;
});

