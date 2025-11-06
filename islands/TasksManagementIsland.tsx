import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import Modal from "../components/Modal.tsx";

const API_BASE = "http://localhost:8080";

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let detail = "";
    try { detail = await res.text(); } catch {
      // Ignore error when getting response text
    }
    throw new Error(detail || `Request failed ${res.status}`);
  }
  // Some endpoints may return 204
  try {
    return await res.json();
  } catch {
    return undefined as unknown as T;
  }
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assigneeId?: string;
  userStoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  status: string;
}

// API Response types
interface APIUserResponse {
  ID: number;
  UserID: number;
  User: {
    ID: number;
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Correo: string;
    Role: string;
  };
  ProjectID: number;
  Role: string;
}

interface APIUserStoryResponse {
  ID: number;
  Title: string;
  Description: string;
  Status: string;
  Priority: string;
  SprintID: number;
}

interface APITaskResponse {
  ID: number;
  Title: string;
  Description: string;
  Status: string;
  Priority: string;
  AssignedToID?: number;
  UserStoryID?: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface TasksContextType {
  tasks: Task[];
  users: User[];
  userStories: UserStory[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  assignTask: (taskId: string, assigneeId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}

interface TasksProviderProps {
  children: preact.ComponentChildren;
  projectId: string;
  userRole: string;
  userStoryId?: string;
  sprintId?: string;
}

export function TasksProvider({ children, projectId, userRole, userStoryId, sprintId }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canCreateTask = ["product_owner", "scrum_master", "developer"].includes(userRole);

  useEffect(() => {
    fetchTasksData();
  }, [projectId, userStoryId, sprintId]);

  const fetchTasksData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine which tasks endpoint to use
      let tasksEndpoint: string | null;
      if (userStoryId) {
        tasksEndpoint = `${API_BASE}/api/userstories/${userStoryId}/tasks`;
      } else if (sprintId) {
        tasksEndpoint = `${API_BASE}/api/sprints/${sprintId}/tasks`;
      } else {
        tasksEndpoint = null; // We'll handle this differently
      }

      const [usersData, storiesData] = await Promise.all([
        apiFetch<APIUserResponse[]>(`${API_BASE}/api/projects/${projectId}/members`),
        apiFetch<APIUserStoryResponse[]>(`${API_BASE}/api/projects/${projectId}/userstories`),
      ]);

      // Map API response to component format
      const mappedUsers = usersData.map((user: APIUserResponse) => ({
        id: user.ID.toString(),
        name: `${user.User.Nombre} ${user.User.ApellidoPaterno}`,
        email: user.User.Correo,
        role: user.Role
      }));

      const mappedStories = storiesData.map((story: APIUserStoryResponse) => ({
        id: story.ID.toString(),
        title: story.Title,
        description: story.Description,
        status: story.Status
      }));

      setUsers(mappedUsers);
      setUserStories(mappedStories);

      // Fetch tasks based on context
      if (tasksEndpoint) {
        const tasksData = await apiFetch<APITaskResponse[]>(tasksEndpoint);
        const mappedTasks = tasksData.map((task: APITaskResponse) => ({
          id: task.ID.toString(),
          title: task.Title,
          description: task.Description,
          status: (task.Status?.toLowerCase().replace("_", "-") || "todo") as Task["status"],
          priority: (task.Priority?.toLowerCase() || "medium") as Task["priority"],
          assigneeId: task.AssignedToID?.toString(),
          userStoryId: task.UserStoryID?.toString(),
          createdAt: task.CreatedAt,
          updatedAt: task.UpdatedAt
        }));
        setTasks(mappedTasks);
      } else {
        // Get tasks from all user stories if no specific context
        const allTasks: Task[] = [];
        for (const story of mappedStories) {
          try {
            const storyTasks = await apiFetch<APITaskResponse[]>(`${API_BASE}/api/userstories/${story.id}/tasks`);
            const mappedTasks = storyTasks.map((task: APITaskResponse) => ({
              id: task.ID.toString(),
              title: task.Title,
              description: task.Description,
              status: (task.Status?.toLowerCase().replace("_", "-") || "todo") as Task["status"],
              priority: (task.Priority?.toLowerCase() || "medium") as Task["priority"],
              assigneeId: task.AssignedToID?.toString(),
              userStoryId: task.UserStoryID?.toString(),
              createdAt: task.CreatedAt,
              updatedAt: task.UpdatedAt,
            }));
            allTasks.push(...mappedTasks);
          } catch (err) {
            console.warn(`Failed to fetch tasks for story ${story.id}:`, err);
          }
        }
        setTasks(allTasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!canCreateTask) {
      throw new Error("No tienes permisos para crear tareas");
    }

    // Tasks must be created within a user story
    if (!taskData.userStoryId) {
      throw new Error("Las tareas deben estar asociadas a una historia de usuario");
    }

    try {
      const newTask = await apiFetch<APITaskResponse>(`${API_BASE}/api/userstories/${taskData.userStoryId}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          Title: taskData.title,
          Description: taskData.description,
        }),
      });
      setTasks(prev => [...prev, {
        id: newTask.ID.toString(),
        title: newTask.Title,
        description: newTask.Description,
        status: (newTask.Status?.toLowerCase().replace("_", "-") || "todo") as Task["status"],
        priority: (newTask.Priority?.toLowerCase() || "medium") as Task["priority"],
        assigneeId: newTask.AssignedToID?.toString(),
        userStoryId: newTask.UserStoryID?.toString(),
        createdAt: newTask.CreatedAt,
        updatedAt: newTask.UpdatedAt,
      }]);
    } catch (err) {
      console.error("Error al crear tarea:", err);
      throw new Error(err instanceof Error ? err.message : "Error al crear la tarea");
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const payload: Record<string, unknown> = {};
      if (updates.title) payload.Title = updates.title;
      if (updates.description) payload.Description = updates.description;
      if (updates.status) payload.Status = updates.status.replace("-", "_");
      if (updates.priority) payload.Priority = updates.priority;
      if (updates.assigneeId) payload.AssignedToID = Number(updates.assigneeId);

      const updated = await apiFetch<APITaskResponse>(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setTasks(prev => prev.map(task => task.id === id ? {
        id: updated.ID.toString(),
        title: updated.Title,
        description: updated.Description,
        status: (updated.Status?.toLowerCase().replace("_", "-") || "todo") as Task["status"],
        priority: (updated.Priority?.toLowerCase() || "medium") as Task["priority"],
        assigneeId: updated.AssignedToID?.toString(),
        userStoryId: updated.UserStoryID?.toString(),
        createdAt: updated.CreatedAt,
        updatedAt: updated.UpdatedAt,
      } : task));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiFetch<void>(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const assignTask = async (taskId: string, assigneeId: string) => {
    try {
      const updated = await apiFetch<APITaskResponse>(`${API_BASE}/api/tasks/${taskId}/assign`, {
        method: "PUT",
        body: JSON.stringify({ userId: Number(assigneeId) }),
      });
      setTasks(prev => prev.map(task => task.id === taskId ? {
        id: updated.ID.toString(),
        title: updated.Title,
        description: updated.Description,
        status: (updated.Status?.toLowerCase().replace("_", "-") || "todo") as Task["status"],
        priority: (updated.Priority?.toLowerCase() || "medium") as Task["priority"],
        assigneeId: updated.AssignedToID?.toString(),
        userStoryId: updated.UserStoryID?.toString(),
        createdAt: updated.CreatedAt,
        updatedAt: updated.UpdatedAt,
      } : task));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to assign task");
    }
  };

  const value: TasksContextType = {
    tasks,
    users,
    userStories,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  users: User[];
  userStories: UserStory[];
}

function TaskForm({ onSubmit, onCancel, users, userStories }: TaskFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: Task["status"];
    priority: Task["priority"];
    assigneeId: string;
    userStoryId: string;
  }>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigneeId: "",
    userStoryId: "",
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Crear Nueva Tarea</h3>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título:</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: (e.target as HTMLInputElement).value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: (e.target as HTMLTextAreaElement).value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-vertical"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad:</label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: (e.target as HTMLSelectElement).value as Task["priority"] }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asignar a:</label>
        <select
          id="assignee"
          value={formData.assigneeId}
          onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: (e.target as HTMLSelectElement).value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Sin asignar</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="userStory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Historia de Usuario:</label>
        <select
          id="userStory"
          value={formData.userStoryId}
          onChange={(e) => setFormData(prev => ({ ...prev, userStoryId: (e.target as HTMLSelectElement).value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Sin Historia de Usuario</option>
          {userStories.map(story => (
            <option key={story.id} value={story.id}>
              {story.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">Crear Tarea</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">Cancelar</button>
      </div>
    </form>
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAssign: (taskId: string, assigneeId: string) => void;
  users: User[];
  canEdit: boolean;
}

function TaskCard({ task, onEdit, onDelete, onAssign, users, canEdit }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#ff4444";
      case "medium": return "#ffaa00";
      case "low": return "#00c851";
      default: return "#666";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "#00c851";
      case "in-progress": return "#ffbb33";
      case "todo": return "#33b5e5";
      default: return "#666";
    }
  };

  const assignee = users.find(user => user.id === task.assigneeId);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex-1">{task.title}</h4>
        <div className="flex gap-2">
          <span
            className="px-2 py-1 text-xs font-bold text-white rounded uppercase"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
          <span
            className="px-2 py-1 text-xs font-bold text-white rounded uppercase"
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {task.status}
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{task.description}</p>

      {assignee && (
        <div className="text-sm text-gray-700 dark:text-gray-400 mb-3">
          <strong className="font-medium">Asignado a:</strong> {assignee.name} ({assignee.role})
        </div>
      )}

      <div className="flex gap-2 items-center">
        {canEdit && (
          <>
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </>
        )}

        <select
          onChange={(e) => onAssign(task.id, (e.target as HTMLSelectElement).value)}
          value={task.assigneeId || ""}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Asignar a...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface TasksManagementIslandProps {
  projectId: string;
  userRole: string;
  userStoryId?: string;
  sprintId?: string;
}

export default function TasksManagementIsland({ projectId: _projectId, userRole, userStoryId: _userStoryId, sprintId: _sprintId }: TasksManagementIslandProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState({
    status: "all",
    priority: "all",
    assignee: "all",
  });

  const {
    tasks,
    users,
    userStories,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
  } = useTasks();

  const canCreateTask = ["product_owner", "scrum_master", "developer"].includes(userRole);
  const canEditTask = ["product_owner", "scrum_master", "developer"].includes(userRole);

  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createTask(taskData);
      setShowCreateForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear la tarea");
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await updateTask(task.id, task);
      setEditingTask(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar la tarea");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await deleteTask(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error al eliminar la tarea");
      }
    }
  };

  const handleAssignTask = async (taskId: string, assigneeId: string) => {
    if (assigneeId) {
      try {
        await assignTask(taskId, assigneeId);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error al asignar la tarea");
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.status !== "all" && task.status !== filter.status) return false;
    if (filter.priority !== "all" && task.priority !== filter.priority) return false;
    if (filter.assignee !== "all" && task.assigneeId !== filter.assignee) return false;
    return true;
  });

  if (loading) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Tareas</h2>
        {canCreateTask && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Crear Tarea
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={filter.status}
          onChange={(e) => setFilter(prev => ({ ...prev, status: (e.target as HTMLSelectElement).value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los Estados</option>
          <option value="todo">Por Hacer</option>
          <option value="in-progress">En Progreso</option>
          <option value="done">Completado</option>
        </select>

        <select
          value={filter.priority}
          onChange={(e) => setFilter(prev => ({ ...prev, priority: (e.target as HTMLSelectElement).value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las Prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>

        <select
          value={filter.assignee}
          onChange={(e) => setFilter(prev => ({ ...prev, assignee: (e.target as HTMLSelectElement).value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los Asignados</option>
          <option value="">Sin asignar</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">No se encontraron tareas</div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onAssign={handleAssignTask}
              users={users}
              canEdit={canEditTask}
            />
          ))
        )}
      </div>

      <Modal
        show={showCreateForm}
        maxWidth="md"
        onClose={() => setShowCreateForm(false)}
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
          users={users}
          userStories={userStories}
        />
      </Modal>

      <Modal
        show={!!editingTask}
        maxWidth="md"
        onClose={() => setEditingTask(null)}
      >
        <TaskForm
          onSubmit={(data) => editingTask && handleUpdateTask({ ...editingTask, ...data })}
          onCancel={() => setEditingTask(null)}
          users={users}
          userStories={userStories}
        />
      </Modal>
    </div>
  );
}