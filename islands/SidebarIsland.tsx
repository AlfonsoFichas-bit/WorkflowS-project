import { useEffect, useState } from "preact/hooks";
import { useIsMobile } from "../utils/hooks.ts";
import { MaterialSymbol } from "../components/MaterialSymbol.tsx";

interface User {
  ID: number;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Correo: string;
  Role: string;
  CreatedAt: string;
}

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
    formattedRole?: string;
  };
}

export default function SidebarIsland({
  user: initialUser = {
    name: "Usuario",
    email: "usuario@example.com",
    role: "team_developer",
    formattedRole: "Team Developer",
  },
}: SidebarProps) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarCollapsed");
      return savedState === "true";
    }
    return false;
  });

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    const isInitiallyCollapsed = savedState === "true";

    if (isInitiallyCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }

    const mainElement = document.querySelector("main");
    if (mainElement) {
      if (isInitiallyCollapsed) {
        mainElement.classList.add("sidebar-collapsed-main");
        mainElement.style.marginLeft = "4rem";
      } else {
        mainElement.classList.remove("sidebar-collapsed-main");
        mainElement.style.marginLeft = "16rem";
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData: User = await response.json();
          const fullName = `${userData.Nombre} ${userData.ApellidoPaterno}`
            .trim();
          setUser({
            name: fullName,
            email: userData.Correo,
            role: userData.Role,
            formattedRole: userData.Role.charAt(0).toUpperCase() +
              userData.Role.slice(1).replace("_", " "),
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:8080/api/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      globalThis.location.href = "/login";
    }
  };

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed ? "true" : "false");

    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.classList.add("sidebar-collapsed-main");
      }
    } else {
      document.body.classList.remove("sidebar-collapsed");
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.classList.remove("sidebar-collapsed-main");
      }
    }

    setTimeout(() => {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        if (isCollapsed) {
          mainElement.style.marginLeft = "4rem";
        } else {
          mainElement.style.marginLeft = "16rem";
        }
      }
    }, 0);
  }, [isCollapsed]);

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
        >
          <MaterialSymbol icon="menu" className="icon-md" />
        </button>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          >
            <div
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-blue-600">
                      WorkflowS
                    </h2>
                    <button
                      type="button"
                      onClick={toggleMobileMenu}
                      className="p-2 text-gray-500 dark:text-gray-400"
                    >
                      <MaterialSymbol icon="close" className="icon-md" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    <a
                      href="/dashboard"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol
                        icon="dashboard"
                        className="icon-md"
                        fill={1}
                      />
                      <span>Panel de Control</span>
                    </a>
                    <a
                      href="/dashboard/projects"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol icon="folder" className="icon-md" />
                      <span>Proyectos</span>
                    </a>
                    <a
                      href="/dashboard/tasks"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol icon="task" className="icon-md" />
                      <span>Tareas</span>
                    </a>
                    <a
                      href="/dashboard/team"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol icon="group" className="icon-md" />
                      <span>Equipo</span>
                    </a>
                    <a
                      href="/dashboard/sprints"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol icon="timer" className="icon-md" />
                      <span>Sprints</span>
                    </a>
                    <a
                      href="/dashboard/user-stories"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol icon="book" className="icon-md" />
                      <span>Historias de Usuario</span>
                    </a>
                    <a
                      href="/dashboard/users"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol icon="person" className="icon-md" />
                      <span>Usuarios</span>
                    </a>
                    <a
                      href="/dashboard/icons"
                      data-spa-link
                      className="flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <MaterialSymbol icon="palette" className="icon-md" />
                      <span>Íconos</span>
                    </a>
                  </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                      {loading ? "..." : user.name.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {loading ? "Cargando..." : user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {loading
                          ? "Cargando..."
                          : (user.formattedRole || user.role)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                      title="Menú de usuario"
                    >
                      <MaterialSymbol
                        icon={isUserMenuOpen ? "expand_less" : "expand_more"}
                        className="icon-md"
                        weight={500}
                      />
                    </button>
                  </div>
                  {isUserMenuOpen && (
                    <div className="space-y-1">
                      <a
                        href="/dashboard/profile"
                        className="flex items-center gap-3 rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                      >
                        <MaterialSymbol icon="person" className="icon-md" />
                        <span>Perfil</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 rounded-md p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 ease-in-out w-full text-left"
                      >
                        <MaterialSymbol
                          icon="logout"
                          className="icon-md"
                          fill={1}
                        />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-all duration-300 ease-in-out">
        {!isCollapsed
          ? (
            <h2 className="text-xl font-bold text-blue-600 transition-opacity duration-300 ease-in-out">
              WorkflowS
            </h2>
          )
          : (
            <div className="w-0 opacity-0 transition-all duration-300 ease-in-out">
            </div>
          )}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out ${
            isCollapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          <MaterialSymbol
            icon={isCollapsed ? "chevron_right" : "chevron_left"}
            className="icon-md"
            weight={500}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out">
        <nav className="space-y-2">
          <a
            href="/dashboard"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <MaterialSymbol
              icon="dashboard"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              fill={1}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Dashboard
              </span>
            )}
          </a>
          <a
            href="/dashboard/projects"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "Proyectos" : undefined}
          >
            <MaterialSymbol
              icon="folder"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Proyectos
              </span>
            )}
          </a>
          <a
            href="/dashboard/tasks"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "Tareas" : undefined}
          >
            <MaterialSymbol
              icon="task"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Tareas
              </span>
            )}
          </a>
          <a
            href="/dashboard/team"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "Equipo" : undefined}
          >
            <MaterialSymbol
              icon="group"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Equipo
              </span>
            )}
          </a>
          <a
            href="/dashboard/sprints"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "Sprints" : undefined}
          >
            <MaterialSymbol
              icon="timer"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Sprints
              </span>
            )}
          </a>
          <a
            href="/dashboard/user-stories"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "User Stories" : undefined}
          >
            <MaterialSymbol
              icon="book"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                User Stories
              </span>
            )}
          </a>
          <a
            href="/dashboard/users"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "Usuarios" : undefined}
          >
            <MaterialSymbol
              icon="person"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Usuarios
              </span>
            )}
          </a>
          <a
            href="/dashboard/icons"
            data-spa-link
            className={`flex items-center gap-3 rounded-md p-1.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out ${
              isCollapsed ? "justify-center px-1.5" : ""
            }`}
            title={isCollapsed ? "Iconos" : undefined}
          >
            <MaterialSymbol
              icon="palette"
              className={`icon-md transition-all duration-300 ease-in-out ${
                isCollapsed ? "icon-lg" : ""
              }`}
              weight={500}
            />
            {!isCollapsed && (
              <span className="transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                Iconos
              </span>
            )}
          </a>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out relative">
        {isUserMenuOpen && (
          <div
            className={`absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "bottom-full left-1/2 -translate-x-1/2 mb-2 w-48"
                : "bottom-full left-0 w-full mb-2"
            }`}
          >
            <div className="p-2 space-y-1">
              <a
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <MaterialSymbol icon="person" className="icon-md" />
                <span>Perfil</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-3 rounded-md p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 ease-in-out w-full text-left"
              >
                <MaterialSymbol icon="logout" className="icon-md" fill={1} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setIsUserMenuOpen(!isUserMenuOpen);
          }}
          className={`flex items-center gap-3 w-full rounded-md p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
          title="Menú de usuario"
        >
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold transition-all duration-300 ease-in-out">
            {loading ? "..." : user.name.charAt(0)}
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-grow transition-all duration-300 ease-in-out">
                <p className="font-medium text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out">
                  {loading ? "Cargando..." : user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out">
                  {loading ? "Cargando..." : (user.formattedRole || user.role)}
                </p>
              </div>
              <MaterialSymbol
                icon={isUserMenuOpen ? "expand_less" : "expand_more"}
                className="icon-md"
                weight={500}
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
