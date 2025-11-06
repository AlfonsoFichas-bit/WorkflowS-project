import { useState } from "preact/hooks";

export default function RegisterIsland() {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmContraseña, setConfirmContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (contraseña !== confirmContraseña) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al registrar usuario");
      }
    } catch (_err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-center text-primary mb-6">
          Registro Exitoso
        </h1>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
          Tu cuenta ha sido creada. Ahora puedes{" "}
          <a
            href="/login"
            class="font-medium text-primary dark:text-primary hover:underline"
          >
            iniciar sesión
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h1 class="text-2xl font-bold text-center text-primary dark:text-primary mb-6">
        Crear Cuenta
      </h1>
      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            for="nombre"
          >
            Nombre
          </label>
          <input
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            for="apellidoPaterno"
          >
            Apellido Paterno
          </label>
          <input
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
            id="apellidoPaterno"
            type="text"
            value={apellidoPaterno}
            onChange={(e) =>
              setApellidoPaterno((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            for="apellidoMaterno"
          >
            Apellido Materno
          </label>
          <input
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
            id="apellidoMaterno"
            type="text"
            value={apellidoMaterno}
            onChange={(e) =>
              setApellidoMaterno((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            for="correo"
          >
            Correo Electrónico
          </label>
          <input
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            for="contraseña"
          >
            Contraseña
          </label>
          <input
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
            id="contraseña"
            type="password"
            value={contraseña}
            onChange={(e) =>
              setContraseña((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            for="confirmContraseña"
          >
            Confirmar Contraseña
          </label>
          <input
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
            id="confirmContraseña"
            type="password"
            value={confirmContraseña}
            onChange={(e) =>
              setConfirmContraseña((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        {error && (
          <p class="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
        )}
        <button
          type="submit"
          class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <a
            class="font-medium text-primary dark:text-primary hover:underline"
            href="/login"
          >
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
