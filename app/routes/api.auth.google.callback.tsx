import axios from 'axios';
import { redirect, type LoaderFunctionArgs } from 'react-router';

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

export async function loader({ request }: LoaderFunctionArgs) {
  const redirectUrl = new URL('/login', request.url);

  try {
    const url = new URL(request.url);
    const authCode = url.searchParams.get('code');

    if (!authCode) throw Error('Google authentication code is missing.');

    const { data } = await axios.post<LoginResponse>(`${process.env.VITE_API_ENDPOINT}/auth/login`, {
      providerType: 'GOOGLE',
      authorizationCode: authCode,
      redirectUri: process.env.VITE_GOOGLE_REDIRECT_URI,
    });

    // FOR TEST
    redirectUrl.searchParams.set('name', data.user.nickname);

    return redirect(`${redirectUrl.pathname}${redirectUrl.search}`);
  } catch (error) {
    console.error('== Google Auth Error');
    console.dir(error);

    // FOR TEST
    return Response.json({ message: 'no' }, { status: 400 });
  }
}
