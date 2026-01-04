import axios from 'axios';
import { redirect, type LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const redirectUrl = new URL('/login', request.url);

  try {
    const url = new URL(request.url);
    const authCode = url.searchParams.get('code');

    if (!authCode) throw Error();

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID ?? '',
      redirect_uri: url.origin + url.pathname,
      code: authCode,
      client_secret: process.env.KAKAO_CLIENT_SECRET ?? '',
    });

    const response = await axios.post('https://kauth.kakao.com/oauth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const accessToken = response.data.access_token;

    const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    redirectUrl.searchParams.set('name', userInfoResponse.data.properties.nickname);

    return redirect(`${redirectUrl.pathname}${redirectUrl.search}`);
  } catch (error) {
    console.error('Kakao Auth Error');
    console.dir(error);

    return Response.json({ message: 'no' }, { status: 400 });
  }
}
