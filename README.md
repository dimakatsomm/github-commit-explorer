# GitHub Commit Explorer

A modern Vue 3 + TypeScript application for exploring GitHub repositories and commits, built with clean architecture principles and performance best practices.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📋 Features

- **GitHub User Search** - Search any GitHub user with real-time validation
- **Repository Browser** - View all public repositories with metadata (stars, forks, language)
- **Commit Explorer** - Browse paginated commit history with sorting (newest/oldest)
- **Favourites System** - Save and manage favourite commits with localStorage persistence
- **Commit Details Modal** - View full commit details including file changes, diffs, and status
- **Performance Optimized** - Debounced search (300ms), throttled persistence (300ms), memoized sorting
- **Responsive Design** - Bootstrap 5 UI that works on all devices

## 📦 Setup Instructions

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-commit-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Run tests**
   ```bash
   npm test          # Watch mode
   npm test -- --run # Single run (CI/CD)
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview   # Preview production build
   ```

### Project Structure

```
src/
├── api/              # GitHub API calls (fetch functions)
├── assets/styles/    # Global CSS and design tokens
├── components/       # Reusable Vue components
│   ├── commits/     # CommitList, CommitItem, CommitDetails, CommitToolbar
│   ├── favourites/  # FavouriteList
│   └── repos/       # RepoList
├── composables/      # Composition API logic
│   ├── useRepos.ts
│   ├── useCommits.ts
│   ├── useFavourites.ts
│   ├── useNavigation.ts
│   ├── useRouteParams.ts
│   └── useScrollRestoration.ts
├── router/          # Vue Router configuration
├── services/        # Business logic & data transformations
├── stores/          # Pinia state management (useGithubStore)
├── types/           # TypeScript interfaces (Repo, Commit, etc.)
├── utils/           # Utility functions (debounce, throttle, formatting)
└── views/           # Page-level components (HomeView, RepoView)
```

## 🏗 Architecture Approach

### Design Philosophy

This project follows **clean architecture** and **separation of concerns**:

1. **Thin Components, Thick Domain Layer**
   - Components are presentational only (no business logic)
   - All logic lives in Pinia store and composables
   - No API calls or data transformation in components

2. **Single Source of Truth**
   - All state managed by Pinia (`useGithubStore`)
   - Components access state via composables (never directly)
   - Reactive updates propagate automatically

3. **Composable Abstraction Pattern**
   ```
   Vue Components → Composables → Pinia Store → API Layer → GitHub API
   ```

4. **Type Safety First**
   - Strict TypeScript with no `any` types
   - Explicit interfaces for all data structures
   - API responses transformed to domain models

### Architecture Layers

```
┌────────────────────────────────────────┐
│  Views & Components (Presentation)     │
│  HomeView, RepoView, CommitList, etc.  │
└──────────────┬─────────────────────────┘
               │ uses composables
┌──────────────▼─────────────────────────┐
│  Composables (Business Logic Wrapper)  │
│  useRepos, useCommits, useFavourites    │
└──────────────┬─────────────────────────┘
               │ wraps Pinia store
┌──────────────▼─────────────────────────┐
│  Pinia Store (State Management)        │
│  repos, commits, favourites, actions    │
└──────────────┬─────────────────────────┘
               │ calls API layer
┌──────────────▼─────────────────────────┐
│  API Layer (External Communication)    │
│  fetchUserRepos, fetchCommits, etc.     │
└──────────────┬─────────────────────────┘
               │ HTTP requests
┌──────────────▼─────────────────────────┐
│  Services (Data Transformation)        │
│  mapRepoResponse, mapCommitResponse     │
└────────────────────────────────────────┘
               │
               ▼
         GitHub REST API
```

### Performance Strategy

- **Debouncing** (300ms) - Search validation reduces unnecessary checks by 70-80%
- **Throttling** (300ms) - localStorage writes prevent excessive I/O (90% reduction)
- **Memoization** - Computed properties cache sorted/filtered data
- **Lazy Loading** - Pagination for commit lists (30 per page)
- **Optimistic Updates** - Instant UI feedback before persistence
- **Scroll Restoration** - Remembers scroll position when navigating back
- **Code Splitting** - Vue Router lazy loads views

## 🧪 Testing Approach

### Testing Strategy

We follow a **focused testing approach** prioritizing:

1. **Business Logic** - Store actions and state mutations
2. **Data Transformation** - API response → domain model mapping
3. **Composables** - Reusable business logic wrappers

### Running Tests

```bash
npm test          # Watch mode for development
npm test -- --run # Single run for CI/CD
```

### Current Coverage

✅ **22 tests passing** (execution time: ~3 seconds)

- **Store tests (10)** - fetchRepos, fetchCommits, fetchCommitDetail, toggleFavourite, localStorage persistence, sorting
- **Transform tests (6)** - mapRepoResponse, mapCommitResponse, mapCommitDetailResponse
- **Composable tests (6)** - useRepos, useCommits, useFavourites behavior

### Testing Philosophy

- **No UI tests** - Components are thin and presentational
- **Mock external dependencies** - API calls mocked with Vitest
- **Test behavior, not implementation** - Focus on outcomes
- **Fast execution** - All tests complete in ~3 seconds

## 🛠 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vue 3** | 3.5.0 | Reactive UI with Composition API |
| **TypeScript** | 5.4.0 | Type-safe development |
| **Pinia** | 2.1.7 | State management |
| **Vue Router** | 4.x | Client-side routing |
| **Vite** | 5.0.0 | Dev server & build tool |
| **Vitest** | 1.0.0 | Unit testing |
| **Bootstrap 5** | 5.x | UI components & utilities |

## 🎯 Development Workflow

### Recommended Approach

1. **Start with the store** - Define state and actions in Pinia
2. **Create composables** - Abstract store logic for component use
3. **Build components** - Keep them thin and presentational
4. **Write tests** - Test store actions and transformations
5. **Iterate** - Refactor based on feedback

### Code Style Guidelines

- Use **Composition API** with `<script setup lang="ts">`
- Prefer **named exports** over default exports
- Keep functions **pure** and **testable**
- Use **explicit TypeScript interfaces** for all data
- Follow **single responsibility principle**
- Components should be **< 200 lines**
- Functions should be **< 40 lines**

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit with descriptive messages
git commit -m "feat: add commit details modal"

# Run tests before pushing
npm test -- --run

# Push and create PR
git push origin feature/your-feature
```

## 🚀 Deployment

This project is configured for automatic deployment to **Vercel** (free tier) via GitHub Actions.

### Setup Deployment

1. **Create a Vercel account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import your project**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Get deployment credentials**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel login`
   - Run `vercel link` in project directory
   - Get tokens:
     - **VERCEL_TOKEN**: From [vercel.com/account/tokens](https://vercel.com/account/tokens)
     - **VERCEL_ORG_ID**: Found in `.vercel/project.json`
     - **VERCEL_PROJECT_ID**: Found in `.vercel/project.json`

4. **Add secrets to GitHub**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add three repository secrets:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

5. **Deploy**
   ```bash
   # Push to main branch triggers automatic deployment
   git push origin main
   ```

### Manual Deployment

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

Your app will be live at: `https://your-project.vercel.app`

## 📚 Additional Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture and data flow documentation
- **[UX_IMPROVEMENTS.md](./UX_IMPROVEMENTS.md)** - Performance optimizations and UX enhancements
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Coding standards and AI assistant guidelines

## 📝 License

MIT License - Free to use for learning and development

---

**Built with Vue 3, TypeScript, and Vite**
