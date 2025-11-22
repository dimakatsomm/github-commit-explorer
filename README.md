# GitHub Commit Explorer

A modern Vue 3 + TypeScript application for exploring GitHub repositories and commits, built with clean architecture principles and performance best practices.

## 🚀 Getting Started

Follow these steps to get the application up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** version 18 or higher
- **npm** version 9 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-commit-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Verify the installation**
   - Open your browser and navigate to `http://localhost:5173`
   - You should see the GitHub Commit Explorer home page

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Run tests in watch mode
npm test

# Run tests once (for CI/CD)
npm test -- --run

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

## 📋 Features

### Core Functionality
- **GitHub User Search** - Search any GitHub user with real-time validation
- **Repository Browser** - View all public repositories with metadata (stars, forks, language)
- **Commit Explorer** - Browse paginated commit history with sorting (newest/oldest)
- **Favourites System** - Save and manage favourite commits with localStorage persistence
- **Commit Details Modal** - View full commit details including file changes, diffs, and status
- **Performance Optimized** - Debounced search (300ms), throttled persistence (300ms), memoized sorting

### 📱 Progressive Web App Features
- **PWA Support** - Install as a native-like app on mobile and desktop devices
- **Offline Caching** - Service worker caches assets for offline functionality
- **Dark Mode** - System-aware theme with manual toggle (auto/light/dark)
- **Swipe Gestures** - Swipe down to close commit details modal on mobile
- **Pull-to-Refresh** - Natural pull-down gesture to refresh repos and commits
- **Fully Responsive** - Mobile-first design that works beautifully on phones, tablets, and desktops
- **Touch Optimized** - Enhanced touch targets and gesture support for mobile devices

### ♿ Accessibility
- **WCAG 2.1 Compliant** - Keyboard navigation and screen reader support
- **Semantic HTML** - Proper heading hierarchy and ARIA labels
- **Focus Management** - Visible focus indicators and logical tab order

### Project Structure

```
src/
├── api/              # GitHub API calls (fetch functions)
├── assets/styles/    # Global CSS and design tokens
├── components/       # Reusable Vue components
│   ├── commits/     # CommitList, CommitItem, CommitDetails, CommitToolbar
│   ├── favourites/  # FavouriteList
│   ├── repos/       # RepoList
│   ├── PullToRefresh.vue  # Pull-to-refresh indicator
│   └── ThemeToggle.vue    # Dark mode toggle
├── composables/      # Composition API logic
│   ├── useRepos.ts
│   ├── useCommits.ts
│   ├── useFavourites.ts
│   ├── useNavigation.ts
│   ├── useRouteParams.ts
│   ├── useScrollRestoration.ts
│   ├── useTheme.ts           # Theme management (light/dark/auto)
│   ├── useSwipe.ts           # Touch gesture detection
│   └── usePullToRefresh.ts   # Pull-to-refresh logic
├── router/          # Vue Router configuration
├── services/        # Business logic & data transformations
├── stores/          # Pinia state management (useGithubStore)
├── types/           # TypeScript interfaces (Repo, Commit, etc.)
├── utils/           # Utility functions (debounce, throttle, formatting)
└── views/           # Page-level components (HomeView, RepoView)
```

## 🏗 Architectural Approach

### Design Philosophy

This project follows **clean architecture** principles and **separation of concerns**:

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

- **Debouncing** - Search validation with configurable delay
- **Throttling** - localStorage writes prevent excessive I/O
- **Memoization** - Computed properties cache sorted/filtered data
- **Lazy Loading** - Pagination for commit lists
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

### Current Test Coverage

✅ **All tests passing**

- **Store tests** - fetchRepos, fetchCommits, fetchCommitDetail, toggleFavourite, localStorage persistence, sorting
- **Transform tests** - mapRepoResponse, mapCommitResponse, mapCommitDetailResponse
- **Composable tests** - useRepos, useCommits, useFavourites behaviour
- **UI Component tests** - CommitItem, CommitList, CommitDetails, CommitToolbar, RepoList, FavouriteList

### Testing Philosophy

- **Comprehensive UI tests** - All components tested for correct rendering and behaviour
- **Mock external dependencies** - API calls mocked with Vitest
- **Test behaviour, not implementation** - Focus on outcomes
- **Fast execution** - Optimised test suite for quick feedback

## 🛠 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vue 3** | ^3.5.0 | Reactive UI with Composition API |
| **TypeScript** | ^5.4.0 | Type-safe development |
| **Pinia** | ^2.1.7 | State management |
| **Vue Router** | ^4.6.3 | Client-side routing |
| **Vite** | ^5.0.0 | Dev server & build tool |
| **Vitest** | ^1.0.0 | Unit testing |
| **Bootstrap 5** | ^5.3.8 | UI components & utilities |

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
- Keep components focused and manageable
- Keep functions small and single-purpose

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Licence

MIT Licence - Free to use for learning and development

---

**Built with Vue 3, TypeScript, and Vite**
