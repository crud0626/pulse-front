export async function initMSWClient() {
  if (import.meta.env.DEV && window) {
    const { worker } = await import('./browser');
    return worker.start();
  }
}

export async function initMSWServer() {
  if (import.meta.env.DEV && typeof window === 'undefined') {
    const { server } = await import('./node');
    server.listen();
  }
}