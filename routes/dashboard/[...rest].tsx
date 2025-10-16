import { define } from "../../utils.ts";
import { DashboardLayout } from "../../components/DashboardLayout.tsx";
import DashboardSpaIsland from "../../islands/DashboardSpaIsland.tsx";

// Catch-all dashboard server route to allow deep-linking while letting the SPA island render the view
export default define.page(function DashboardCatchAll() {
  return (
    <DashboardLayout>
      <DashboardSpaIsland />
    </DashboardLayout>
  );
});
