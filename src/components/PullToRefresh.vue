<template>
  <div 
    class="pull-to-refresh-indicator"
    :class="{ 'visible': isPulling || isRefreshing }"
    :style="{ transform: `translateY(${pullDistance}px)`, opacity: pullDistance / threshold }">
    <div class="refresh-icon" :class="{ 'spinning': isRefreshing }">
      <svg v-if="!isRefreshing" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
      </svg>
      <div v-else class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Refreshing...</span>
      </div>
    </div>
    <span class="refresh-text">{{ isRefreshing ? 'Refreshing...' : 'Pull to refresh' }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  threshold: number;
}>();
</script>

<style scoped>
.pull-to-refresh-indicator {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  z-index: 1040;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.pull-to-refresh-indicator.visible {
  opacity: 1;
}

.refresh-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

.refresh-icon.spinning {
  animation: none;
}

.refresh-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .pull-to-refresh-indicator {
    display: none;
  }
}
</style>
