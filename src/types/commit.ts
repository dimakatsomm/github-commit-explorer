export interface CommitSummary {
  sha: string;
  authorName: string;
  date: string;
  message: string;
  repoName: string;
}

export interface CommitFileDiff {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
}

export interface CommitDetail {
  sha: string;
  repoName: string;
  authorName: string;
  date: string;
  message: string;
  files: CommitFileDiff[];
}

export interface FavouriteCommit {
  sha: string;
  message: string;
  repoName: string;
}
