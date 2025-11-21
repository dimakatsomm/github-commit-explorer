export interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

export interface GitHubCommitResponse {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
}

export interface GitHubFileResponse {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
}

export interface GitHubCommitDetailResponse {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  files?: GitHubFileResponse[];
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}
