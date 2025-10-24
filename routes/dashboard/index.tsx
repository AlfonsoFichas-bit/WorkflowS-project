import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import { DashboardLayout } from "../../components/DashboardLayout.tsx";
import DashboardSpaIsland from "../../islands/DashboardSpaIsland.tsx";

export default define.page(function Dashboard() {
  return (
    <>
      <Head>
        <title>WorkflowS Dashboard</title>
      </Head>
      <DashboardLayout>
        <DashboardSpaIsland />
      </DashboardLayout>
    </>
  );
});