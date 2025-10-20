import { useState, useEffect } from "preact/hooks";
import Modal from "../components/Modal.tsx";
import { MaterialSymbol } from "../components/MaterialSymbol.tsx";

interface Project {
  ID: number;
  Nombre: string;
  Descripcion: string;
  Estado: string;
  CreatedAt: string;
}

export default function ProjectsIsland() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingProjects(true);
    try {
      const response = await fetch("http://localhost:8080/api/projects", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setNombre(project.Nombre);
    setDescripcion(project.Descripcion);
    setEstado(project.Estado);
    setMessage("");
    setShowEditModal(true);
  };

  const handleUpdateProject = async (e: Event) => {
    e.preventDefault();
    if (!editingProject) return;

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/projects/${editingProject.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          Nombre: nombre,
          Descripcion: descripcion,
          Estado: estado,
        }),
      });

      if (response.ok) {
        setMessage("Proyecto actualizado exitosamente");
        setShowEditModal(false);
        setEditingProject(null);
        fetchProjects();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al actualizar proyecto");
      }
    } catch (_err) {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("Proyecto eliminado exitosamente");
        fetchProjects();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al eliminar proyecto");
      }
    } catch (_err) {
      setMessage("Error de conexión");
    }
  };

  const handleCreateProject = async (e: Event) => {
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
      const response = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          Nombre: nombre,
          Descripcion: descripcion,
          Estado: estado,
        }),
      });

      if (response.ok) {
        setMessage("Proyecto creado exitosamente");
        setNombre("");
        setDescripcion("");
        setEstado("");
        setShowModal(false);
        fetchProjects();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al crear proyecto");
      }
    } catch (_err) {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.Nombre.toLowerCase().includes(search.toLowerCase()) ||
      project.Descripcion.toLowerCase().includes(search.toLowerCase()) ||
      project.Estado.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, search]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Gestión de Proyectos</h2>
        <button
          type="button"
          class="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-300"
          onClick={() => {
            setNombre("");
            setDescripcion("");
            setEstado("");
            setMessage("");
            setShowModal(true);
          }}
        >
          Crear Proyecto
        </button>
      </div>

      <Modal
        show={showModal}
        maxWidth="lg"
        closeable
        onClose={() => setShowModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Crear Nuevo Proyecto</h2>
          <form onSubmit={handleCreateProject}>
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="descripcion">Descripción</label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="estado">Estado</label>
              <select
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                id="estado"
                value={estado}
                onChange={(e) => setEstado((e.target as HTMLInputElement).value)}
                required
              >
                <option value="">Seleccionar Estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            {message && <p class="text-red-500 text-sm mb-4">{message}</p>}
            <button
              type="submit"
              class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        show={showEditModal}
        maxWidth="lg"
        closeable
        onClose={() => setShowEditModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Editar Proyecto</h2>
          <form onSubmit={handleUpdateProject}>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="editNombre">Nombre</label>
              <input
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="editNombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="editDescripcion">Descripción</label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="editDescripcion"
                value={descripcion}
                onChange={(e) => setDescripcion((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2" for="editEstado">Estado</label>
              <select
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                id="editEstado"
                value={estado}
                onChange={(e) => setEstado((e.target as HTMLInputElement).value)}
                required
              >
                <option value="">Seleccionar Estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            {message && <p class="text-red-500 dark:text-red-400 text-sm mb-4">{message}</p>}
            <button
              type="submit"
              class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Proyecto"}
            </button>
          </form>
        </div>
      </Modal>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Lista de Proyectos</h3>

        <div class="mb-4">
          <input
            type="text"
            placeholder="Buscar proyectos por nombre, descripción o estado..."
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingProjects ? (
            <div class="col-span-full text-center text-gray-500 dark:text-gray-400">Cargando proyectos...</div>
          ) : projects.length === 0 ? (
            <div class="col-span-full text-center text-gray-500 dark:text-gray-400">No hay proyectos registrados.</div>
          ) : (
            paginatedProjects.map((project) => (
              <div key={project.ID} class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{project.Nombre}</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">{project.Descripcion}</p>
                <div class="flex justify-between items-center mb-4">
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.Estado === 'activo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    project.Estado === 'inactivo' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {project.Estado.charAt(0).toUpperCase() + project.Estado.slice(1)}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">ID: {project.ID}</span>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" class="text-blue-600 hover:text-blue-800" onClick={() => handleEditProject(project)} title="Editar">
                    <MaterialSymbol icon="edit" className="icon-md" />
                  </button>
                  <button type="button" class="text-red-600 hover:text-red-800" onClick={() => handleDeleteProject(project.ID)} title="Eliminar">
                    <MaterialSymbol icon="delete" className="icon-md" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div class="flex justify-center items-center mt-4 space-x-2">
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span class="px-3 py-2 text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}