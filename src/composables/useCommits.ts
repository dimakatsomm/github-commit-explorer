import { computed } from 'vue';
import { useGithubStore } from '@/stores/useGithubStore';
import type { CommitSummary } from '@/types/commit';
import type { SortOrder } from '@/stores/useGithubStore';

export function useCommits() {
  const store = useGithubStore();

  const commits = computed(() => store.sortedCommits);
  const commitDetails = computed(() => store.commitDetails);
  const isLoading = computed(() => store.loadingCommits);
  const isLoadingDetail = computed(() => store.loadingCommitDetail);
  const currentPage = computed(() => store.commitsPage);
  const sortOrder = computed(() => store.commitsSortOrder);

  async function fetchCommits(username: string, repoName: string, page = 1) {
    if (!username || !repoName) return;
    await store.fetchCommits(username, repoName, page);
  }

  async function fetchCommitDetail(username: string, repoName: string, sha: string) {
    if (!username || !repoName || !sha) return;
    await store.fetchCommitDetail(username, repoName, sha);
  }

  function getCommitDetail(sha: string) {
    return commitDetails.value[sha] ?? null;
  }

  function changeSortOrder(order: SortOrder) {
    store.commitsSortOrder = order;
  }

  function loadNextPage(username: string, repoName: string) {
    const nextPage = currentPage.value + 1;
    return fetchCommits(username, repoName, nextPage);
  }

  return {
    commits,
    commitDetails,
    isLoading,
    isLoadingDetail,
    currentPage,
    sortOrder,
    fetchCommits,
    fetchCommitDetail,
    getCommitDetail,
    changeSortOrder,
    loadNextPage
  };
}
