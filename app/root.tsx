import { useEffect } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
} from 'react-router';

import { initMSWClient, initMSWServer } from '~/mocks';
import type { Route } from './+types/root';
import stylesheet from './app.css?url';
import { css } from 'styled-system/css';
import { useSearchHistory } from './store/useSearchHistory';

initMSWServer();

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body
        className={css({
          width: '100dvw',
          height: '100dvh',
        })}
      >
        <div
          className={css({
            margin: 'auto',
            maxWidth: '360px',
            height: '100%',
            display: 'flex',
            backgroundColor: '#E5E7EB',
            overflowX: 'hidden',
          })}
        >
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
        <script
          src='https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js'
          integrity='sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1'
          crossOrigin='anonymous'
        />
      </body>
    </html>
  );
}

export default function App() {
  const { initialize: initializeSearchHistory } = useSearchHistory();

  useEffect(() => {
    function initApp() {
      return initMSWClient();
    }

    initApp();
  }, []);

  useEffect(() => {
    if (window.Kakao) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  useEffect(() => {
    initializeSearchHistory();
  }, []);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
