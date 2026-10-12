export interface JwtPayload {
  sub: number;
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export default class JwtDecoder {
  // Decodes the payload only. The signature is verified by the backend, never by the client.
  public static decode(token: string): JwtPayload | null {
    const segments = token.split('.');
    const payloadSegment = segments[1];

    if (segments.length !== 3 || !payloadSegment) {
      return null;
    }

    try {
      const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
      const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload;
    } catch {
      return null;
    }
  }

  public static isExpired(token: string): boolean {
    const payload = JwtDecoder.decode(token);

    if (!payload) {
      return true;
    }

    if (payload.exp === undefined) {
      return false;
    }

    return payload.exp * 1000 <= Date.now();
  }
}
