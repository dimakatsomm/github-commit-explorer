import { useRouter } from 'vue-router';
import type { Repo } from '@/types/repo';

/**
 * Composable for app navigation logic
 * Encapsulates routing patterns used across the app
 */
export function useNavigation() {
  const router = useRouter();

  function navigateToHome(username: string) {
    router.push({ name: 'home', query: { user: username } });
  }

  function navigateToRepo(repo: Repo, username: string) {
    router.push({ 
      name: 'repo', 
      params: { name: repo.name }, 
      query: { user: username } 
    });
  }

  function navigateToCommitDetail(repoName: string, username: string, sha: string) {
    router.push({ 
      name: 'repo', 
      params: { name: repoName }, 
      query: { user: username, sha } 
    });
  }

  return {
    navigateToHome,
    navigateToRepo,
    navigateToCommitDetail
  };
}
