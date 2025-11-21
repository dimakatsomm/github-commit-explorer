import { computed } from 'vue';
import { useGithubStore } from '@/stores/useGithubStore';
import type { Repo } from '@/types/repo';

/**
 * Composable for repository operations
 * Encapsulates repo fetching, selection, and state management
 */
export function useRepos() {
  const store = useGithubStore();

  const repos = computed(() => store.repos);
  const selectedRepo = computed(() => store.selectedRepo);
  const isLoading = computed(() => store.loadingRepos);
  const error = computed(() => store.error);

  async function fetchRepos(username: string) {
    if (!username) return;
    await store.fetchRepos(username);
  }

  function selectRepo(repo: Repo) {
    store.setRepo(repo);
  }

  function findRepoByName(name: string): Repo | undefined {
    return repos.value.find(r => r.name === name);
  }

  function clearError() {
    store.error = null;
  }

  function clearSelectedRepo() {
    store.selectedRepo = null;
  }

  return {
    repos,
    selectedRepo,
    isLoading,
    error,
    fetchRepos,
    selectRepo,
    findRepoByName,
    clearError,
    clearSelectedRepo
  };
}
