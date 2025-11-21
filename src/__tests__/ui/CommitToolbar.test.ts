import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CommitToolbar from '@/components/commits/CommitToolbar.vue';

describe('CommitToolbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders sort dropdown with correct options', () => {
    const wrapper = mount(CommitToolbar, {
      props: {
        sortOrder: 'newest'
      }
    });

    const select = wrapper.find('select');
    const options = select.findAll('option');

    expect(options).toHaveLength(2);
    expect(options[0].text()).toBe('Newest First');
    expect(options[0].element.value).toBe('newest');
    expect(options[1].text()).toBe('Oldest First');
    expect(options[1].element.value).toBe('oldest');
  });

  it('displays current sort order', () => {
    const wrapper = mount(CommitToolbar, {
      props: {
        sortOrder: 'oldest'
      }
    });

    const select = wrapper.find('select');
    expect(select.element.value).toBe('oldest');
  });

  it('emits changeSort event when selection changes', async () => {
    const wrapper = mount(CommitToolbar, {
      props: {
        sortOrder: 'newest'
      }
    });

    const select = wrapper.find('select');
    await select.setValue('oldest');

    expect(wrapper.emitted('changeSort')).toBeTruthy();
    expect(wrapper.emitted('changeSort')?.[0]).toEqual(['oldest']);
  });

  it('emits loadMore event when button clicked', async () => {
    const wrapper = mount(CommitToolbar, {
      props: {
        sortOrder: 'newest'
      }
    });

    const loadMoreBtn = wrapper.find('.btn-outline-primary');
    await loadMoreBtn.trigger('click');

    expect(wrapper.emitted('loadMore')).toBeTruthy();
  });

  it('renders load more button with correct text', () => {
    const wrapper = mount(CommitToolbar, {
      props: {
        sortOrder: 'newest'
      }
    });

    const loadMoreBtn = wrapper.find('.btn-outline-primary');
    expect(loadMoreBtn.text()).toContain('Load More');
  });

  it('updates local order when prop changes', async () => {
    const wrapper = mount(CommitToolbar, {
      props: {
        sortOrder: 'newest'
      }
    });

    await wrapper.setProps({ sortOrder: 'oldest' });

    const select = wrapper.find('select');
    expect(select.element.value).toBe('oldest');
  });
});
