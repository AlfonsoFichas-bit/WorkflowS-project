import { useEffect, useMemo, useState } from "preact/hooks";
import type { VNode } from "preact";
import { Breadcrumbs } from "../components/Breadcrumbs.tsx";
import UserManagementIsland from "./UserManagementIsland.tsx";
import ProjectsIsland from "./ProjectsIsland.tsx";

interface RouteDef {
  path: string; // e.g. "/dashboard", "/dashboard/projects"
  title: string;
  render: () => VNode | null;
}

function matchRoute(pathname: string, routes: RouteDef[]): RouteDef | undefined {
  // Simple exact and prefix match for nested sections
  const exact = routes.find((r) => r.path === pathname);
  if (exact) return exact;
  // Support deep links under known sections, e.g. /dashboard/projects/123
  return routes.find((r) => pathname.startsWith(r.path + "/"));
}

export default function DashboardSpaIsland() {
  const routes = useMemo<RouteDef[]>(() => [
    {
      path: "/dashboard",
      title: "Dashboard",
      render: () => (
        <div class="max-w-7xl mx-auto">
          <Breadcrumbs breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }]} />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Proyectos Activos</h2>
              <p class="text-gray-600 dark:text-gray-400">Gestiona tus proyectos actuales.</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Tareas Pendientes</h2>
              <p class="text-gray-600 dark:text-gray-400">Revisa tus tareas asignadas.</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Equipo</h2>
              <p class="text-gray-600 dark:text-gray-400">Colabora con tu equipo.</p>
            </div>
          </div>
          <UserManagementIsland />
        </div>
      ),
    },
     {
       path: "/dashboard/projects",
       title: "Proyectos",
       render: () => (
         <div class="max-w-7xl mx-auto">
           <Breadcrumbs breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Proyectos" }]} />
           <ProjectsIsland />
         </div>
       ),
     },
    {
      path: "/dashboard/tasks",
      title: "Tareas",
      render: () => (
        <div class="max-w-7xl mx-auto">
          <Breadcrumbs breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Tareas" }]} />
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Tareas</h2>
            <p class="text-gray-600 dark:text-gray-400">Gestión de tareas.</p>
          </div>
        </div>
      ),
    },
    {
      path: "/dashboard/team",
      title: "Equipo",
      render: () => (
        <div class="max-w-7xl mx-auto">
          <Breadcrumbs breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Equipo" }]} />
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Equipo</h2>
            <p class="text-gray-600 dark:text-gray-400">Gestión de equipo.</p>
          </div>
        </div>
      ),
    },
     {
       path: "/dashboard/users",
       title: "Usuarios",
       render: () => (
         <div class="max-w-7xl mx-auto">
           <Breadcrumbs breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Usuarios" }]} />
           <UserManagementIsland />
         </div>
       ),
     },
    {
      path: "/dashboard/icons",
      title: "Iconos",
      render: () => (
        <div class="max-w-7xl mx-auto">
          <Breadcrumbs breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Iconos" }]} />
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Iconos</h2>
            <p class="text-gray-600 dark:text-gray-400">Catálogo de iconos.</p>
          </div>
        </div>
      ),
    },
  ], []);

  const [pathname, setPathname] = useState<string>(typeof window !== "undefined" ? globalThis.location.pathname : "/dashboard");
  const current = matchRoute(pathname, routes);

  useEffect(() => {
    // Intercept clicks on dashboard links to avoid full reloads
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a[href^='/dashboard']") as HTMLAnchorElement | null;
      if (!anchor) return;

      // Respect new-tab/middle-click/modifier keys
      const me = e as MouseEvent;
      if (me && (me.defaultPrevented || me.button !== 0 || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey)) {
        return;
      }
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(anchor.href, globalThis.location.origin);
      if (url.origin !== globalThis.location.origin) return; // external

      e.preventDefault();
      if (url.pathname !== globalThis.location.pathname) {
        globalThis.history.pushState({}, "", url.pathname);
        setPathname(url.pathname);
      }
    };
    document.addEventListener("click", handler);

    const onPopState = () => setPathname(globalThis.location.pathname);
    globalThis.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", handler);
      globalThis.removeEventListener("popstate", onPopState);
    };
  }, []);

  if (!current) {
    // Fallback: if unknown subpath under /dashboard, show a 404-like message within SPA
    return (
      <div class="max-w-7xl mx-auto">
        <Breadcrumbs breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "No encontrado" }]} />
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No encontrado</h2>
          <p class="text-gray-600 dark:text-gray-400">La ruta solicitada no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-spa-root>
      {current.render()}
    </div>
  );
}
