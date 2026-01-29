export function getCookie(name: string): string | void {
  const cookies = document.cookie;
  const value = cookies
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return value;
}

export function setCookie(name: string, value: string, maxAge?: number): void {
  let cookie = `${name}=${value}; path=/;`;
  if (maxAge) {
    cookie += ` max-age=${maxAge};`;
  }
  document.cookie = cookie;
}

export function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
