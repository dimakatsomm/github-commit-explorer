import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CommitItem from '@/components/commits/CommitItem.vue';
import type { CommitSummary } from '@/types/commit';

describe('CommitItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockCommit: CommitSummary = {
    sha: 'abc123def456',
    authorName: 'John Doe',
    date: '2025-01-15',
    message: 'Add new feature',
    repoName: 'test-repo'
  };

  it('renders commit information correctly', () => {
    const wrapper = mount(CommitItem, {
      props: {
        commit: mockCommit,
        isFavourite: false
      }
    });

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Add new feature');
    expect(wrapper.text()).toContain('abc123d');
  });

  it('displays favourite icon when commit is favourited', () => {
    const wrapper = mount(CommitItem, {
      props: {
        commit: mockCommit,
        isFavourite: true
      }
    });

    const favouriteBtn = wrapper.find('.btn-warning');
    expect(favouriteBtn.exists()).toBe(true);
  });

  it('displays unfavourite icon when commit is not favourited', () => {
    const wrapper = mount(CommitItem, {
      props: {
        commit: mockCommit,
        isFavourite: false
      }
    });

    const favouriteBtn = wrapper.find('.btn-outline-secondary');
    expect(favouriteBtn.exists()).toBe(true);
  });

  it('emits toggleFavourite event when favourite button clicked', async () => {
    const wrapper = mount(CommitItem, {
      props: {
        commit: mockCommit,
        isFavourite: false
      }
    });

    await wrapper.find('.btn-outline-secondary').trigger('click');

    expect(wrapper.emitted('toggleFavourite')).toBeTruthy();
    expect(wrapper.emitted('toggleFavourite')?.[0]).toEqual([mockCommit]);
  });

  it('emits viewDetails event when details button clicked', async () => {
    const wrapper = mount(CommitItem, {
      props: {
        commit: mockCommit,
        isFavourite: false
      }
    });

    await wrapper.find('.btn-outline-primary').trigger('click');

    expect(wrapper.emitted('viewDetails')).toBeTruthy();
    expect(wrapper.emitted('viewDetails')?.[0]).toEqual(['abc123def456']);
  });

  it('displays short SHA (first 7 characters)', () => {
    const wrapper = mount(CommitItem, {
      props: {
        commit: mockCommit,
        isFavourite: false
      }
    });

    const shaElement = wrapper.find('.commit-sha');
    expect(shaElement.text()).toBe('abc123d');
  });
});
