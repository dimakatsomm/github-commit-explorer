import { ref, watch, Ref } from 'vue';

/**
 * Generic composable for localStorage persistence
 * Provides reactive localStorage with JSON serialization
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key);
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue) as Ref<T>;

  watch(data, (newValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Failed to save to localStorage key: ${key}`, error);
    }
  }, { deep: true });

  return data;
}

/**
 * Remove item from localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key: ${key}`, error);
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage', error);
  }
}
