import { define } from "../../utils.ts";

// Import shared user store and JWT functions (in production, use a database)
import { users } from "../../utils/users.ts";
import { createJWT } from "../../utils/jwt.ts";

// Simple JWT verification function
function verifyJWT(token: string, secret: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const encodedPayload = parts[1];
    const payload = JSON.parse(atob(encodedPayload));
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    // Verify signature (simplified, not secure)
    const expectedSignature = btoa(parts[0] + "." + parts[1] + "." + secret);
    if (parts[2] !== expectedSignature) return null;
    return payload;
  } catch {
    return null;
  }
}

export const handler = define.handlers({
  async POST(ctx: { req: { json: () => Promise<{ correo?: string; contraseña?: string }> } }) {
    try {
      const body = await ctx.req.json();
      const { correo, contraseña } = body;

      console.log("Login attempt:", { correo, contraseña }); // Debug log

      if (!correo || !contraseña) {
        return new Response(
          JSON.stringify({ error: "Correo and contraseña are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Find user by correo
      const user = users.find((u) => u.correo === correo);

      if (!user || user.contraseña !== contraseña) {
        console.log("Invalid credentials for:", correo); // Debug log
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      // Create JWT payload
      const payload = {
        id: user.id,
        correo: user.correo,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      };

      // Sign the JWT
      const token = createJWT(payload);

      return new Response(
        JSON.stringify({ token }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (_error) {
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
});