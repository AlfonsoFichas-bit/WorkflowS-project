import { useSignal } from "@preact/signals";

const SunIcon = () => (
  <span class="material-symbols-outlined text-primary">light_mode</span>
);
const MoonIcon = () => (
  <span class="material-symbols-outlined text-primary">dark_mode</span>
);

export default function ThemeToggle() {
  if (typeof window === "undefined") {
    return <div class="w-10 h-10" />; // Placeholder for SSR
  }

  const isDark = useSignal(document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      class="p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark.value ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
