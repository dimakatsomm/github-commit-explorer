import { computed } from 'vue';
import { useGithubStore } from '@/stores/useGithubStore';
import type { CommitSummary, FavouriteCommit } from '@/types/commit';

/**
 * Composable for favourites management
 * Encapsulates favourite commit operations
 */
export function useFavourites() {
  const store = useGithubStore();

  const favourites = computed(() => store.favourites);

  function toggleFavourite(commit: CommitSummary) {
    store.toggleFavourite(commit);
  }

  function removeFavourite(sha: string) {
    store.removeFavourite(sha);
  }

  function isFavourite(sha: string): boolean {
    return store.isFavourite(sha);
  }

  return {
    favourites,
    toggleFavourite,
    removeFavourite,
    isFavourite
  };
}
