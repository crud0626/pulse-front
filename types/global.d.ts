interface AuthorizeSettings {
  redirectUri?: string;
  state?: string;
  /**
   * 사용자에게 동의 요청할 동의항목 ID 목록, 쉼표로 구분된 문자열
   */
  scope?: string;
  /**
   * 동의 화면에 상호작용 추가 요청 프롬프트
   */
  prompt?: string;
  // login: 사용자 재인증, Reauthenticate user
  // none: 카카오톡에서 자동 로그인, Auto-login
  // create: 카카오계정 가입 후 로그인, Login after signing up for a Kakao Account
  // select_account: 카카오계정 간편로그인, Kakao Account easy login

  loginHint?: string;
  nonce?: string;
  /**
   * 간편로그인 사용 여부
   * @default true
   */
  throughTalk?: boolean;
}

declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => void;
      Auth: {
        authorize: (settings: AuthorizeSettings) => void;
      };
    };
  }
}

export {};
