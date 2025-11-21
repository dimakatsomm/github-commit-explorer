/**
 * Composable for managing scroll position and restoration
 * Improves UX by remembering scroll position when navigating
 */
import { onMounted, onBeforeUnmount } from 'vue';

export function useScrollRestoration(key: string) {
  const scrollKey = `scroll_${key}`;

  function saveScrollPosition() {
    const scrollY = window.scrollY;
    sessionStorage.setItem(scrollKey, scrollY.toString());
  }

  function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem(scrollKey);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }

  onMounted(() => {
    restoreScrollPosition();
  });

  onBeforeUnmount(() => {
    saveScrollPosition();
  });

  return {
    saveScrollPosition,
    restoreScrollPosition
  };
}
