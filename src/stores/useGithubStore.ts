import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Repo } from '@/types/repo';
import type { CommitSummary, CommitDetail, FavouriteCommit } from '@/types/commit';
import { fetchUserRepos, fetchRepoCommits, fetchCommitDetails } from '@/api/github';

export type SortOrder = 'newest' | 'oldest';

function loadFavouritesFromStorage(): FavouriteCommit[] {
  try {
    const raw = localStorage.getItem('favourites');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useGithubStore = defineStore('github', () => {
  const repos = ref<Repo[]>([]);
  const commits = ref<CommitSummary[]>([]);
  const commitDetails = ref<Record<string, CommitDetail>>({});
  const favourites = ref<FavouriteCommit[]>(loadFavouritesFromStorage());
  const selectedRepo = ref<Repo | null>(null);
  const commitsPage = ref(1);
  const commitsSortOrder = ref<SortOrder>('newest');

  const loadingRepos = ref(false);
  const loadingCommits = ref(false);
  const loadingCommitDetail = ref(false);
  const error = ref<string | null>(null);
  const rateLimited = ref(false);

  let saveTimeout: ReturnType<typeof setTimeout> | null = null;
  watch(favourites, (newFavs) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('favourites', JSON.stringify(newFavs));
      } catch (e) {
        console.error('Failed to save favourites:', e);
      }
    }, 300);
  }, { deep: true });

  const sortedCommits = computed(() => {
    const sorted = [...commits.value];
    const order = commitsSortOrder.value;
    
    sorted.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return order === 'newest' ? db - da : da - db;
    });
    
    return sorted;
  });

  function setRepo(repo: Repo) {
    selectedRepo.value = repo;
    commits.value = [];
    commitsPage.value = 1;
  }

  async function fetchRepos(username: string) {
    loadingRepos.value = true; error.value = null; rateLimited.value = false;
    try {
      repos.value = await fetchUserRepos(username);
    } catch (e: any) {
      handleError(e);
    } finally {
      loadingRepos.value = false;
    }
  }

  async function fetchCommits(username: string, repoName: string, page = 1) {
    loadingCommits.value = true; error.value = null; rateLimited.value = false;
    try {
      const { commits: pageCommits, nextPage } = await fetchRepoCommits(username, repoName, page);
      if (page === 1) commits.value = pageCommits; else commits.value.push(...pageCommits);
      commitsPage.value = nextPage ?? page;
    } catch (e: any) {
      handleError(e);
    } finally {
      loadingCommits.value = false;
    }
  }

  async function fetchCommitDetail(username: string, repoName: string, sha: string) {
    if (commitDetails.value[sha]) return;
    
    loadingCommitDetail.value = true; error.value = null; rateLimited.value = false;
    try {
      const detail = await fetchCommitDetails(username, repoName, sha);
      commitDetails.value[sha] = detail;
    } catch (e: any) {
      handleError(e);
    } finally {
      loadingCommitDetail.value = false;
    }
  }

  function toggleFavourite(commit: CommitSummary) {
    const idx = favourites.value.findIndex((f: FavouriteCommit) => f.sha === commit.sha);
    if (idx >= 0) {
      favourites.value.splice(idx, 1);
    } else {
      favourites.value.unshift({ sha: commit.sha, message: commit.message, repoName: commit.repoName });
    }
  }

  function removeFavourite(sha: string) {
    const idx = favourites.value.findIndex((f: FavouriteCommit) => f.sha === sha);
    if (idx >= 0) favourites.value.splice(idx, 1);
  }

  function isFavourite(sha: string) {
    return favourites.value.some((f: FavouriteCommit) => f.sha === sha);
  }

  function handleError(e: any) {
    if (e?.message?.includes('rate limit')) rateLimited.value = true;
    error.value = e?.message ?? 'Unknown error';
  }

  return {
    repos, commits, commitDetails, favourites, selectedRepo,
    commitsPage, commitsSortOrder,
    loadingRepos, loadingCommits, loadingCommitDetail, error, rateLimited,
    sortedCommits,
    setRepo, fetchRepos, fetchCommits, fetchCommitDetail,
    toggleFavourite, removeFavourite, isFavourite
  };
});
