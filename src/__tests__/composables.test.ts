import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRepos } from '@/composables/useRepos';
import { useCommits } from '@/composables/useCommits';
import { useFavourites } from '@/composables/useFavourites';
import * as githubApi from '@/api/github';

vi.mock('@/api/github', () => ({
  fetchUserRepos: vi.fn(),
  fetchRepoCommits: vi.fn(),
  fetchCommitDetails: vi.fn()
}));

describe('useRepos composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetches repos and exposes reactive state', async () => {
    const mockRepos = [
      { id: '1', name: 'test-repo', description: '', stars: 5, forks: 1, language: 'TS' }
    ];
    vi.mocked(githubApi.fetchUserRepos).mockResolvedValue(mockRepos);

    const { repos, fetchRepos, isLoading } = useRepos();
    
    expect(repos.value).toEqual([]);
    await fetchRepos('testuser');
    
    expect(repos.value).toEqual(mockRepos);
    expect(isLoading.value).toBe(false);
  });

  it('finds repo by name', async () => {
    const mockRepos = [
      { id: '1', name: 'repo-a', description: '', stars: 5, forks: 1, language: 'JS' },
      { id: '2', name: 'repo-b', description: '', stars: 10, forks: 2, language: 'TS' }
    ];
    vi.mocked(githubApi.fetchUserRepos).mockResolvedValue(mockRepos);

    const { fetchRepos, findRepoByName } = useRepos();
    await fetchRepos('user');

    const found = findRepoByName('repo-b');
    expect(found?.id).toBe('2');
    expect(findRepoByName('nonexistent')).toBeUndefined();
  });
});

describe('useCommits composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetches commits and exposes state', async () => {
    const mockCommits = [
      { sha: 'abc', authorName: 'Alice', date: '2025-01-01', message: 'Test', repoName: 'repo' }
    ];
    vi.mocked(githubApi.fetchRepoCommits).mockResolvedValue({ commits: mockCommits, nextPage: null });

    const { commits, fetchCommits } = useCommits();
    await fetchCommits('user', 'repo', 1);

    expect(commits.value).toHaveLength(1);
    expect(commits.value[0].sha).toBe('abc');
  });

  it('changes sort order', () => {
    const { sortOrder, changeSortOrder } = useCommits();
    expect(sortOrder.value).toBe('newest');
    
    changeSortOrder('oldest');
    expect(sortOrder.value).toBe('oldest');
  });
});

describe('useFavourites composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('toggles favourites', () => {
    const { favourites, toggleFavourite, isFavourite } = useFavourites();
    const commit = { sha: 'xyz', authorName: 'Bob', date: '2025-01-01', message: 'Fav', repoName: 'repo' };

    expect(isFavourite('xyz')).toBe(false);
    
    toggleFavourite(commit);
    expect(favourites.value).toHaveLength(1);
    expect(isFavourite('xyz')).toBe(true);

    toggleFavourite(commit);
    expect(favourites.value).toHaveLength(0);
    expect(isFavourite('xyz')).toBe(false);
  });

  it('removes favourite by sha', () => {
    const { toggleFavourite, removeFavourite, favourites } = useFavourites();
    const commit = { sha: 'remove', authorName: 'X', date: '2025-01-01', message: 'Test', repoName: 'r' };

    toggleFavourite(commit);
    expect(favourites.value).toHaveLength(1);

    removeFavourite('remove');
    expect(favourites.value).toHaveLength(0);
  });
});
