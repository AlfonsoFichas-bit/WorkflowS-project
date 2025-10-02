import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";


const SunIcon = () => (
  <span class="material-symbols-outlined text-primary">light_mode</span>
);
const MoonIcon = () => (
  <span class="material-symbols-outlined text-primary">dark_mode</span>
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
      class="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark.value ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
