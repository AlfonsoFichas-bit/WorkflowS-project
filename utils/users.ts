// Shared user store (in production, use a database)
export let users: Array<{
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contraseña: string;
  role: string;
}> = [
  {
    id: 1,
    nombre: "John",
    apellidoPaterno: "Doe",
    apellidoMaterno: "Smith",
    correo: "user@example.com",
    contraseña: "password123",
    role: "user",
  },
  {
    id: 2,
    nombre: "Admin",
    apellidoPaterno: "User",
    apellidoMaterno: "",
    correo: "admin@example.com",
    contraseña: "admin123",
    role: "admin",
  },
];