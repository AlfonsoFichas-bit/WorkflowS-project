import { useState } from "preact/hooks";

export default function LoginIsland() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token in localStorage or sessionStorage
        localStorage.setItem("token", data.token);
        // Redirect to dashboard
        globalThis.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al iniciar sesión");
      }
    } catch (_err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="mb-4">
         <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" for="email">Correo Electrónico / Usuario</label>
         <input
           class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
           id="email"
           name="email"
           type="email"
           value={email}
           onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
           placeholder="Ingresa tu correo o usuario"
           required
         />
      </div>
      <div class="mb-6">
         <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" for="password">Contraseña</label>
         <input
           class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
           id="password"
           name="password"
           type="password"
           value={password}
           onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
           placeholder="Ingresa tu contraseña"
           required
         />
      </div>
       {error && <p class="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>}
      <button
        type="submit"
        class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Iniciando..." : "Iniciar Sesión"}
      </button>
       <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
         ¿No tienes una cuenta? <a class="font-medium text-primary dark:text-primary hover:underline" href="/register">Regístrate</a>
       </p>
    </form>
  );
}