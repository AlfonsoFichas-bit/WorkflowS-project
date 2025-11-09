import { useEffect, useState } from "preact/hooks";
import Modal from "../components/Modal.tsx";

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

export default function SprintAssignmentIsland() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [availableUserStories, setAvailableUserStories] = useState<UserStory[]>(
    [],
  );
  const [selectedUserStories, setSelectedUserStories] = useState<number[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [loadingUserStories, setLoadingUserStories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

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
      } else {
        console.error("Failed to fetch projects");
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
        // Filter available user stories (not assigned to any sprint)
        const available = userStoriesData.filter((us: UserStory) =>
          !us.SprintID
        );
        setAvailableUserStories(available);
      } else {
        console.error("Failed to fetch user stories");
      }
    } catch (error) {
      console.error("Error fetching user stories:", error);
    } finally {
      setLoadingUserStories(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setSelectedSprint(null);
    setSelectedUserStories([]);
    fetchSprints(project.ID);
    fetchUserStories(project.ID);
  };

  const handleSprintSelect = (sprint: Sprint) => {
    setSelectedSprint(sprint);
  };

  const handleUserStoryToggle = (userStoryId: number) => {
    setSelectedUserStories((prev) =>
      prev.includes(userStoryId)
        ? prev.filter((id) => id !== userStoryId)
        : [...prev, userStoryId]
    );
  };

  const handleAssignUserStories = async (e: Event) => {
    e.preventDefault();
    if (!selectedSprint || selectedUserStories.length === 0) return;

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      setLoading(false);
      return;
    }

    try {
      const assignPromises = selectedUserStories.map((userStoryId) =>
        fetch(
          `http://localhost:8080/api/sprints/${selectedSprint.ID}/userstories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              userStoryId: userStoryId,
            }),
          },
        )
      );

      const responses = await Promise.all(assignPromises);
      const failedCount = responses.filter((r) => !r.ok).length;

      if (failedCount === 0) {
        setMessage(
          `${selectedUserStories.length} user stories asignadas exitosamente al sprint "${selectedSprint.Name}"`,
        );
        setShowAssignModal(false);
        setSelectedUserStories([]);
        setSelectedSprint(null);
        if (selectedProject) {
          fetchUserStories(selectedProject.ID);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`Error: ${failedCount} asignaciones fallaron`);
      }
    } catch (_err) {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Asignación de User Stories a Sprints
        </h2>
      </div>

      {/* Project Selection */}
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Seleccionar Proyecto
        </label>
        <select
          class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
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
      </div>

      {!selectedProject
        ? (
          <div class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">
              Selecciona un proyecto para gestionar la asignación de user
              stories a sprints
            </p>
          </div>
        )
        : (
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available User Stories */}
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                User Stories Disponibles
              </h3>
              <div class="space-y-3 max-h-96 overflow-y-auto">
                {loadingUserStories
                  ? (
                    <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                      Cargando user stories...
                    </div>
                  )
                  : availableUserStories.length === 0
                  ? (
                    <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                      No hay user stories disponibles para asignar
                    </div>
                  )
                  : (
                    availableUserStories.map((userStory) => (
                      <div
                        key={userStory.ID}
                        class={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedUserStories.includes(userStory.ID)
                            ? "border-primary bg-primary/10 dark:bg-primary/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        }`}
                        onClick={() => handleUserStoryToggle(userStory.ID)}
                      >
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <h4 class="font-medium text-gray-800 dark:text-gray-200">
                              {userStory.Title}
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {userStory.Description}
                            </p>
                            <div class="flex items-center space-x-2 mt-2">
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
                              {userStory.Points && (
                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                  {userStory.Points} pts
                                </span>
                              )}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedUserStories.includes(userStory.ID)}
                            onChange={() => handleUserStoryToggle(userStory.ID)}
                            class="ml-2"
                          />
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </div>

            {/* Available Sprints */}
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Sprints Disponibles
              </h3>
              <div class="space-y-3 max-h-96 overflow-y-auto">
                {loadingSprints
                  ? (
                    <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                      Cargando sprints...
                    </div>
                  )
                  : sprints.length === 0
                  ? (
                    <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                      No hay sprints en este proyecto
                    </div>
                  )
                  : (
                    sprints
                      .filter((sprint) =>
                        sprint.Status === "planned" ||
                        sprint.Status === "active"
                      )
                      .map((sprint) => (
                        <div
                          key={sprint.ID}
                          class={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedSprint?.ID === sprint.ID
                              ? "border-primary bg-primary/10 dark:bg-primary/20"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          }`}
                          onClick={() => handleSprintSelect(sprint)}
                        >
                          <h4 class="font-medium text-gray-800 dark:text-gray-200">
                            {sprint.Name}
                          </h4>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {sprint.Goal}
                          </p>
                          <div class="flex items-center space-x-2 mt-2">
                            <span
                              class={`px-2 py-1 rounded-full text-xs font-medium ${
                                sprint.Status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {sprint.Status === "active"
                                ? "Activo"
                                : "Planificado"}
                            </span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(sprint.StartDate).toLocaleDateString()}
                              {" "}
                              - {new Date(sprint.EndDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
              </div>
            </div>
          </div>
        )}

      {/* Assignment Summary and Button */}
      {selectedProject && (
        <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {selectedUserStories.length} user stories seleccionadas
              </p>
              {selectedSprint && (
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Sprint destino: {selectedSprint.Name}
                </p>
              )}
            </div>
            <button
              type="button"
              class="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={selectedUserStories.length === 0 || !selectedSprint}
              onClick={() => setShowAssignModal(true)}
            >
              Asignar User Stories
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        show={showAssignModal}
        maxWidth="md"
        closeable
        onClose={() => setShowAssignModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Confirmar Asignación
          </h2>
          <div class="mb-4">
            <p class="text-gray-600 dark:text-gray-400 mb-2">
              ¿Estás seguro de que quieres asignar las siguientes user stories
              al sprint "{selectedSprint?.Name}"?
            </p>
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto">
              {selectedUserStories.map((id) => {
                const us = availableUserStories.find((us) => us.ID === id);
                return us
                  ? (
                    <div
                      key={id}
                      class="text-sm text-gray-800 dark:text-gray-200"
                    >
                      • {us.Title}
                    </div>
                  )
                  : null;
              })}
            </div>
          </div>
          {message && (
            <p class="text-red-500 dark:text-red-400 text-sm mb-4">
              {message}
            </p>
          )}
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              onClick={() => setShowAssignModal(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition duration-300 disabled:opacity-50"
              disabled={loading}
              onClick={handleAssignUserStories}
            >
              {loading ? "Asignando..." : "Confirmar Asignación"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success/Error Messages */}
      {message && !showAssignModal && (
        <div class="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p class="text-green-800 dark:text-green-200">{message}</p>
        </div>
      )}
    </div>
  );
}
