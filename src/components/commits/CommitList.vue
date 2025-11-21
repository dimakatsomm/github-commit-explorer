<template>
  <div class="commit-list">
    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading commits...</span>
      </div>
    </div>
    <div v-else-if="commits.length === 0" class="alert alert-info text-center py-4" role="alert">
      <svg width="48" height="48" fill="currentColor" class="mb-3" viewBox="0 0 16 16">
        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0z"/>
      </svg>
      <h5>No Commits Found</h5>
      <p class="mb-0 text-muted">This repository has no commits yet.</p>
    </div>
    <div v-else class="list-group">
      <CommitItem
        v-for="c in commits"
        :key="c.sha"
        :commit="c"
        :isFavourite="favouriteChecker(c.sha)"
        @toggleFavourite="onToggle(c)"
        @viewDetails="onView(c.sha)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommitSummary } from '@/types/commit';
import CommitItem from '@/components/commits/CommitItem.vue';

const props = defineProps<{
  commits: CommitSummary[];
  isLoading: boolean;
  favouriteChecker: (sha: string) => boolean;
}>();

const emit = defineEmits<{ toggleFavourite: [commit: CommitSummary]; fetchDetail: [sha: string] }>();

function onToggle(commit: CommitSummary) { emit('toggleFavourite', commit); }
function onView(sha: string) { emit('fetchDetail', sha); }
</script>

<style scoped>
.commit-list { margin-top: 1rem; }
</style>
