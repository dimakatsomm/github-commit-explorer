import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CommitList from '@/components/commits/CommitList.vue';
import CommitItem from '@/components/commits/CommitItem.vue';
import type { CommitSummary } from '@/types/commit';

describe('CommitList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockCommits: CommitSummary[] = [
    {
      sha: 'abc123',
      authorName: 'Alice',
      date: '2025-01-15',
      message: 'First commit',
      repoName: 'repo1'
    },
    {
      sha: 'def456',
      authorName: 'Bob',
      date: '2025-01-16',
      message: 'Second commit',
      repoName: 'repo1'
    }
  ];

  const mockFavouriteChecker = (sha: string) => sha === 'abc123';

  it('renders loading spinner when loading', () => {
    const wrapper = mount(CommitList, {
      props: {
        commits: [],
        isLoading: true,
        favouriteChecker: mockFavouriteChecker
      }
    });

    expect(wrapper.find('.spinner-border').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading commits');
  });

  it('renders empty message when no commits', () => {
    const wrapper = mount(CommitList, {
      props: {
        commits: [],
        isLoading: false,
        favouriteChecker: mockFavouriteChecker
      }
    });

    expect(wrapper.text()).toContain('No Commits Found');
  });

  it('renders commit items for each commit', () => {
    const wrapper = mount(CommitList, {
      props: {
        commits: mockCommits,
        isLoading: false,
        favouriteChecker: mockFavouriteChecker
      }
    });

    const commitItems = wrapper.findAllComponents(CommitItem);
    expect(commitItems).toHaveLength(2);
  });

  it('passes correct props to CommitItem components', () => {
    const wrapper = mount(CommitList, {
      props: {
        commits: mockCommits,
        isLoading: false,
        favouriteChecker: mockFavouriteChecker
      }
    });

    const firstItem = wrapper.findAllComponents(CommitItem)[0];
    expect(firstItem.props('commit')).toEqual(mockCommits[0]);
    expect(firstItem.props('isFavourite')).toBe(true);
  });

  it('emits fetchDetail when CommitItem emits viewDetails', async () => {
    const wrapper = mount(CommitList, {
      props: {
        commits: mockCommits,
        isLoading: false,
        favouriteChecker: mockFavouriteChecker
      }
    });

    const firstItem = wrapper.findAllComponents(CommitItem)[0];
    await firstItem.vm.$emit('viewDetails', 'abc123');

    expect(wrapper.emitted('fetchDetail')).toBeTruthy();
    expect(wrapper.emitted('fetchDetail')?.[0]).toEqual(['abc123']);
  });

  it('emits toggleFavourite when CommitItem emits toggleFavourite', async () => {
    const wrapper = mount(CommitList, {
      props: {
        commits: mockCommits,
        isLoading: false,
        favouriteChecker: mockFavouriteChecker
      }
    });

    const firstItem = wrapper.findAllComponents(CommitItem)[0];
    await firstItem.vm.$emit('toggleFavourite', mockCommits[0]);

    expect(wrapper.emitted('toggleFavourite')).toBeTruthy();
    expect(wrapper.emitted('toggleFavourite')?.[0]).toEqual([mockCommits[0]]);
  });
});
