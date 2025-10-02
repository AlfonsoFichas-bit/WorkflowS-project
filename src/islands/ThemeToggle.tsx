import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

const SunIcon = () => (
  <span class="material-symbols-outlined text-primary text-2xl">
    light_mode
  </span>
);
const MoonIcon = () => (
  <span class="material-symbols-outlined text-primary text-2xl">dark_mode</span>
);

export default function ThemeToggle() {
  // Always call hooks at the top
  const isDark = useSignal(false); // Safe default for SSR
  const isMounted = useSignal(false);

  useEffect(() => {
    isDark.value = document.documentElement.classList.contains("dark");
    isMounted.value = true;
  }, []);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  };

  if (!isMounted.value) {
    return <div class="w-10 h-10" />; // Placeholder for SSR and initial render
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="w-14 h-14 rounded-full shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
      aria-label="Toggle dark mode"
    >
      {isDark.value ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
