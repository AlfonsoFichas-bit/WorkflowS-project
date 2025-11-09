import { Head } from "fresh/runtime";
import { define } from "../../../../utils.ts";
import { DashboardLayout } from "../../../../components/DashboardLayout.tsx";
import KanbanBoardIsland from "../../../../islands/KanbanBoardIsland.tsx";

export default define.page(function ProjectKanbanPage(req, _ctx) {
  const url = new URL(req.url);
  const match = url.pathname.match(/\/dashboard\/projects\/(\d+)\/kanban$/);
  const projectId = match ? Number(match[1]) : 0;

  return (
    <>
      <Head>
        <title>Kanban | Proyecto #{projectId} | WorkflowS</title>
      </Head>
      <DashboardLayout>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="mb-4 flex items-center justify-between">
            <h1 class="text-2xl font-semibold">Tablero Kanban</h1>
            <span class="text-sm text-gray-600">Proyecto: #{projectId}</span>
          </div>
          {projectId > 0
            ? <KanbanBoardIsland projectId={projectId} />
            : <div class="text-gray-600">ID de proyecto inválido</div>}
        </div>
      </DashboardLayout>
    </>
  );
});
