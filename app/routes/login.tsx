import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { css } from 'styled-system/css';

import KakaoLogo from '~/assets/logo_kakao.svg?react';
import GoogleLogo from '~/assets/logo_google.svg?react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  /** TODO :: FOR AUTH TEST */
  useEffect(() => {
    const userName = searchParams.get('name');

    if (userName) {
      window.alert(`반갑습니다. ${userName}님!`);
      navigate('/');
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
