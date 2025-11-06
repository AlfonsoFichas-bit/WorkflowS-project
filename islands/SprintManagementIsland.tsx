import { useEffect, useState } from "preact/hooks";
import Modal from "../components/Modal.tsx";
import { MaterialSymbol } from "../components/MaterialSymbol.tsx";

interface User {
  ID: number;
  Nombre: string;
  ApellidoPaterno: string;
  Correo: string;
}

interface Project {
  ID: number;
  Name: string;
  Description: string;
  Status: string;
  CreatedAt: string;
}

interface Member {
  ID: number;
  UserID: number;
  User: User;
  ProjectID: number;
  Role: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Sprint {
  ID: number;
  Name: string;
  Goal: string; // El backend usa "Goal" no "Description"
  Status: string;
  StartDate: string;
  EndDate: string;
  ProjectID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export default function SprintManagementIsland() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [filteredSprints, setFilteredSprints] = useState<Sprint[]>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("planning"); // Valor por defecto
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
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
        setUserRole(userData.Role);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchSprints = async (projectId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingSprints(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}/sprints`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const sprintsData = await response.json();
        setSprints(sprintsData);
      } else {
        console.error("Failed to fetch sprints");
      }
    } catch (error) {
      console.error("Error fetching sprints:", error);
    } finally {
      setLoadingSprints(false);
    }
  };

  const handleEditSprint = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setName(sprint.Name);
    setDescription(sprint.Goal);
    setStartDate(sprint.StartDate);
    setEndDate(sprint.EndDate);
    setStatus(sprint.Status);
    setMessage("");
    setShowEditModal(true);
  };

  const handleUpdateSprint = async (e: Event) => {
    e.preventDefault();
    if (!editingSprint) return;

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      setLoading(false);
      return;
    }

    try {
      // Enviar el objeto Sprint completo como espera el backend
      const updatedSprint = {
        ID: editingSprint.ID,
        Name: name,
        Goal: description,
        StartDate: startDate ? new Date(startDate).toISOString() : editingSprint.StartDate,
        EndDate: endDate ? new Date(endDate).toISOString() : editingSprint.EndDate,
        Status: status,
        ProjectID: editingSprint.ProjectID, // Incluir el ProjectID original
        CreatedAt: editingSprint.CreatedAt, // Incluir fecha de creación original
        UpdatedAt: new Date().toISOString(), // Actualizar fecha de modificación
      };

      console.log("Enviando datos actualizados del sprint:", updatedSprint);

      const response = await fetch(
        `http://localhost:8080/api/sprints/${editingSprint.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSprint),
        },
      );

