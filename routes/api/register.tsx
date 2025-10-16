import { define } from "../../utils.ts";
import { users } from "../../utils/users.ts";

export const handler = define.handlers({
  async POST(ctx: any) {
    try {
      const body = await ctx.req.json();
      const { Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Contraseña } = body;

      if (!Nombre || !ApellidoPaterno || !ApellidoMaterno || !Correo || !Contraseña) {
        return new Response(
          JSON.stringify({ error: "All fields are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check if user already exists
      const existingUser = users.find((u) => u.correo === Correo);
      if (existingUser) {
        return new Response(
          JSON.stringify({ error: "User already exists" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        nombre: Nombre,
        apellidoPaterno: ApellidoPaterno,
        apellidoMaterno: ApellidoMaterno,
        correo: Correo,
        contraseña: Contraseña,
        role: "user",
      };

      users.push(newUser);

      return new Response(
        JSON.stringify({
          ID: newUser.id,
          Nombre: newUser.nombre,
          ApellidoPaterno: newUser.apellidoPaterno,
          ApellidoMaterno: newUser.apellidoMaterno,
          Correo: newUser.correo,
          Role: newUser.role,
          CreatedAt: new Date().toISOString(),
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (_error) {
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
});