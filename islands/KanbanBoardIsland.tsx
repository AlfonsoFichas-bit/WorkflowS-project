import { useEffect, useMemo, useState } from "preact/hooks";

interface UserRef {
  ID: number;
  Nombre?: string;
}

interface UserStory {
  ID: number;
  Title: string;
  Priority?: string;
  Points?: number | null;
}

interface Task {
  ID: number;
  Title: string;
  Description?: string;
  Status: "todo" | "in_progress" | "in_review" | "done";
  UserStory?: UserStory;
  AssignedTo?: UserRef | null;
}

interface Sprint {
  ID: number;
  Name: string;
  Status: string;
}

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
    const text = await res.text();
    throw new Error(text || `Request failed ${res.status}`);
  }
  return res.json();
}

async function getActiveSprint(projectId: number): Promise<Sprint | null> {
  try {
    return await apiFetch<Sprint>(
      `${API_BASE}/api/projects/${projectId}/active-sprint`,
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("404")) return null;
    return null;
  }
}

function getSprintTasks(sprintId: number): Promise<Task[]> {
  return apiFetch<Task[]>(`${API_BASE}/api/sprints/${sprintId}/tasks`);
}

function updateTaskStatus(
  taskId: number,
  status: Task["Status"],
): Promise<Task> {
  return apiFetch<Task>(`${API_BASE}/api/tasks/${taskId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export default function KanbanBoardIsland(
  { projectId }: { projectId: number },
) {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [_connectionStatus, setConnectionStatus] = useState<string>(
    "disconnected",
  );

  const columns = useMemo(
    () => [
      { id: "todo", title: "To Do", status: "todo" },
      { id: "in_progress", title: "In Progress", status: "in_progress" },
      { id: "in_review", title: "In Review", status: "in_review" },
      { id: "done", title: "Done", status: "done" },
    ],
    [],
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await getActiveSprint(projectId);
      setSprint(s);
      if (s) {
        const t = await getSprintTasks(s.ID);
        setTasks(t);
      } else {
        setTasks([]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Error cargando Kanban");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  // WebSocket integration
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    import("../utils/websocketService.ts").then(({ KanbanWebSocket }) => {
      const ws = new KanbanWebSocket(token);

      ws.on("connection_established", () => setConnectionStatus("connected"));
      ws.on("connection_failed", () => setConnectionStatus("failed"));

      ws.on("task_status_updated", (payload) => {
        const p = payload as { taskId: number; newStatus: Task["Status"] };
        setTasks((prev) =>
          prev.map((
            t,
          ) => (t.ID === p.taskId ? { ...t, Status: p.newStatus } : t))
        );
      });

      ws.on("task_updated", (payload) => {
        const p = payload as { taskId: number; changes: Partial<Task> };
        setTasks((prev) =>
          prev.map((t) => (t.ID === p.taskId ? { ...t, ...p.changes } : t))
        );
      });

      ws.on("task_created", (payload) => {
        const p = payload as { task: Task };
        // Sólo añadir si pertenece al sprint activo
        if (p.task && sprint) {
          setTasks((prev) => [...prev, p.task]);
        }
      });

      ws.on("task_deleted", (payload) => {
        const p = payload as { taskId: number };
        setTasks((prev) => prev.filter((t) => t.ID !== p.taskId));
      });

      ws.connect();
      // Suscribirse al proyecto si el sprint está disponible
      if (sprint) {
        // Nota: Si el backend lo requiere, enviar subscribe_project con projectId
        // ws.subscribeToProject(sprint.ProjectID)
      }

      return () => {
        ws.disconnect();
      };
    });
  }, [projectId, sprint?.ID]);

  const onDropTo = async (e: DragEvent, status: Task["Status"]) => {
    e.preventDefault();
    const idStr = e.dataTransfer?.getData("text/task-id");
    if (!idStr) return;
    const id = Number(idStr);
    const current = tasks.find((t) => t.ID === id);
    if (!current || current.Status === status) return;

    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.ID === id ? { ...t, Status: status } : t))
    );
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.ID === id ? updated : t)));
    } catch (_err) {
      // rollback
      setTasks((prev) =>
        prev.map((t) => (t.ID === id ? { ...t, Status: current.Status } : t))
      );
    }
  };

  const onDragStart = (e: DragEvent, taskId: number) => {
    e.dataTransfer?.setData("text/task-id", String(taskId));
    e.dataTransfer?.setDragImage?.(new Image(), 0, 0);
  };

  if (loading) return <div class="p-4">Cargando tablero...</div>;
  if (error) return <div class="p-4 text-red-600">{error}</div>;

  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Kanban</h2>
        {sprint
          ? (
            <span class="text-sm text-gray-600">
              Sprint activo: {sprint.Name} (#{sprint.ID})
            </span>
          )
          : <span class="text-sm text-gray-600">No hay sprint activo</span>}
      </div>

      <div class="flex gap-4 overflow-x-auto">
        {columns.map((col) => (
          <div
            key={col.id}
            class="min-w-[280px] w-full bg-gray-50 dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) =>
              onDropTo(e as unknown as DragEvent, col.status as Task["Status"])}
          >
            <div class="font-medium mb-2">{col.title}</div>
            <div class="space-y-2">
              {tasks
                .filter((t) => t.Status === col.status)
                .map((t) => (
                  <div
                    key={t.ID}
                    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 cursor-move"
                    draggable
                    onDragStart={(e) =>
                      onDragStart(e as unknown as DragEvent, t.ID)}
                  >
                    <div class="font-semibold text-sm">{t.Title}</div>
                    {t.Description && (
                      <div class="text-xs text-gray-600 mt-1 line-clamp-3">
                        {t.Description}
                      </div>
                    )}
                    <div class="flex items-center justify-between mt-2 text-xs">
                      {t.UserStory?.Priority && (
                        <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                          {t.UserStory.Priority}
                        </span>
                      )}
                      {typeof t.UserStory?.Points === "number" && (
                        <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                          {t.UserStory.Points} pts
                        </span>
                      )}
                      {t.AssignedTo?.Nombre && (
                        <span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                          {t.AssignedTo.Nombre}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
