import { describe, it, expect } from 'vitest';
import { mapRepoResponse, mapCommitResponse, mapCommitDetailResponse } from '@/services/transform';

describe('mapRepoResponse', () => {
  it('maps minimal API response to domain Repo', () => {
    const raw = {
      id: 12345,
      name: 'test-repo',
      description: null,
      stargazers_count: 10,
      forks_count: 2,
      language: 'TypeScript'
    };
    const result = mapRepoResponse(raw);
    expect(result).toEqual({
      id: '12345',
      name: 'test-repo',
      description: '',
      stars: 10,
      forks: 2,
      language: 'TypeScript'
    });
  });

  it('handles missing optional fields', () => {
    const raw = { 
      id: 99, 
      name: 'minimal',
      description: null,
      stargazers_count: 0,
      forks_count: 0,
      language: null
    };
    const result = mapRepoResponse(raw);
    expect(result.name).toBe('minimal');
    expect(result.description).toBe('');
    expect(result.language).toBe('N/A');
  });
});

describe('mapCommitResponse', () => {
  it('maps commit API response to CommitSummary', () => {
    const raw = {
      sha: 'abc123',
      commit: {
        author: { name: 'Alice', date: '2025-01-15T10:30:00Z' },
        message: 'Initial commit'
      }
    };
    const mapper = mapCommitResponse('my-repo');
    const result = mapper(raw);
    expect(result.sha).toBe('abc123');
    expect(result.authorName).toBe('Alice');
    expect(result.message).toBe('Initial commit');
    expect(result.repoName).toBe('my-repo');
    expect(result.date).toBeTruthy();
  });

  it('handles missing nested fields gracefully', () => {
    const raw = { 
      sha: 'def456', 
      commit: {
        author: { name: '', date: '' },
        message: ''
      }
    };
    const mapper = mapCommitResponse('repo');
    const result = mapper(raw);
    expect(result.authorName).toBe('');
    expect(result.message).toBe('');
  });
});

describe('mapCommitDetailResponse', () => {
  it('maps commit detail with files', () => {
    const raw = {
      sha: 'xyz789',
      commit: {
        author: { name: 'Bob', date: '2025-02-20T14:00:00Z' },
        message: 'Add feature'
      },
      files: [
        { filename: 'app.ts', additions: 10, deletions: 2, changes: 12, status: 'modified' },
        { filename: 'test.ts', additions: 5, deletions: 0, changes: 5, status: 'added' }
      ]
    };
    const result = mapCommitDetailResponse('test-repo', raw);
    expect(result.sha).toBe('xyz789');
    expect(result.repoName).toBe('test-repo');
    expect(result.files).toHaveLength(2);
    expect(result.files[0].filename).toBe('app.ts');
    expect(result.files[1].status).toBe('added');
  });

  it('handles no files gracefully', () => {
    const raw = { 
      sha: 'nofiles', 
      commit: { 
        author: { name: '', date: '' }, 
        message: 'Empty' 
      },
      files: []
    };
    const result = mapCommitDetailResponse('repo', raw);
    expect(result.files).toEqual([]);
  });
});
