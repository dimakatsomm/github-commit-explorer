<template>
  <transition-group name="fade" tag="div" class="row g-3">
    <div v-for="r in repos" :key="r.id" class="col-md-6 col-lg-4">
      <div
        class="card h-100 repo-card"
        tabindex="0"
        role="button"
        @click="select(r.id)"
        @keydown.enter.prevent="select(r.id)"
      >
        <div class="card-body">
          <h5 class="card-title d-flex align-items-center">
            <svg class="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.25.25 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25z"/>
            </svg>
            {{ r.name }}
          </h5>
          <p class="card-text text-muted small" v-if="r.description">{{ r.description }}</p>
          <p class="card-text text-muted small fst-italic" v-else>No description</p>
          <div class="d-flex gap-3 mt-3">
            <span class="badge bg-warning text-dark">
              ⭐ {{ r.stars }}
            </span>
            <span class="badge bg-info text-dark">
              <svg width="12" height="12" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
              </svg>
              {{ r.forks }}
            </span>
            <span class="badge bg-secondary" v-if="r.language">{{ r.language }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import type { Repo } from '@/types/repo';

const props = defineProps<{ repos: Repo[] }>();
const emit = defineEmits<{ select: [id: string] }>();

function select(id: string) {
  emit('select', id);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-move {
  transition: transform 0.3s ease;
}
</style>
