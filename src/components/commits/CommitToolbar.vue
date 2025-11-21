<template>
  <div class="toolbar card mb-3">
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-auto">
          <label class="form-label mb-0 me-2">Sort by:</label>
        </div>
        <div class="col-auto">
          <select v-model="localOrder" @change="emit('changeSort', localOrder)" class="form-select form-select-sm">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <div class="col-auto ms-auto">
          <button @click="emit('loadMore')" class="btn btn-sm btn-outline-primary">
            <svg width="16" height="16" fill="currentColor" class="me-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
            </svg>
            Load More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ sortOrder: 'newest' | 'oldest' }>();
const emit = defineEmits<{ loadMore: []; changeSort: [order: 'newest' | 'oldest'] }>();
import { ref, watch } from 'vue';
const localOrder = ref(props.sortOrder);
watch(() => props.sortOrder, o => { localOrder.value = o; });
</script>

<style scoped>
</style>
