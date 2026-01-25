import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';

import KakaoLogo from '~/assets/logo_kakao.svg?react';
import GoogleLogo from '~/assets/logo_google.svg?react';
import { getCookie } from '~/utils/cookie';
import { useAuth } from '~/store/useAuth';

export default function LoginPage() {
  const { isLoggedIn, userInfo, fetchUserInfo } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const googleLoginUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    googleLoginUrl.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    googleLoginUrl.searchParams.set('redirect_uri', import.meta.env.VITE_GOOGLE_REDIRECT_URI);
    googleLoginUrl.searchParams.set('response_type', 'code');
    googleLoginUrl.searchParams.set('scope', 'profile email');

    window.location.href = googleLoginUrl.toString();
  };

  const handleKakaoLogin = () => {
    window.Kakao?.Auth.authorize({
      redirectUri: `${window.location.origin}/api/auth/kakao/callback`,
      scope: 'profile_nickname',
    });
  };

  const getUserInfo = async () => {
    try {
      fetchUserInfo();
      navigate('/');
    } catch (error) {
      window.alert('사용자 정보를 가져오는 데 실패하였습니다.');
    }
  };

  useEffect(() => {
    const accessToken = getCookie(import.meta.env.VITE_AT_ID);

    if (!isLoggedIn && accessToken) {
      getUserInfo();
    }
  }, []);

  return (
    <div
      className={css({
        width: '100%',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      })}
    >
      <h2
        className={css({
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
        })}
      >
        PULSE
      </h2>
      <div
        className={css({
          paddingTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        })}
      >
        <button
          onClick={handleKakaoLogin}
          className={css({
            width: '100%',
            height: '52px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FEE500',
            borderRadius: '12px',
            fontFamily: `-apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", 
             Arial, sans-serif;`,
          })}
        >
          <KakaoLogo />
          <p>Login with Kakao</p>
        </button>
        <button
          onClick={handleGoogleLogin}
          className={css({
            width: '100%',
            height: '52px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'white',
            borderRadius: '12px',
          })}
        >
          <GoogleLogo />
          <p>Login with Google</p>
        </button>
      </div>
    </div>
  );
}
