import axios from 'axios';
import { createCookie, redirect, type LoaderFunctionArgs } from 'react-router';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: number;
    nickname: string;
    role: string;
  };
}

const accessToken = createCookie(import.meta.env.VITE_AT_ID, {
  secure: import.meta.env.PROD,
  sameSite: 'strict',
  httpOnly: false,
});

const refreshToken = createCookie(import.meta.env.VITE_RT_ID, {
  secure: import.meta.env.PROD,
  sameSite: 'strict',
  httpOnly: false,
});

export async function loader({ request }: LoaderFunctionArgs) {
  const redirectUrl = new URL('/login', request.url);

  try {
    const url = new URL(request.url);
    const authCode = url.searchParams.get('code');

    if (!authCode) throw Error('Kakao authentication code is missing.');

    const { data } = await axios.post<LoginResponse>(`${process.env.VITE_API_ENDPOINT}/auth/login`, {
      providerType: 'KAKAO',
      authorizationCode: authCode,
      redirectUri: process.env.KAKAO_REDIRECT_URI,
    });

    const headers = new Headers();
    headers.append('Set-Cookie', await accessToken.serialize(data.accessToken));
    headers.append('Set-Cookie', await refreshToken.serialize(data.refreshToken));

    return redirect(`${redirectUrl.pathname}${redirectUrl.search}`, {
      headers,
    });
  } catch (error) {
    console.error('== Kakao Auth Error');
    console.dir(error);

    // FOR TEST
    return Response.json({ message: 'no' }, { status: 400 });
  }
}
