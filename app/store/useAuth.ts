import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { clientFetcher } from '~/lib/axios/client';
import { getCookie, removeCookie, setCookie } from '~/utils/cookie';

interface AuthStore {
  userInfo: null | {
    id: number;
    nickname: string;
  };
  isLoggedIn: boolean;
  fetchUserInfo: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthStore>()(
  devtools(
    (set) => ({
      userInfo: null,
      isLoggedIn: false,
      fetchUserInfo: async () => {
        const accessToken = getCookie(import.meta.env.VITE_AT_ID);
        const refreshToken = getCookie(import.meta.env.VITE_RT_ID);

        if (!refreshToken && !accessToken) {
          return;
        }

        try {
          if (!accessToken) {
            const { data } = await clientFetcher.post<{
              accessToken: string;
              refreshToken: string;
              tokenType: string;
              expiresIn: number;
            }>('/auth/refresh');

            setCookie(import.meta.env.VITE_AT_ID, data.accessToken);
          }

          const { data } = await clientFetcher.get<{ id: number; nickname: string }>('/user/me');

          set((prev) => ({
            ...prev,
            isLoggedIn: true,
            userInfo: data,
          }));
        } catch (error) {
          removeCookie(import.meta.env.VITE_AT_ID);
          removeCookie(import.meta.env.VITE_RT_ID);

          set((prev) => ({
            ...prev,
            isLoggedIn: false,
            userInfo: null,
          }));

          return error;
        }
      },
      logout: async () => {
        try {
          await clientFetcher.post<string>('/auth/logout');
        } catch (error) {
          console.error('Failed logout request');
        } finally {
          removeCookie(import.meta.env.VITE_AT_ID);
          removeCookie(import.meta.env.VITE_RT_ID);

          set((prev) => ({
            ...prev,
            isLoggedIn: false,
            userInfo: null,
          }));
        }
      },
    }),
    {
      enabled: import.meta.env.DEV,
    },
  ),
);
