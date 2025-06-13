export function isTokenExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const now = Date.now() / 1000; // en segundos
    return payload.exp < now;
  } catch (error) {
    return true; 
  }
}
