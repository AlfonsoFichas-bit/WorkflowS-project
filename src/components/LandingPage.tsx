import ThemeToggle from "../islands/ThemeToggle.tsx";

export default function LandingPage() {
  return (
    <div class="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <header class="py-4 px-6 sm:px-16 lg:px-24">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold text-primary">WorkflowS</h1>
          <nav class="hidden md:flex items-center gap-6">
            <a
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              href="#"
            >
              Features
            </a>
            <a
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              href="#"
            >
              About Us
            </a>
          </nav>
          <div class="flex items-center gap-2">
            <ThemeToggle />
            <a
              class="px-4 py-2 rounded-lg text-sm font-bold bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              href="#"
            >
              Iniciar Sesión
            </a>
            <a
              class="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:opacity-90 transition-opacity"
              href="#"
            >
              Registrarse
            </a>
          </div>
        </div>
      </header>
      <main class="flex-grow">
        <section class="py-20 sm:py-24 lg:py-32">
          <div class="container mx-auto px-6 sm:px-16 lg:px-24 grid md:grid-cols-2 gap-12 items-center">
            <div class="flex flex-col gap-6 text-center md:text-left">
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
                Gestiona tus proyectos académicos con{" "}
                <span class="text-primary">WorkflowS</span>
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                Una plataforma de gestión de proyectos basada en Scrum, diseñada
                para estudiantes y académicos de la Universidad La Salle.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
                <a
                  class="w-full sm:w-auto px-8 py-3 rounded-lg text-base font-bold bg-primary text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  href="#"
                >
                  <span>Iniciar Sesión</span>
                  <span class="material-symbols-outlined">arrow_forward</span>
                </a>
                <a
                  class="w-full sm:w-auto px-8 py-3 rounded-lg text-base font-bold bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                  href="#"
                >
                  Registrarse
                </a>
              </div>
            </div>
            <div class="relative w-full aspect-square max-w-md mx-auto md:max-w-none">
              <div class="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl">
              </div>
              <img
                alt="Abstract graphic representing workflow and collaboration"
                class="relative w-full h-full object-cover rounded-xl shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZWtmhqqHfnQWiIeubw-gYitn8AB0iWPYljr9PLNTKFoigo3OJ6X9nW68YqEBL9Ptp9YnWQMva_YNyF2o6JwhvXMtXUzhWsNl1EtnFjE_jkBiCAo9m2Mv_oNlMh0-QmWqbauSK6e5Bn0_I7D4ypRKziAdJWnxpl2h4B_CMAqUv61njVtEzPAtOiaJpPX2mdBu2RSbQ9TBE8G53GgMI7Hhpn9Lc-ZXbG2o1L2UEPc8JgvZiTEEeto1BubWU0uvkTajJlxLBs7_ibdsJ"
              />
            </div>
          </div>
        </section>
        <section class="py-20 sm:py-24 lg:py-32 bg-primary/5 dark:bg-primary/10">
          <div class="container mx-auto px-6 sm:px-16 lg:px-24">
            <div class="text-center max-w-3xl mx-auto">
              <h3 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Potencia tu éxito académico
              </h3>
              <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
                WorkflowS ofrece un conjunto de herramientas diseñadas para
                optimizar tus proyectos académicos, desde la planificación hasta
                la entrega final.
              </p>
            </div>
            <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                  <span class="material-symbols-outlined text-primary text-3xl">
                    visibility
                  </span>
                </div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">
                  Visualiza tu Progreso
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Realiza un seguimiento del avance de tu proyecto con
                  herramientas visuales e intuitivas.
                </p>
              </div>
              <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                  <span class="material-symbols-outlined text-primary text-3xl">
                    checklist
                  </span>
                </div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">
                  Planificación Iterativa
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Planifica tus proyectos en iteraciones, adaptándote a los
                  cambios con agilidad.
                </p>
              </div>
              <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                  <span class="material-symbols-outlined text-primary text-3xl">
                    groups
                  </span>
                </div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">
                  Colaboración Estructurada
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Colabora eficazmente con tu equipo utilizando flujos de
                  trabajo definidos.
                </p>
              </div>
              <div class="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg border border-transparent dark:border-primary/20 flex flex-col items-start gap-4">
                <div class="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                  <span class="material-symbols-outlined text-primary text-3xl">
                    forum
                  </span>
                </div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">
                  Retroalimentación Clara
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Recibe y proporciona feedback claro durante todo el ciclo de
                  vida del proyecto.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer class="text-gray-600 body-font">
        <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="w-10 h-10 text-white p-2 bg-primary rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5">
              </path>
            </svg>
            <span class="ml-3 text-xl">WorkflowS</span>
          </a>
          <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2025 WorkflowS —
            <a
              href="https://twitter.com/knyttneve"
              class="text-gray-600 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              @Ronald
            </a>
          </p>
          <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a class="text-gray-500">
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z">
                </path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z">
                </path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01">
                </path>
              </svg>
            </a>
            <a class="ml-3 text-gray-500">
              <svg
                fill="currentColor"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="0"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                >
                </path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
