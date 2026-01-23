export class TokenRefreshError extends Error {
  constructor(message = 'Failed to refresh token') {
    super(message);
    this.name = 'TokenRefreshError';
  }
}
