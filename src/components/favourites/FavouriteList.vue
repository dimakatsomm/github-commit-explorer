<template>
  <div class="favs card mt-4" v-if="favourites.length">
    <div 
      class="card-header favourites-header d-flex justify-content-between align-items-center"
      role="button"
      @click="toggleCollapse"
      style="cursor: pointer;">
      <h5 class="mb-0">
        <svg width="20" height="20" fill="currentColor" class="me-2" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>
        Favourites ({{ favourites.length }})
      </h5>
      <svg 
        width="20" 
        height="20" 
        fill="currentColor" 
        viewBox="0 0 16 16"
        :style="{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
      </svg>
    </div>
    <transition name="collapse">
      <ul v-show="!isCollapsed" class="list-group list-group-flush">
        <li v-for="f in favourites" :key="f.sha" class="list-group-item d-flex justify-content-between align-items-center favourite-item">
          <div class="flex-grow-1" @click="emit('viewDetails', f.sha, f.repoName)" role="button" style="cursor: pointer;">
            <code class="commit-sha">{{ f.sha.slice(0,7) }}</code>
            <span class="ms-2">{{ f.message }}</span>
            <span class="badge bg-secondary ms-2">{{ f.repoName }}</span>
          </div>
          <button 
            @click.stop="emit('removeFavourite', f.sha)" 
            class="btn btn-sm btn-outline-danger ms-2"
            title="Remove from favourites"
            aria-label="Remove from favourites">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FavouriteCommit } from '@/types/commit';

const props = defineProps<{ favourites: FavouriteCommit[] }>();
const emit = defineEmits<{ 
  removeFavourite: [sha: string];
  viewDetails: [sha: string, repoName: string];
}>();

const isCollapsed = ref(false);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.favourite-item .flex-grow-1:hover {
  background-color: rgba(13, 110, 253, 0.05);
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  margin: -0.25rem -0.5rem;
}
</style>
