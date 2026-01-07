import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { css } from 'styled-system/css';
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google';
import KakaoLogo from '~/assets/logo_kakao.svg?react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleKakaoLogin = () => {
    window.Kakao?.Auth.authorize({
      redirectUri: `${window.location.origin}/api/auth/kakao/callback`,
      scope: 'profile_nickname',
    });
  };

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      window.alert('로그인 성공!');
    } else {
      window.alert('로그인 실패!');
    }
  };

  const handleError = () => {
    window.alert('로그인 실패!');
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
        margin: 'auto',
        height: '100dvh',
        maxWidth: '384px',
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
            cursor: 'pointer',
          })}
        >
          <KakaoLogo />
          <p>Login with Kakao</p>
        </button>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            logo_alignment='center'
            text='signin_with'
            shape='square'
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
