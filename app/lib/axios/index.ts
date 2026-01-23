import { type CreateAxiosDefaults } from 'axios';

export interface ErrorResponse {
  errorCode: string;
  message: string;
  timestamp: string;
}

export const commonFetcherOptions: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};
