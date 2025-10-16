// Simple JWT creation and verification functions
const JWT_SECRET = "your-secret-key";

export function createJWT(payload: Record<string, unknown>): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(encodedHeader + "." + encodedPayload + "." + JWT_SECRET); // Not secure, just for demo
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const encodedPayload = parts[1];
    const payload = JSON.parse(atob(encodedPayload));
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    // Verify signature (simplified, not secure)
    const expectedSignature = btoa(parts[0] + "." + parts[1] + "." + JWT_SECRET);
    if (parts[2] !== expectedSignature) return null;
    return payload;
  } catch {
    return null;
  }
}