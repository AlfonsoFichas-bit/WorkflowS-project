import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import { DashboardLayout } from "../../components/DashboardLayout.tsx";
import { Breadcrumbs } from "../../components/Breadcrumbs.tsx";
import UserManagementIsland from "../../islands/UserManagementIsland.tsx";

export default define.page(function Dashboard() {
   const breadcrumbs = [
     { title: "Dashboard", href: "/dashboard" }
   ];
   return (
     <>
       <Head>
         <title>WorkflowS Dashboard</title>
       </Head>
       <DashboardLayout>
         <div class="max-w-7xl mx-auto">
           <Breadcrumbs breadcrumbs={breadcrumbs} />
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
       </DashboardLayout>
     </>
   );
 });