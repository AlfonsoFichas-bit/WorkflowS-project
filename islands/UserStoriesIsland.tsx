import { useEffect, useState } from "preact/hooks";
import Modal from "../components/Modal.tsx";
import { MaterialSymbol } from "../components/MaterialSymbol.tsx";

interface Project {
  ID: number;
  Name: string;
  Description: string;
  Status: string;
  CreatedAt: string;
}

interface Sprint {
  ID: number;
  Name: string;
  Goal: string;
  Status: string;
  StartDate: string;
  EndDate: string;
  ProjectID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface UserStory {
  ID: number;
  Title: string;
  Description: string;
  AcceptanceCriteria: string;
  Priority: string;
  Status: string;
  Points: number | null;
  ProjectID: number;
  SprintID: number | null;
  CreatedByID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export default function UserStoriesIsland() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [filteredUserStories, setFilteredUserStories] = useState<UserStory[]>(
    [],
  );
  const [loadingUserStories, setLoadingUserStories] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingUserStory, setEditingUserStory] = useState<UserStory | null>(
    null,
  );
  const [assigningUserStory, setAssigningUserStory] = useState<
    UserStory | null
  >(null);
  const [userRole, setUserRole] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [priority, setPriority] = useState("medium");
  const [points, setPoints] = useState<number | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);
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
      }
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  const fetchUserStories = async (projectId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingUserStories(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}/userstories`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const userStoriesData = await response.json();
        setUserStories(userStoriesData);
      } else {
        console.error("Failed to fetch user stories");
      }
    } catch (error) {
      console.error("Error fetching user stories:", error);
    } finally {
      setLoadingUserStories(false);
    }
  };

  const handleEditUserStory = (userStory: UserStory) => {
    setEditingUserStory(userStory);
    setTitle(userStory.Title);
    setDescription(userStory.Description);
    setAcceptanceCriteria(userStory.AcceptanceCriteria);
    setPriority(userStory.Priority);
    setPoints(userStory.Points);
    setMessage("");
    setShowEditModal(true);
  };

  const handleUpdateUserStory = async (e: Event) => {
    e.preventDefault();
    if (!editingUserStory) return;

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      setLoading(false);
      return;
    }

    try {
      const updatedUserStory: Partial<UserStory> = {
        Title: title,
        Description: description,
        AcceptanceCriteria: acceptanceCriteria,
        Priority: priority,
      };

      if (points !== null) {
        updatedUserStory.Points = points;
      }

      console.log(
        "Enviando datos actualizados de la user story:",
        updatedUserStory,
      );
      console.log("Prioridad actual:", priority);
      console.log("ID de la user story:", editingUserStory.ID);

      console.log(
        "URL del endpoint:",
        `http://localhost:8080/api/userstories/${editingUserStory.ID}`,
      );
      console.log("Headers:", {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      });

      const response = await fetch(
        `http://localhost:8080/api/userstories/${editingUserStory.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUserStory),
        },
      );

      console.log("Status de respuesta:", response.status);
      console.log(
        "Headers de respuesta:",
        Object.fromEntries(response.headers.entries()),
      );

      if (response.ok) {
        const updatedData = await response.json();
        console.log("Respuesta del backend:", updatedData);

        // Validate that the update was successful
        if (updatedData.Priority !== updatedUserStory.Priority) {
          console.error(
            "Error: Priority not updated correctly. Sent:",
            updatedUserStory.Priority,
            "Received:",
            updatedData.Priority,
          );
          setMessage(
            "Error: La prioridad no se actualizó correctamente. Inténtalo de nuevo.",
          );
          setLoading(false);
          return;
        }

        setMessage("User Story actualizada exitosamente");
        setShowEditModal(false);
        setEditingUserStory(null);
        if (selectedProject) {
          console.log(
            "Recargando user stories del proyecto:",
            selectedProject.ID,
          );
          await fetchUserStories(selectedProject.ID);
          console.log("User stories recargadas:", userStories);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        setMessage(
          errorData.error || errorData.message ||
            "Error al actualizar user story",
        );
      }
    } catch (_err) {
      console.error("Error de conexión:", _err);
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUserStory = async (userStoryId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta User Story?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/userstories/${userStoryId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setMessage("User Story eliminada exitosamente");
        if (selectedProject) {
          fetchUserStories(selectedProject.ID);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al eliminar user story");
      }
    } catch (_err) {
      setMessage("Error de conexión");
    }
  };

  const handleCreateUserStory = async (e: Event) => {
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

    const userStoryData = {
      Title: title,
      Description: description,
      AcceptanceCriteria: acceptanceCriteria,
      Priority: priority,
      Points: points,
    };

    console.log("Enviando datos de la user story:", userStoryData);

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${selectedProject.ID}/userstories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(userStoryData),
        },
      );

      if (response.ok) {
        setMessage("User Story creada exitosamente");
        setTitle("");
        setDescription("");
        setAcceptanceCriteria("");
        setPriority("medium");
        setPoints(null);
        setShowModal(false);
        fetchUserStories(selectedProject.ID);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        setMessage(
          errorData.error || errorData.message || "Error al crear user story",
        );
      }
    } catch (_err) {
      console.error("Error de conexión:", _err);
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToSprint = async (e: Event) => {
    e.preventDefault();
    if (!assigningUserStory || !selectedSprint) return;

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/sprints/${selectedSprint}/userstories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            userStoryId: assigningUserStory.ID,
          }),
        },
      );

      if (response.ok) {
        setMessage("User Story asignada exitosamente al sprint");
        setShowAssignModal(false);
        setAssigningUserStory(null);
        setSelectedSprint(null);
        if (selectedProject) {
          fetchUserStories(selectedProject.ID);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al asignar user story al sprint");
      }
    } catch (_err) {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    fetchUserStories(project.ID);
    fetchSprints(project.ID);
  };

  const canCreateUserStory = (role: string) => {
    return role === "admin" || role === "scrum_master" ||
      role === "product_owner";
  };

  useEffect(() => {
    const filtered = userStories.filter((userStory) =>
      userStory.Title.toLowerCase().includes(search.toLowerCase()) ||
      userStory.Description?.toLowerCase().includes(search.toLowerCase()) ||
      userStory.AcceptanceCriteria?.toLowerCase().includes(
        search.toLowerCase(),
      ) ||
      userStory.Priority.toLowerCase().includes(search.toLowerCase()) ||
      userStory.Status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUserStories(filtered);
    setCurrentPage(1);
  }, [userStories, search]);

  const totalPages = Math.ceil(filteredUserStories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUserStories = filteredUserStories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "in_sprint":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Gestión de User Stories
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
          {selectedProject && canCreateUserStory(userRole) && (
            <button
              type="button"
              class="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-300"
              onClick={() => {
                setTitle("");
                setDescription("");
                setAcceptanceCriteria("");
                setPriority("medium");
                setPoints(null);
                setMessage("");
                setShowModal(true);
              }}
            >
              Crear User Story
            </button>
          )}
        </div>
      </div>

      {!selectedProject
        ? (
          <div class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">
              Selecciona un proyecto para gestionar sus user stories
            </p>
          </div>
        )
        : !canCreateUserStory(userRole)
        ? (
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <p class="text-yellow-800 dark:text-yellow-200">
              Solo Scrum Master y Product Owner pueden crear user stories
            </p>
          </div>
        )
        : null}

      <Modal
        show={showModal}
        maxWidth="lg"
        closeable
        onClose={() => setShowModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Crear Nueva User Story
          </h2>
          <form onSubmit={handleCreateUserStory}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="title"
              >
                Título
              </label>
              <input
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="description"
              >
                Descripción
              </label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="description"
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="acceptanceCriteria"
              >
                Criterios de Aceptación
              </label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="acceptanceCriteria"
                rows={3}
                value={acceptanceCriteria}
                onChange={(e) =>
                  setAcceptanceCriteria((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="priority"
                >
                  Prioridad
                </label>
                <select
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority((e.target as HTMLSelectElement).value)}
                  required
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="points"
                >
                  Puntos de Historia
                </label>
                <input
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="points"
                  type="number"
                  min="0"
                  value={points || ""}
                  onChange={(e) =>
                    setPoints(
                      (e.target as HTMLInputElement).value
                        ? Number((e.target as HTMLInputElement).value)
                        : null,
                    )}
                />
              </div>
            </div>
            {message && <p class="text-red-500 text-sm mb-4">{message}</p>}
            <button
              type="submit"
              class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear User Story"}
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
            Editar User Story
          </h2>
          <form onSubmit={handleUpdateUserStory}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="editTitle"
              >
                Título
              </label>
              <input
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="editTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="editDescription"
              >
                Descripción
              </label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="editDescription"
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="editAcceptanceCriteria"
              >
                Criterios de Aceptación
              </label>
              <textarea
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="editAcceptanceCriteria"
                rows={3}
                value={acceptanceCriteria}
                onChange={(e) =>
                  setAcceptanceCriteria((e.target as HTMLInputElement).value)}
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="editPriority"
                >
                  Prioridad
                </label>
                <select
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="editPriority"
                  value={priority}
                  onChange={(e) =>
                    setPriority((e.target as HTMLSelectElement).value)}
                  required
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  for="editPoints"
                >
                  Puntos de Historia
                </label>
                <input
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                  id="editPoints"
                  type="number"
                  min="0"
                  value={points || ""}
                  onChange={(e) =>
                    setPoints(
                      (e.target as HTMLInputElement).value
                        ? Number((e.target as HTMLInputElement).value)
                        : null,
                    )}
                />
              </div>
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
              {loading ? "Actualizando..." : "Actualizar User Story"}
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        show={showAssignModal}
        maxWidth="md"
        closeable
        onClose={() => setShowAssignModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Asignar User Story a Sprint
          </h2>
          <form onSubmit={handleAssignToSprint}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="sprint"
              >
                Sprint
              </label>
              <select
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                id="sprint"
                value={selectedSprint || ""}
                onChange={(e) =>
                  setSelectedSprint(
                    Number((e.target as HTMLSelectElement).value),
                  )}
                required
              >
                <option value="">Seleccionar Sprint</option>
                {sprints
                  .filter((sprint) =>
                    sprint.Status === "planned" || sprint.Status === "active"
                  )
                  .map((sprint) => (
                    <option key={sprint.ID} value={sprint.ID}>
                      {sprint.Name}
                    </option>
                  ))}
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
              {loading ? "Asignando..." : "Asignar a Sprint"}
            </button>
          </form>
        </div>
      </Modal>

      {selectedProject && (
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            User Stories del Proyecto: {selectedProject.Name}
          </h3>

          <div class="mb-4">
            <input
              type="text"
              placeholder="Buscar user stories por título, descripción, criterios..."
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingUserStories
              ? (
                <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
                  Cargando user stories...
                </div>
              )
              : userStories.length === 0
              ? (
                <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
                  No hay user stories en este proyecto.
                </div>
              )
              : (
                paginatedUserStories.map((userStory) => (
                  <div
                    key={userStory.ID}
                    class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {userStory.Title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {userStory.Description}
                    </p>
                    <div class="space-y-2 mb-4">
                      <div class="flex justify-between items-center">
                        <span
                          class={`px-2 py-1 rounded-full text-xs font-medium ${
                            getPriorityColor(
                              userStory.Priority,
                            )
                          }`}
                        >
                          {userStory.Priority.charAt(0).toUpperCase() +
                            userStory.Priority.slice(1)}
                        </span>
                        <span
                          class={`px-2 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(
                              userStory.Status,
                            )
                          }`}
                        >
                          {userStory.Status === "backlog"
                            ? "Backlog"
                            : userStory.Status === "in_sprint"
                            ? "En Sprint"
                            : userStory.Status.charAt(0).toUpperCase() +
                              userStory.Status.slice(1)}
                        </span>
                      </div>
                      {userStory.Points && (
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          Puntos: {userStory.Points}
                        </div>
                      )}
                      {userStory.SprintID && (
                        <div class="text-sm text-blue-600 dark:text-blue-400">
                          Asignada a Sprint #{userStory.SprintID}
                        </div>
                      )}
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        <p>
                          Creada:{" "}
                          {new Date(userStory.CreatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                      <button
                        type="button"
                        class="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditUserStory(userStory)}
                        title="Editar"
                      >
                        <MaterialSymbol icon="edit" className="icon-md" />
                      </button>
                      {!userStory.SprintID && (
                        <button
                          type="button"
                          class="text-green-600 hover:text-green-800"
                          onClick={() => {
                            setAssigningUserStory(userStory);
                            setSelectedSprint(null);
                            setMessage("");
                            setShowAssignModal(true);
                          }}
                          title="Asignar a Sprint"
                        >
                          <MaterialSymbol icon="add_task" className="icon-md" />
                        </button>
                      )}
                      <button
                        type="button"
                        class="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteUserStory(userStory.ID)}
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
