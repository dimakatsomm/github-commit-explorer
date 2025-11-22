<template>
  <div ref="viewRef" v-if="selectedRepo" class="repo-view">
    <PullToRefresh 
      :isPulling="isPulling"
      :isRefreshing="isRefreshing"
      :pullDistance="pullDistance"
      :threshold="80"
    />
    <div class="d-flex justify-content-between align-items-center mb-3 mb-md-4">
      <h2 class="h3 h2-md mb-0">
        <svg width="24" height="24" class="d-inline d-md-none me-2" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
        </svg>
        <svg width="28" height="28" class="d-none d-md-inline me-2" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
        </svg>
        <span class="text-primary">{{ selectedRepo.name }}</span> <span class="d-none d-sm-inline">Commits</span>
      </h2>
    </div>
    <CommitToolbar :sortOrder="sortOrder" @loadMore="loadMore" @changeSort="changeSort" />
    <CommitList
      :commits="commits"
      :isLoading="isLoading"
      :favouriteChecker="isFavourite"
      @fetchDetail="fetchDetail"
      @toggleFavourite="toggleFavourite"
    />
    
    <div v-if="showModal && isLoadingDetail" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading commit details...</span>
      </div>
    </div>
  </div>
  
  <div v-else class="alert alert-info text-center py-5" role="alert">
    <svg width="48" height="48" fill="currentColor" class="mb-3" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>
    <h4>No Repository Selected</h4>
    <p class="mb-0">Please select a repository from the home page or enter a valid repository URL.</p>
  </div>
  
  <CommitDetails 
    :detail="selectedCommitDetail" 
    :show="showModal"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue';
import { useNavigation, useRouteParams, useRepos, useCommits, useFavourites, usePullToRefresh } from '@/composables';
import { useScrollRestoration } from '@/composables/useScrollRestoration';
import CommitToolbar from '@/components/commits/CommitToolbar.vue';
import CommitList from '@/components/commits/CommitList.vue';
import CommitDetails from '@/components/commits/CommitDetails.vue';
import PullToRefresh from '@/components/PullToRefresh.vue';

const props = defineProps<{ name: string }>();

useScrollRestoration('repo');

const { navigateToCommitDetail } = useNavigation();
const { username, repoName, commitSha } = useRouteParams();
const { selectedRepo, selectRepo, findRepoByName } = useRepos();
const { 
  commits, 
  isLoading,
  isLoadingDetail,
  sortOrder, 
  fetchCommits, 
  fetchCommitDetail, 
  getCommitDetail,
  changeSortOrder, 
  loadNextPage 
} = useCommits();
const { favourites, toggleFavourite, isFavourite } = useFavourites();

const showModal = ref(false);
const selectedCommitSha = ref<string | null>(null);
const viewRef = ref<HTMLElement | null>(null);

const { isPulling, isRefreshing, pullDistance } = usePullToRefresh(viewRef, {
  onRefresh: async () => {
    if (selectedRepo.value && username.value) {
      await fetchCommits(username.value, selectedRepo.value.name, 1);
    }
  },
  threshold: 80
});

const selectedCommitDetail = computed(() => {
  return selectedCommitSha.value ? getCommitDetail(selectedCommitSha.value) : null;
});

onMounted(() => {
  if (props.name) {
    const repo = findRepoByName(props.name);
    if (repo) {
      selectRepo(repo);
      if (username.value) {
        fetchCommits(username.value, repo.name, 1);
      }
    }
  }
});

watch(() => props.name, (name: string) => {
  if (!name) return;
  const repo = findRepoByName(name);
  if (repo) {
    selectRepo(repo);
    if (username.value && !commits.value.length) {
      fetchCommits(username.value, repo.name, 1);
    }
  }
});

function loadMore() {
  if (!selectedRepo.value || !username.value) return;
  loadNextPage(username.value, selectedRepo.value.name);
}

function changeSort(order: 'newest' | 'oldest') {
  changeSortOrder(order);
}

function fetchDetail(sha: string) {
  if (!selectedRepo.value || !username.value) return;
  selectedCommitSha.value = sha;
  showModal.value = true;
  fetchCommitDetail(username.value, selectedRepo.value.name, sha);
}

function closeModal() {
  showModal.value = false;
  selectedCommitSha.value = null;
}
</script>

<style scoped>
</style>
