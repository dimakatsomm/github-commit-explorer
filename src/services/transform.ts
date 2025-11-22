import type { Repo } from '@/types/repo';
import type { CommitSummary, CommitDetail, CommitFileDiff } from '@/types/commit';
import type { GitHubRepoResponse, GitHubCommitResponse, GitHubCommitDetailResponse } from '@/types/github-api';
import { formatIsoDate } from '@/utils/formatting';

export function mapRepoResponse(raw: GitHubRepoResponse): Repo {
  return {
    id: String(raw.id),
    name: raw.name ?? 'unknown',
    description: raw.description ?? '',
    stars: raw.stargazers_count ?? 0,
    forks: raw.forks_count ?? 0,
    language: raw.language ?? 'N/A',
    url: raw.html_url ?? ''
  };
}

export function mapCommitResponse(repoName: string) {
  return (raw: GitHubCommitResponse): CommitSummary => {
    return {
      sha: raw.sha,
      authorName: raw.commit?.author?.name ?? 'unknown',
      date: formatIsoDate(raw.commit?.author?.date),
      message: raw.commit?.message ?? '',
      repoName
    };
  };
}

export function mapCommitDetailResponse(repoName: string, raw: GitHubCommitDetailResponse): CommitDetail {
  const files: CommitFileDiff[] = Array.isArray(raw.files)
    ? raw.files.map((f) => ({
        filename: f.filename,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes,
        status: f.status
      }))
    : [];
  return {
    sha: raw.sha,
    repoName,
    authorName: raw.commit?.author?.name ?? 'unknown',
    date: formatIsoDate(raw.commit?.author?.date),
    message: raw.commit?.message ?? '',
    files
  };
}
