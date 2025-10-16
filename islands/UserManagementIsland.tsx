import { useState, useEffect } from "preact/hooks";
import Modal from "../components/Modal.tsx";

export default function UserManagementIsland() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.Role === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdmin();
  }, []);

  const handleCreateUser = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          Nombre: nombre,
          ApellidoPaterno: apellidoPaterno,
          ApellidoMaterno: apellidoMaterno,
          Correo: correo,
          Contraseña: contraseña,
        }),
      });

      if (response.ok) {
        setMessage("Usuario creado exitosamente");
        setNombre("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setCorreo("");
        setContraseña("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al crear usuario");
      }
    } catch (_err) {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Gestión de Usuarios</h2>
        <p class="text-gray-600 dark:text-gray-400">Acceso denegado. Solo administradores pueden gestionar usuarios.</p>
      </div>
    );
  }

  return (
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Usuarios</h2>
        <button
          type="button"
          class="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-300"
          onClick={() => setShowModal(true)}
        >
          Crear Usuario
        </button>
      </div>

      <Modal
        show={showModal}
        maxWidth="lg"
        closeable
        onClose={() => setShowModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreateUser}>
            <div class="mb-4">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="nombre">Nombre</label>
              <input
                 class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="apellidoPaterno">Apellido Paterno</label>
              <input
                 class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="apellidoPaterno"
                type="text"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="apellidoMaterno">Apellido Materno</label>
              <input
                 class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="apellidoMaterno"
                type="text"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="correo">Correo</label>
              <input
                 class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="contraseña">Contraseña</label>
              <input
                 class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="contraseña"
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            {message && <p class="text-red-500 text-sm mb-4">{message}</p>}
            <button
              type="submit"
              class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Usuario"}
            </button>
          </form>
        </div>
      </Modal>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Lista de Usuarios</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <thead>
              <tr>
                <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
                <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</th>
                <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Correo</th>
                <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Rol</th>
                <th class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">1</td>
                <td class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">Usuario Ejemplo</td>
                <td class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">usuario@example.com</td>
                <td class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">user</td>
                <td class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <button type="button" class="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                  <button type="button" class="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
              {/* Más filas de usuarios aquí cuando agregues la lógica */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}