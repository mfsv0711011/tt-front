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


let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
}

function logout() {
    localStorage.removeItem('tt_accessToken');
    localStorage.removeItem('tt_refreshToken');
    location.href = '/login'
}

authorizedClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        return authorizedClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('tt_refreshToken');
            console.log(refreshToken)
            if (!refreshToken) {
                logout();
                return Promise.reject(error);
            }

            try {
                const response = await unAuthorizedClient.post('/users/auth/refreshToken', {
                    refreshToken: refreshToken
                });

                const newAccessToken = response.data.accessToken;
                localStorage.setItem('tt_accessToken', newAccessToken);

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                return authorizedClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);