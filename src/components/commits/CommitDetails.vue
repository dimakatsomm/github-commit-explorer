<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && detail" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-dialog modal-dialog-scrollable modal-xl" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="modal-content">
            <div class="modal-header commit-detail-header text-white">
              <h5 class="modal-title mb-0" id="modalTitle">
                <svg width="20" height="20" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                  <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
                </svg>
                Commit Details
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body scrollable-body">
              <h6 class="card-subtitle mb-3 text-muted">
                <code class="commit-sha">{{ detail.sha.slice(0,7) }}</code>
              </h6>
              <p class="card-text"><strong>{{ detail.message }}</strong></p>
              <p class="card-text">
                <small class="text-muted">
                  <svg width="14" height="14" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>
                  {{ detail.authorName }} · {{ detail.date }}
                </small>
              </p>
              <h6 class="mt-4">Files Changed ({{ detail.files.length }})</h6>
              <div class="table-responsive">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th class="text-center">Status</th>
                      <th class="text-end">Additions</th>
                      <th class="text-end">Deletions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="f in detail.files" :key="f.filename">
                      <td><code class="small">{{ f.filename }}</code></td>
                      <td class="text-center"><span class="badge" :class="getStatusClass(f.status)">{{ f.status }}</span></td>
                      <td class="text-end text-success">+{{ f.additions }}</td>
                      <td class="text-end text-danger">-{{ f.deletions }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CommitDetail } from '@/types/commit';
import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{ 
  detail: CommitDetail | null;
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

function closeModal() {
  emit('close');
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});

function getStatusClass(status: string) {
  const statusMap: Record<string, string> = {
    added: 'bg-success',
    modified: 'bg-warning text-dark',
    removed: 'bg-danger',
    renamed: 'bg-info text-dark'
  };
  return statusMap[status] || 'bg-secondary';
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-dialog {
  max-height: 90vh;
  margin: 0;
  width: 100%;
  max-width: 1140px;
  display: flex;
  flex-direction: column;
}

.modal-content {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.commit-detail-header {
  background: #24292f;
  border-bottom: none;
  padding: 1rem 1.5rem;
  flex-shrink: 0;
}

.commit-sha {
  font-family: var(--font-family-mono);
  background-color: rgba(13, 110, 253, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.2);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  transform: scale(0.95) translateY(-20px);
}

.modal-body {
  padding: 1.5rem;
  background-color: #ffffff;
}

.scrollable-body {
  overflow-y: auto;
  max-height: calc(90vh - 140px);
  flex: 1;
}

.modal-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  flex-shrink: 0;
  padding: 1rem 1.5rem;
}
</style>
