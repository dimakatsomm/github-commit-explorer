import { ref, watch } from 'vue';

type Theme = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'github-explorer-theme';
const theme = ref<Theme>('auto');
const effectiveTheme = ref<'light' | 'dark'>('light');

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateEffectiveTheme() {
  const newTheme = theme.value === 'auto' ? getSystemTheme() : theme.value;
  effectiveTheme.value = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved && ['light', 'dark', 'auto'].includes(saved)) {
    theme.value = saved;
  }
  updateEffectiveTheme();
}

export function useTheme() {
  if (typeof window === 'undefined') {
    return { theme, effectiveTheme, setTheme: () => {}, toggleTheme: () => {} };
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    localStorage.setItem(STORAGE_KEY, newTheme);
    updateEffectiveTheme();
  }

  function toggleTheme() {
    const next: Record<Theme, Theme> = {
      'light': 'dark',
      'dark': 'auto',
      'auto': 'light'
    };
    setTheme(next[theme.value]);
  }

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (theme.value === 'auto') {
      updateEffectiveTheme();
    }
  });

  // Load theme on first use
  if (!theme.value || theme.value === 'auto') {
    loadTheme();
  }

  watch(theme, updateEffectiveTheme);

  return { theme, effectiveTheme, setTheme, toggleTheme };
}
