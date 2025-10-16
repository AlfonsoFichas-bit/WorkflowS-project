import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function Home() {
  return (
    <>
      <Head>
        <title>WorkflowS Landing Page</title>
      </Head>
       <div class="min-h-screen flex flex-col bg-white dark:bg-background-dark">
        <header class="py-4 px-6 sm:px-16 lg:px-24 bg-white dark:bg-background-dark">
          <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-primary">WorkflowS</h1>
            <nav class="hidden md:flex items-center gap-6">
              <a class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">Features</a>
              <a class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">About Us</a>
            </nav>
            <div class="flex items-center gap-2">
              <a class="px-4 py-2 rounded-lg text-sm font-bold bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/70 transition-colors dark:text-gray-100 dark:hover:text-white" href="/login">Iniciar Sesión</a>
              <a class="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity" href="/register">Registrarse</a>
            </div>
          </div>
        </header>
        <main class="flex-grow">
          <section class="py-20 sm:py-24 lg:py-32 bg-white dark:bg-background-dark">
            <div class="container mx-auto px-6 sm:px-16 lg:px-24 grid md:grid-cols-2 gap-12 items-center">
              <div class="flex flex-col gap-6 text-center md:text-left">
                <h2 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
                  Gestiona tus proyectos académicos con <span class="text-primary">WorkflowS</span>
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-400">
                  Una plataforma de gestión de proyectos basada en Scrum, diseñada para estudiantes y académicos de la Universidad La Salle.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
                  <a class="w-full sm:w-auto px-8 py-3 rounded-lg text-base font-bold bg-primary text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" href="/login">
                    <span>Iniciar Sesión</span>
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </a>
                  <a class="w-full sm:w-auto px-8 py-3 rounded-lg text-base font-bold bg-primary/10 dark:bg-primary/20 text-primary dark:text-gray-100 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors" href="/register">
                    Registrarse
                  </a>
                </div>
              </div>
              <div class="relative w-full aspect-square max-w-md mx-auto md:max-w-none">
                <div class="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
                <img alt="Abstract graphic representing workflow and collaboration" class="relative w-full h-full object-cover rounded-xl shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZWtmhqqHfnQWiIeubw-gYitn8AB0iWPYljr9PLNTKFoigo3OJ6X9nW68YqEBL9Ptp9YnWQMva_YNyF2o6JwhvXMtXUzhWsNl1EtnFjE_jkBiCAo9m2Mv_oNlMh0-QmWqbauSK6e5Bn0_I7D4ypRKziAdJWnxpl2h4B_CMAqUv61njVtEzPAtOiaJpPX2mdBu2RSbQ9TBE8G53GgMI7Hhpn9Lc-ZXbG2o1L2UEPc8JgvZiTEEeto1BubWU0uvkTajJlxLBs7_ibdsJ" />
              </div>
            </div>
          </section>
          <section class="py-20 sm:py-24 lg:py-32 bg-primary/5 dark:bg-primary/10">
            <div class="container mx-auto px-6 sm:px-16 lg:px-24">
              <div class="text-center max-w-3xl mx-auto">
                <h3 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Potencia tu éxito académico</h3>
                <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">WorkflowS ofrece un conjunto de herramientas diseñadas para optimizar tus proyectos académicos, desde la planificación hasta la entrega final.</p>
              </div>
              <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                  <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <span class="material-symbols-outlined text-primary dark:text-white text-3xl">visibility</span>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white">Visualiza tu Progreso</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Realiza un seguimiento del avance de tu proyecto con herramientas visuales e intuitivas.</p>
                </div>
                <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                  <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <span class="material-symbols-outlined text-primary dark:text-white text-3xl">checklist</span>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white">Planificación Iterativa</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Planifica tus proyectos en iteraciones, adaptándote a los cambios con agilidad.</p>
                </div>
                <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                  <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <span class="material-symbols-outlined text-primary dark:text-white text-3xl">groups</span>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white">Colaboración Estructurada</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Colabora eficazmente con tu equipo utilizando flujos de trabajo definidos.</p>
                </div>
                <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                  <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <span class="material-symbols-outlined text-primary dark:text-white text-3xl">forum</span>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white">Retroalimentación Clara</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Recibe y proporciona feedback claro durante todo el ciclo de vida del proyecto.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer class="bg-background-light dark:bg-background-dark border-t border-primary/10 dark:border-primary/20">
          <div class="container mx-auto py-8 px-6 sm:px-16 lg:px-24 text-center">
            <div class="flex justify-center mb-4">
              <h2 class="text-lg font-semibold text-primary">Universidad La Salle</h2>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">© 2024 Universidad La Salle. Todos los derechos reservados.</p>
            <a class="text-sm text-primary hover:underline mt-2 inline-block" href="https://lasalle.edu.mx">lasalle.edu.mx</a>
          </div>
        </footer>
      </div>
    </>
  );
});
