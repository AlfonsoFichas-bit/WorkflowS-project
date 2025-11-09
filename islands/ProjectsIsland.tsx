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

export default function ProjectsIsland() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [members, setMembers] = useState<Member[]>([]);
  const [memberRole, setMemberRole] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
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
    setName(project.Name);
    setDescription(project.Description);
    setStatus(project.Status);
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
      const response = await fetch(
        `http://localhost:8080/api/projects/${editingProject.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            Name: name,
            Description: description,
            Status: status,
          }),
        },
      );

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
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No autenticado");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        },
      );

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
          Name: name,
          Description: description,
        }),
      });

      if (response.ok) {
        setMessage("Proyecto creado exitosamente");
        setName("");
        setDescription("");
        setStatus("");
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

  const handleAddMember = (project: Project) => {
    setSelectedProject(project);
    setSelectedUserId("");
    setMemberRole("");
    setMessage("");
    setShowAddMemberModal(true);
    fetchUsers(project.ID);
  };

  const handleViewMembers = (project: Project) => {
    setSelectedProject(project);
    setMessage("");
    setShowMembersModal(true);
    fetchMembers(project.ID);
  };

  const handleSubmitAddMember = async (e: Event) => {
    e.preventDefault();
    if (!selectedProject || !selectedUserId || !memberRole) return;

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
        `http://localhost:8080/api/admin/projects/${selectedProject.ID}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUserId,
            role: memberRole,
          }),
        },
      );

      if (response.ok) {
        setMessage("Miembro agregado exitosamente");
        setShowAddMemberModal(false);
        setSelectedProject(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Error al agregar miembro");
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

  const fetchUsers = async (projectId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}/unassigned-users`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMembers = async (projectId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}/members`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const membersData = await response.json();
        setMembers(membersData);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.Name.toLowerCase().includes(search.toLowerCase()) ||
      project.Description.toLowerCase().includes(search.toLowerCase()) ||
      project.Status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, search]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Gestión de Proyectos
        </h2>
        <button
          type="button"
          class="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-300"
          onClick={() => {
            setName("");
            setDescription("");
            setStatus("");
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
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Crear Nuevo Proyecto
          </h2>
          <form onSubmit={handleCreateProject}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="name"
              >
                Nombre
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
                Descripción
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
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Editar Proyecto
          </h2>
          <form onSubmit={handleUpdateProject}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="editName"
              >
                Nombre
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
                Descripción
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
              {loading ? "Actualizando..." : "Actualizar Proyecto"}
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        show={showAddMemberModal}
        maxWidth="lg"
        closeable
        onClose={() => setShowAddMemberModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Agregar Miembro a Proyecto
          </h2>
          <form onSubmit={handleSubmitAddMember}>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="user"
              >
                Usuario
              </label>
              <select
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                id="user"
                value={selectedUserId}
                onChange={(e) =>
                  setSelectedUserId(
                    Number((e.target as HTMLSelectElement).value),
                  )}
                required
              >
                <option value="">Seleccionar Usuario</option>
                {users.map((user) => (
                  <option key={user.ID} value={user.ID}>
                    {`${user.Nombre} ${user.ApellidoPaterno}`} ({user.Correo})
                  </option>
                ))}
              </select>
            </div>
            <div class="mb-4">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                for="role"
              >
                Rol
              </label>
              <select
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                id="role"
                value={memberRole}
                onChange={(e) =>
                  setMemberRole((e.target as HTMLSelectElement).value)}
                required
              >
                <option value="">Seleccionar Rol</option>
                <option value="scrum_master">Scrum Master</option>
                <option value="product_owner">Product Owner</option>
                <option value="team_developer">Team Developer</option>
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
              {loading ? "Agregando..." : "Agregar Miembro"}
            </button>
          </form>
        </div>
      </Modal>

      <Modal
        show={showMembersModal}
        maxWidth="lg"
        closeable
        onClose={() => setShowMembersModal(false)}
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Miembros del Proyecto
          </h2>
          {members.length === 0
            ? (
              <p class="text-gray-600 dark:text-gray-400">
                No hay miembros en este proyecto.
              </p>
            )
            : (
              <div class="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.ID}
                    class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {`${member.User.Nombre} ${member.User.ApellidoPaterno}`}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {member.User.Correo}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Rol: {member.Role.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </div>
      </Modal>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Lista de Proyectos
        </h3>

        <div class="mb-4">
          <input
            type="text"
            placeholder="Buscar proyectos por name, descripción o status..."
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingProjects
            ? (
              <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
                Cargando proyectos...
              </div>
            )
            : projects.length === 0
            ? (
              <div class="col-span-full text-center text-gray-500 dark:text-gray-400">
                No hay proyectos registrados.
              </div>
            )
            : (
              paginatedProjects.map((project) => (
                <div
                  key={project.ID}
                  class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {project.Name}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    {project.Description}
                  </p>
                  <div class="flex justify-between items-center mb-4">
                    <span
                      class={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.Status === "planning"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : project.Status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {project.Status.charAt(0).toUpperCase() +
                        project.Status.slice(1)}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {project.ID}
                    </span>
                  </div>
                  <div class="flex justify-end space-x-2">
                    <button
                      type="button"
                      class="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditProject(project)}
                      title="Editar"
                    >
                      <MaterialSymbol icon="edit" className="icon-md" />
                    </button>
                    <button
                      type="button"
                      class="text-green-600 hover:text-green-800"
                      onClick={() => handleAddMember(project)}
                      title="Agregar Miembro"
                    >
                      <MaterialSymbol icon="person_add" className="icon-md" />
                    </button>
                    <button
                      type="button"
                      class="text-purple-600 hover:text-purple-800"
                      onClick={() => handleViewMembers(project)}
                      title="Ver Miembros"
                    >
                      <MaterialSymbol icon="group" className="icon-md" />
                    </button>
                    <button
                      type="button"
                      class="text-indigo-600 hover:text-indigo-800"
                      title="Abrir Kanban"
                      onClick={() => {
                        // Forzar navegación full-page para evitar que la SPA intercepte la ruta
                        globalThis.location.assign(
                          `/dashboard/projects/${project.ID}/kanban`,
                        );
                      }}
                    >
                      <MaterialSymbol icon="view_kanban" className="icon-md" />
                    </button>
                    <button
                      type="button"
                      class="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteProject(project.ID)}
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
    </div>
  );
}
