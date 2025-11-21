import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Composable for extracting and watching route parameters
 * Provides reactive access to common route params/query
 */
export function useRouteParams() {
  const route = useRoute();

  const username = computed(() => String(route.query.user || ''));
  const repoName = computed(() => String(route.params.name || ''));
  const commitSha = computed(() => route.query.sha ? String(route.query.sha) : null);

  return {
    username,
    repoName,
    commitSha
  };
}
