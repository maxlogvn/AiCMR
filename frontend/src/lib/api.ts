import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: '/backend/api/v1',
});

let csrfTokenPromise: Promise<string | null> | null = null;

export async function getCsrfToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  if (!csrfTokenPromise) {
    csrfTokenPromise = (async () => {
      try {
        // Đảm bảo URL chính xác và gửi credentials
        const response = await axios.get('/backend/api/v1/csrf-token', { 
          withCredentials: true,
          headers: { 'Cache-Control': 'no-cache' } 
        });
        return response.data.csrf_token;
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        csrfTokenPromise = null;
        return null;
      }
    })();
  }
  return csrfTokenPromise;
}

export async function initCsrfToken() {
  await getCsrfToken();
}

let isRefreshing = false;

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      const csrf = await getCsrfToken();
      if (csrf) {
        config.headers['X-CSRF-Token'] = csrf;
        config.withCredentials = true;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    // Handle CSRF token expiration/invalid
    if (error.response?.status === 403 && (error.response.data as { detail?: string })?.detail === "Invalid CSRF token") {
      csrfTokenPromise = null;
      const newToken = await getCsrfToken();
      if (newToken && originalRequest.headers) {
        originalRequest.headers['X-CSRF-Token'] = newToken;
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          const checkToken = setInterval(() => {
            if (!isRefreshing) {
              clearInterval(checkToken);
              const newToken = localStorage.getItem('access_token');
              if (newToken && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(api(originalRequest));
              } else {
                resolve(Promise.reject(error));
              }
            }
          }, 100);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
        const { access_token, refresh_token: new_refresh_token } = response.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
