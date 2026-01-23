import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { commonFetcherOptions, type ErrorResponse } from '.';
import { TokenRefreshError } from '../errors';
import { getCookie, setCookie } from '../../utils/cookie';

export const clientFetcher = axios.create(commonFetcherOptions);

clientFetcher.interceptors.request.use((config) => {
  const accessToken = getCookie(import.meta.env.VITE_AT_ID);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${JSON.parse(atob(decodeURIComponent(accessToken)))}`;
  }

  return config;
});

clientFetcher.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      const data = error.response.data as ErrorResponse;

      if (status === 401 && data.errorCode === 'ACCESS_TOKEN_EXPIRED' && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getCookie('refreshToken');
          const { data } = await clientFetcher.post<{
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
          }>('/auth/refresh', { refreshToken });

          setCookie('accessToken', data.accessToken);
          setCookie('refreshToken', data.refreshToken);

          return clientFetcher(originalRequest);
        } catch {
          throw new TokenRefreshError();
        }
      }
    }

    return Promise.reject(error);
  }
);
