import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGithubStore } from '@/stores/useGithubStore';
import * as githubApi from '@/api/github';

vi.mock('@/api/github', () => ({
  fetchUserRepos: vi.fn(),
  fetchRepoCommits: vi.fn(),
  fetchCommitDetails: vi.fn()
}));

describe('useGithubStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchRepos', () => {
    it('loads repos and updates state', async () => {
      const mockRepos = [
        { id: '1', name: 'repo1', description: 'Test', stars: 10, forks: 2, language: 'JS' },
        { id: '2', name: 'repo2', description: '', stars: 5, forks: 1, language: 'TS' }
      ];
      vi.mocked(githubApi.fetchUserRepos).mockResolvedValue(mockRepos);

      const store = useGithubStore();
      expect(store.repos).toEqual([]);

      await store.fetchRepos('testuser');

      expect(store.repos).toEqual(mockRepos);
      expect(store.loadingRepos).toBe(false);
      expect(store.error).toBe(null);
    });

    it('handles fetch errors', async () => {
      vi.mocked(githubApi.fetchUserRepos).mockRejectedValue(new Error('Network error'));

      const store = useGithubStore();
      await store.fetchRepos('baduser');

      expect(store.error).toBe('Network error');
      expect(store.repos).toEqual([]);
    });
  });

  describe('fetchCommits', () => {
    it('loads commits and updates page', async () => {
      const mockCommits = [
        { sha: 'abc', authorName: 'Alice', date: '2025-01-01', message: 'Fix', repoName: 'repo1' }
      ];
      vi.mocked(githubApi.fetchRepoCommits).mockResolvedValue({ commits: mockCommits, nextPage: 2 });

      const store = useGithubStore();
      await store.fetchCommits('user', 'repo1', 1);

      expect(store.commits).toEqual(mockCommits);
      expect(store.commitsPage).toBe(2);
    });

    it('appends commits on subsequent pages', async () => {
      const page1 = [{ sha: 'a1', authorName: 'A', date: '2025-01-01', message: 'M1', repoName: 'r' }];
      const page2 = [{ sha: 'a2', authorName: 'B', date: '2025-01-02', message: 'M2', repoName: 'r' }];

      vi.mocked(githubApi.fetchRepoCommits)
        .mockResolvedValueOnce({ commits: page1, nextPage: 2 })
        .mockResolvedValueOnce({ commits: page2, nextPage: null });

      const store = useGithubStore();
      await store.fetchCommits('user', 'repo', 1);
      expect(store.commits).toHaveLength(1);

      await store.fetchCommits('user', 'repo', 2);
      expect(store.commits).toHaveLength(2);
      expect(store.commits[1].sha).toBe('a2');
    });
  });

  describe('toggleFavourite', () => {
    it('adds a commit to favourites', () => {
      const store = useGithubStore();
      const commit = { sha: 'fav1', authorName: 'Alice', date: '2025-01-01', message: 'Fav', repoName: 'repo' };

      store.toggleFavourite(commit);
      expect(store.favourites).toHaveLength(1);
      expect(store.favourites[0].sha).toBe('fav1');
      expect(store.isFavourite('fav1')).toBe(true);
    });

    it('removes a commit from favourites when toggled again', () => {
      const store = useGithubStore();
      const commit = { sha: 'fav2', authorName: 'Bob', date: '2025-01-01', message: 'Toggle', repoName: 'repo' };

      store.toggleFavourite(commit);
      expect(store.favourites).toHaveLength(1);

      store.toggleFavourite(commit);
      expect(store.favourites).toHaveLength(0);
      expect(store.isFavourite('fav2')).toBe(false);
    });

    it('persists favourites to localStorage', async () => {
      const store = useGithubStore();
      const commit = { sha: 'persist', authorName: 'X', date: '2025-01-01', message: 'Persist', repoName: 'repo' };

      store.toggleFavourite(commit);
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const stored = localStorage.getItem('favourites');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].sha).toBe('persist');
    });
  });

  describe('removeFavourite', () => {
    it('removes favourite by sha', () => {
      const store = useGithubStore();
      const commit = { sha: 'remove', authorName: 'Y', date: '2025-01-01', message: 'Rm', repoName: 'repo' };

      store.toggleFavourite(commit);
      expect(store.favourites).toHaveLength(1);

      store.removeFavourite('remove');
      expect(store.favourites).toHaveLength(0);
    });
  });

  describe('sortedCommits', () => {
    it('sorts commits by newest first', () => {
      const store = useGithubStore();
      store.commits = [
        { sha: 'c1', authorName: 'A', date: '2025-01-01T10:00:00Z', message: 'Old', repoName: 'r' },
        { sha: 'c2', authorName: 'B', date: '2025-01-02T10:00:00Z', message: 'New', repoName: 'r' }
      ];
      store.commitsSortOrder = 'newest';

      const sorted = store.sortedCommits;
      expect(sorted[0].sha).toBe('c2');
      expect(sorted[1].sha).toBe('c1');
    });

    it('sorts commits by oldest first', () => {
      const store = useGithubStore();
      store.commits = [
        { sha: 'c1', authorName: 'A', date: '2025-01-02T10:00:00Z', message: 'New', repoName: 'r' },
        { sha: 'c2', authorName: 'B', date: '2025-01-01T10:00:00Z', message: 'Old', repoName: 'r' }
      ];
      store.commitsSortOrder = 'oldest';

      const sorted = store.sortedCommits;
      expect(sorted[0].sha).toBe('c2');
      expect(sorted[1].sha).toBe('c1');
    });
  });
});
