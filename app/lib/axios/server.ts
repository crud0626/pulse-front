import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { commonFetcherOptions, type ErrorResponse } from '.';
import { TokenRefreshError } from '../errors';
import { getCookie, setCookie } from '../../utils/cookie';

export const serverFetcher = axios.create(commonFetcherOptions);

// TODO :: 서버 전용으로 수정 예정
// serverFetcher.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     /** TODO :: status === 401 && data.errorCode === 'ACCESS_TOKEN_EXPIRED' 이 아닐 때만 console 찍는 용으로만 사용 */
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     if (axios.isAxiosError(error) && error.response) {
//       const { status } = error.response;
//       const data = error.response.data as ErrorResponse;

//       if (status === 401 && data.errorCode === 'ACCESS_TOKEN_EXPIRED' && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           const refreshToken = getCookie();
//           const { data } = await serverFetcher.post<{
//             accessToken: string;
//             refreshToken: string;
//             expiresIn: number;
//           }>('/auth/refresh', { refreshToken });

//           // 여기도 서버 only임. originalRequest

//           setCookie('accessToken', data.accessToken);
//           setCookie('refreshToken', data.refreshToken);

//           return serverFetcher(originalRequest);
//         } catch {
//           throw new TokenRefreshError();
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );
