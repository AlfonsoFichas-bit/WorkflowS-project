import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import { DashboardLayout } from "../../components/DashboardLayout.tsx";
import KanbanBoardIsland from "../../islands/KanbanBoardIsland.tsx";

export default define.page(function KanbanPage(req) {
  const url = new URL(req.url);
  const projectId = Number(url.searchParams.get("projectId") || "0");

  return (
    <>
      <Head>
        <title>Kanban | WorkflowS</title>
      </Head>
      <DashboardLayout>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="mb-4 flex items-center justify-between">
            <h1 class="text-2xl font-semibold">Tablero Kanban</h1>
          </div>
          {projectId ? (
            <KanbanBoardIsland projectId={projectId} />
          ) : (
            <div class="text-gray-600">Seleccione un proyecto (parámetro projectId)</div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
});