      if (response.ok) {
        setMessage("Sprint actualizado exitosamente");
        setShowEditModal(false);
        setEditingSprint(null);
        if (selectedProject) {
          fetchSprints(selectedProject.ID);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        setMessage(errorData.error || errorData.message || "Error al actualizar sprint");
      }
    } catch (_err) {
      console.error("Error de conexión:", _err);
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSprint = async (sprintId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este sprint?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/sprints/${sprintId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setMessage("Sprint eliminado exitosamente");
        if (selectedProject) {
          fetchSprints(selectedProject.ID);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al eliminar sprint");
      }
    } catch (_err) {
      setMessage("Error de conexión");
    }
  };

  const handleCreateSprint = async (e: Event) => {
    e.preventDefault();
    if (!selectedProject) return;

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      setLoading(false);
      return;
    }

    // Preparar datos con el formato correcto
    const sprintData = {
      Name: name,
      Goal: description, // El backend espera "Goal" no "Description"
      Status: status, // Incluir el estado seleccionado
      StartDate: startDate ? new Date(startDate).toISOString() : null,
      EndDate: endDate ? new Date(endDate).toISOString() : null,
    };

    console.log("Enviando datos del sprint:", sprintData);

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${selectedProject.ID}/sprints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(sprintData),
        },
      );

      if (response.ok) {
        setMessage("Sprint creado exitosamente");
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setStatus("planning"); // Resetear al valor por defecto
        setShowModal(false);
        fetchSprints(selectedProject.ID);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        setMessage(errorData.error || errorData.message || "Error al crear sprint");
      }
    } catch (_err) {
      console.error("Error de conexión:", _err);
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    fetchSprints(project.ID);
  };

  const canCreateSprint = (role: string) => {
    return role === "admin" || role === "scrum_master" || role === "product_owner";
  };

  useEffect(() => {
    const filtered = sprints.filter((sprint) =>
      sprint.Name.toLowerCase().includes(search.toLowerCase()) ||
      sprint.Goal?.toLowerCase().includes(search.toLowerCase()) ||
      sprint.Status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSprints(filtered);
    setCurrentPage(1);
  }, [sprints, search]);

  const totalPages = Math.ceil(filteredSprints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSprints = filteredSprints.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Gestión de Sprints
        </h2>
        <div class="flex items-center space-x-4">
          <select
            class="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
            value={selectedProject?.ID || ""}
            onChange={(e) => {
              const project = projects.find(
                (p) => p.ID === Number((e.target as HTMLSelectElement).value),
              );
              if (project) {
                handleProjectSelect(project);
              }
            }}
          >
            <option value="">Seleccionar Proyecto</option>
            {projects.map((project) => (
              <option key={project.ID} value={project.ID}>
                {project.Name}
              </option>
            ))}
          </select>
          {selectedProject && canCreateSprint(userRole) && (
            <button
              type="button"
              class="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-300"
              onClick={() => {
                setName("");
                setDescription("");
                setStartDate("");
                setEndDate("");
                setStatus("planning"); // Resetear al valor por defecto
                setMessage("");
                setShowModal(true);
              }}
            >
              Crear Sprint
            </button>
          )}
        </div>
      </div>

      {!selectedProject ? (
        <div class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400">
            Selecciona un proyecto para gestionar sus sprints
          </p>
        </div>
      ) : !canCreateSprint(userRole) ? (
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <p class="text-yellow-800 dark:text-yellow-200">
            Solo Scrum Master y Product Owner pueden crear sprints
          </p>
        </div>
      ) : null}

      <Modal
        show={showModal}
        maxWidth="lg"
        closeable
        onClose={() => setShowModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Crear Nuevo Sprint
          </h2>
          <form onSubmit={handleCreateSprint}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="name"
              >
                Nombre del Sprint
              </label>
              <input
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="description"
              >
                Descripción/Objetivo
              </label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="startDate"
                >
                  Fecha de Inicio
                </label>
                <input
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate((e.target as HTMLInputElement).value)}
                  required
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="endDate"
                >
                  Fecha de Fin
                </label>
                <input
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate((e.target as HTMLInputElement).value)}
                  required
                />
              </div>
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="status"
              >
                Estado
              </label>
              <select
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus((e.target as HTMLSelectElement).value)}
                required
              >
                <option value="planning">Planificación</option>
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            {message && <p class="text-red-500 text-sm mb-4">{message}</p>}
            <button
              type="submit"
              class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Sprint"}
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
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Editar Sprint
          </h2>
          <form onSubmit={handleUpdateSprint}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="editName"
              >
                Nombre del Sprint
              </label>
              <input
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="editName"
                type="text"
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="editDescription"
              >
                Descripción/Objetivo
              </label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="editDescription"
                value={description}
                onChange={(e) =>
                  setDescription((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="editStartDate"
                >
                  Fecha de Inicio
                </label>
                <input
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="editStartDate"
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate((e.target as HTMLInputElement).value)}
                  required
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="editEndDate"
                >
                  Fecha de Fin
                </label>
                <input
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="editEndDate"
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate((e.target as HTMLInputElement).value)}
                  required
                />
              </div>
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="editStatus"
              >
                Estado
              </label>
              <select
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                id="editStatus"
                value={status}
                onChange={(e) =>
                  setStatus((e.target as HTMLSelectElement).value)}
                required
              >
                <option value="planning">Planificación</option>
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            {message && (
              <p class="text-red-500 dark:text-red-400 text-sm mb-4">
                {message}
              </p>
            )}
            <button
              type="submit"
              class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Sprint"}
            </button>
          </form>
        </div>
      </Modal>

      {selectedProject && (
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Sprints del Proyecto: {selectedProject.Name}
          </h3>

          <div class="mb-4">
            <input
              type="text"
              placeholder="Buscar sprints por nombre, descripción o estado..."
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingSprints
              ? (
                <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
                  Cargando sprints...
                </div>
              )
              : sprints.length === 0
              ? (
                <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
                  No hay sprints en este proyecto.
                </div>
              )
              : (
                paginatedSprints.map((sprint) => (
                  <div
                    key={sprint.ID}
                    class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {sprint.Name}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                      {sprint.Goal}
                    </p>
                    <div class="space-y-2 mb-4">
                      <div class="flex justify-between items-center">
                        <span
                          class={`px-2 py-1 rounded-full text-xs font-medium ${
                            sprint.Status === "planning"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : sprint.Status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : sprint.Status === "completed"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {sprint.Status.charAt(0).toUpperCase() +
                            sprint.Status.slice(1)}
                        </span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          ID: {sprint.ID}
                        </span>
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        <p>Inicio: {new Date(sprint.StartDate).toLocaleDateString()}</p>
                        <p>Fin: {new Date(sprint.EndDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                      <button
                        type="button"
                        class="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditSprint(sprint)}
                        title="Editar"
                      >
                        <MaterialSymbol icon="edit" className="icon-md" />
                      </button>
                      <button
                        type="button"
                        class="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteSprint(sprint.ID)}
                        title="Eliminar"
                      >
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
      )}
    </div>
  );
}