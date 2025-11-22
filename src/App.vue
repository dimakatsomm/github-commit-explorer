<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark navbar-github">
      <div class="container-fluid">
        <a class="navbar-brand" @click="handleBrandClick" role="button" style="cursor: pointer;">
          <svg class="me-2" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span class="d-none d-md-inline">GitHub Commit Explorer</span>
          <span class="d-inline d-md-none">GH Explorer</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSearch">
          <div class="d-flex flex-column flex-lg-row ms-auto align-items-stretch align-items-lg-center w-100 w-lg-auto mt-3 mt-lg-0">
            <div class="flex-grow-1 flex-lg-grow-0">
              <input
                v-model="usernameInput"
                @keyup.enter="onSearch"
                @input="validateUsername"
                type="text"
                class="form-control me-lg-2 mb-2 mb-lg-0"
                :class="{ 'is-invalid': validationError }"
                placeholder="Enter GitHub username"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                required />
              <small v-if="validationError" class="text-danger d-block d-lg-none">{{ validationError }}</small>
            </div>
            <div class="d-flex gap-2">
              <ThemeToggle class="d-none d-lg-block" />
              <button @click="onSearch" :disabled="!usernameInput.trim() || validationError !== null || isSearching" class="btn btn-primary flex-grow-1 flex-lg-grow-0">
                <span v-if="isSearching" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                <svg v-else width="16" height="16" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <span class="d-none d-sm-inline">{{ isSearching ? 'Searching...' : 'Search' }}</span>
                <span class="d-inline d-sm-none">{{ isSearching ? '...' : 'Go' }}</span>
              </button>
              <button v-if="activeUsername" @click="goHome" class="btn btn-outline-light flex-grow-1 flex-lg-grow-0">
                <svg width="16" height="16" fill="currentColor" class="d-inline d-sm-none" viewBox="0 0 16 16">
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
                </svg>
                <span class="d-none d-sm-inline">Home</span>
              </button>
              <ThemeToggle class="d-lg-none" />
            </div>
            <small v-if="validationError" class="text-danger mt-2 d-none d-lg-block" style="position: absolute; top: 100%; right: 0;">{{ validationError }}</small>
          </div>
        </div>
      </div>
    </nav>
    <div class="container-fluid mt-3 mt-md-4 mb-5 pb-5 px-2 px-sm-3">
      <RouterView />
    </div>
    
    <!-- Fixed Favourites Footer -->
    <div v-if="favourites.length > 0" class="favourites-footer">
      <div class="container-fluid">
        <FavouriteList 
          :favourites="favourites" 
          @removeFavourite="handleRemoveFavourite"
          @viewDetails="handleViewDetails" 
        />
      </div>
    </div>
  </div>
  
  <!-- Commit Details Modal -->
  <CommitDetails 
    :detail="selectedCommitDetail" 
    :show="showCommitModal"
    @close="closeCommitModal"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import { useNavigation, useRouteParams, useRepos, useFavourites, useTheme } from '@/composables';
import { useCommits } from '@/composables';
import FavouriteList from '@/components/favourites/FavouriteList.vue';
import CommitDetails from '@/components/commits/CommitDetails.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

// Initialize theme on mount
onMounted(() => {
  useTheme();
});

const router = useRouter();
const route = useRoute();
const { navigateToHome } = useNavigation();
const { username } = useRouteParams();
const { fetchRepos, clearError, clearSelectedRepo } = useRepos();
const { favourites, removeFavourite } = useFavourites();
const { fetchCommitDetail, getCommitDetail } = useCommits();

const showCommitModal = ref(false);
const selectedCommitSha = ref<string | null>(null);
const selectedCommitDetail = computed(() => {
  return selectedCommitSha.value ? getCommitDetail(selectedCommitSha.value) : null;
});

const usernameInput = ref(username.value);
const activeUsername = ref(username.value);
const validationError = ref<string | null>(null);
const isSearching = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(username, (u) => {
  if (u) {
    activeUsername.value = u;
    fetchRepos(u);
  }
});

watch(usernameInput, () => {
  validationError.value = null;
  
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (usernameInput.value.trim()) {
      validateUsername();
    }
  }, 300);
});

function validateUsername() {
  const name = usernameInput.value.trim();
  
  if (!name) {
    validationError.value = 'Username is required';
    return false;
  }
  
  if (name.length < 1 || name.length > 39) {
    validationError.value = 'Username must be between 1 and 39 characters';
    return false;
  }
  
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    validationError.value = 'Username can only contain letters, numbers, and hyphens';
    return false;
  }
  
  if (name.startsWith('-') || name.endsWith('-')) {
    validationError.value = 'Username cannot start or end with a hyphen';
    return false;
  }
  
  if (name.includes('--')) {
    validationError.value = 'Username cannot contain consecutive hyphens';
    return false;
  }
  
  validationError.value = null;
  return true;
}

async function onSearch() {
  if (!validateUsername()) return;
  const name = usernameInput.value.trim();
  if (!name) return;
  
  isSearching.value = true;
  activeUsername.value = name;
  
  try {
    await navigateToHome(name);
  } finally {
    isSearching.value = false;
  }
}

function goHome() {
  if (!activeUsername.value) return;
  clearError();
  clearSelectedRepo();
  
  router.push({ name: 'home', query: { user: activeUsername.value } });
}

function handleBrandClick() {
  const user = (route.query.user as string) || activeUsername.value;
  if (!user) return;
  
  clearError();
  clearSelectedRepo();
  router.push({ name: 'home', query: { user } });
}

function handleRemoveFavourite(sha: string) {
  removeFavourite(sha);
}

async function handleViewDetails(sha: string, repoName: string) {
  if (!username.value) return;
  selectedCommitSha.value = sha;
  showCommitModal.value = true;
  await fetchCommitDetail(username.value, repoName, sha);
}

function closeCommitModal() {
  showCommitModal.value = false;
  selectedCommitSha.value = null;
}
</script>

<style scoped>
.app { 
  min-height: 100vh; 
  background-color: #f8f9fa; 
  position: relative; 
  padding-bottom: 120px; 
}

@media (max-width: 576px) {
  .app {
    padding-bottom: 150px;
  }
}

.favourites-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 2px solid var(--color-primary);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: var(--z-sticky);
}

.favourites-footer .card {
  margin: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
</style>
