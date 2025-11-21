<template>
  <div class="home">
    <div v-if="loadingRepos" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading repositories...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <svg width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <strong>Error:</strong> {{ error }}
      <button type="button" class="btn-close" @click="clearError" aria-label="Close"></button>
    </div>
    <section v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <svg width="28" height="28" fill="currentColor" class="me-2" viewBox="0 0 16 16">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.25.25 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25z"/>
          </svg>
          Repositories
        </h2>
        <span class="badge bg-primary rounded-pill" v-if="repos.length">{{ repos.length }}</span>
      </div>
      <div v-if="repos.length === 0" class="alert alert-info text-center py-5" role="alert">
        <svg width="48" height="48" fill="currentColor" class="mb-3" viewBox="0 0 16 16">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8z"/>
        </svg>
        <h4>No Repositories Found</h4>
        <p class="mb-0">This user has no public repositories.</p>
      </div>
      <RepoList v-else :repos="repos" @select="onSelectRepo" />
    </section>

    <section v-if="selectedRepo" class="commits mt-5">
      <h3 class="mb-3">
        <svg width="24" height="24" fill="currentColor" class="me-2" viewBox="0 0 16 16">
          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
        </svg>
        Commits for <span class="text-primary">{{ selectedRepo.name }}</span>
      </h3>
      <CommitToolbar
        :sortOrder="sortOrder"
        @loadMore="loadMore"
        @changeSort="changeSort"
      />
      <CommitList
        :commits="commits"
        :isLoading="false"
        :favouriteChecker="isFavourite"
        @fetchDetail="fetchDetail"
        @toggleFavourite="toggleFavourite"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useNavigation, useRepos, useCommits, useFavourites } from '@/composables';
import { useScrollRestoration } from '@/composables/useScrollRestoration';
import RepoList from '@/components/repos/RepoList.vue';
import CommitList from '@/components/commits/CommitList.vue';
import CommitToolbar from '@/components/commits/CommitToolbar.vue';

const props = defineProps<{ username: string }>();

useScrollRestoration('home');

const { navigateToRepo } = useNavigation();
const { repos, selectedRepo, isLoading: loadingRepos, error, fetchRepos, clearError } = useRepos();
const { commits, sortOrder, changeSortOrder, loadNextPage } = useCommits();
const { toggleFavourite, isFavourite } = useFavourites();

watch(() => props.username, (u: string) => {
  if (u) fetchRepos(u);
}, { immediate: true });

function onSelectRepo(repoId: string) {
  const repo = repos.value.find((r) => r.id === repoId);
  if (!repo || !props.username) return;
  navigateToRepo(repo, props.username);
}

function loadMore() {
  if (!selectedRepo.value || !props.username) return;
  loadNextPage(props.username, selectedRepo.value.name);
}

function changeSort(order: 'newest' | 'oldest') {
  changeSortOrder(order);
}

function fetchDetail(sha: string) {}
</script>

<style scoped>
.commits { border-top: 1px solid #dee2e6; padding-top: 2rem; }
</style>
