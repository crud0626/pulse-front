import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: ['./app/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: 'styled-system',
  globalCss: {
    body: {
      fontFamily: 'Pretendard, sans-serif',
    },
    button: {
      cursor: 'pointer',
    },
  },
  globalFontface: {
    Pretendard: [
      {
        src: 'url(/fonts/Pretendard-Thin.woff2) format("woff2")',
        fontWeight: 100,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-ExtraLight.woff2) format("woff2")',
        fontWeight: 200,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-Light.woff2) format("woff2")',
        fontWeight: 300,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-Regular.woff2) format("woff2")',
        fontWeight: 400,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-Medium.woff2) format("woff2")',
        fontWeight: 500,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-SemiBold.woff2) format("woff2")',
        fontWeight: 600,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-Bold.woff2) format("woff2")',
        fontWeight: 700,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-ExtraBold.woff2) format("woff2")',
        fontWeight: 800,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(/fonts/Pretendard-Black.woff2) format("woff2")',
        fontWeight: 900,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
    ],
  },
});
