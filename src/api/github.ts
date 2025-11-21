import { mapRepoResponse, mapCommitResponse, mapCommitDetailResponse } from '@/services/transform';
import type { Repo } from '@/types/repo';
import type { CommitSummary, CommitDetail } from '@/types/commit';

const BASE = 'https://api.github.com';

interface PagedCommitsResult {
  commits: CommitSummary[];
  nextPage: number | null;
}

export async function fetchUserRepos(username: string): Promise<Repo[]> {
  const res = await fetch(`${BASE}/users/${username}/repos`);
  
  if (res.status === 403) {
    const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining');
    if (rateLimitRemaining === '0') {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
  }
  
  if (res.status === 404) {
    throw new Error(`User '${username}' not found. Please check the username and try again.`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch repositories: ${res.statusText}`);
  }
  
  const data = await res.json();
  
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  return data.map(mapRepoResponse);
}

export async function fetchRepoCommits(username: string, repo: string, page = 1, perPage = 20): Promise<PagedCommitsResult> {
  const res = await fetch(`${BASE}/repos/${username}/${repo}/commits?per_page=${perPage}&page=${page}`);
  
  if (res.status === 403) {
    const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining');
    if (rateLimitRemaining === '0') {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
  }
  
  if (res.status === 404) {
    throw new Error(`Repository '${username}/${repo}' not found or has no commits.`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch commits: ${res.statusText}`);
  }
  
  const data = await res.json();
  const commits = Array.isArray(data) ? data.map(mapCommitResponse(repo)) : [];
  const nextLink = parseLinkHeader(res.headers.get('link'));
  
  return { commits, nextPage: nextLink?.next ?? null };
}

export async function fetchCommitDetails(username: string, repo: string, sha: string): Promise<CommitDetail> {
  const res = await fetch(`${BASE}/repos/${username}/${repo}/commits/${sha}`);
  
  if (res.status === 403) {
    const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining');
    if (rateLimitRemaining === '0') {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
  }
  
  if (res.status === 404) {
    throw new Error(`Commit '${sha}' not found in repository '${username}/${repo}'.`);
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch commit details: ${res.statusText}`);
  }
  
  const data = await res.json();
  return mapCommitDetailResponse(repo, data);
}

function parseLinkHeader(header: string | null): { next?: number } | null {
  if (!header) return null;
  const parts = header.split(',');
  const obj: { next?: number } = {};
  for (const p of parts) {
    const m = p.match(/<([^>]+)>; rel="(\w+)"/);
    if (!m) continue;
    const url = m[1];
    const rel = m[2];
    const pageMatch = url.match(/[?&]page=(\d+)/);
    if (rel === 'next' && pageMatch) obj.next = Number(pageMatch[1]);
  }
  return obj;
}
