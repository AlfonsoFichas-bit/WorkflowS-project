import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import { DashboardLayout } from "../../components/DashboardLayout.tsx";
import DashboardSpaIsland from "../../islands/DashboardSpaIsland.tsx";

export default define.page(function Dashboard() {
  return (
    <>
      <Head>
        <title>Panel de Control - WorkflowS</title>
      </Head>
      <DashboardLayout>
        <DashboardSpaIsland />
      </DashboardLayout>
    </>
  );
});
