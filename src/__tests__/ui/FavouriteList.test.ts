import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import FavouriteList from '@/components/favourites/FavouriteList.vue';
import type { FavouriteCommit } from '@/types/commit';

describe('FavouriteList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockFavourites: FavouriteCommit[] = [
    { sha: 'abc123', message: 'First favourite', repoName: 'repo1' },
    { sha: 'def456', message: 'Second favourite', repoName: 'repo2' }
  ];

  it('renders favourites count in header', () => {
    const wrapper = mount(FavouriteList, {
      props: {
        favourites: mockFavourites
      }
    });

    expect(wrapper.text()).toContain('2');
  });

  it('renders favourite items when expanded', async () => {
    const wrapper = mount(FavouriteList, {
      props: {
        favourites: mockFavourites
      }
    });

    const header = wrapper.find('.card-header');
    await header.trigger('click');

    expect(wrapper.text()).toContain('First favourite');
    expect(wrapper.text()).toContain('Second favourite');
  });

  it('toggles expanded state when header clicked', async () => {
    const wrapper = mount(FavouriteList, {
      props: {
        favourites: mockFavourites
      }
    });

    const header = wrapper.find('.card-header');
    
    expect(wrapper.text()).toContain('First favourite');

    await header.trigger('click');
    await wrapper.vm.$nextTick();
    
    expect(wrapper.text()).toContain('First favourite');
  });

  it('emits removeFavourite when remove button clicked', async () => {
    const wrapper = mount(FavouriteList, {
      props: {
        favourites: mockFavourites
      }
    });

    await wrapper.find('.card-header').trigger('click');
    
    const removeBtn = wrapper.findAll('.btn-sm.btn-outline-danger')[0];
    await removeBtn.trigger('click');

    expect(wrapper.emitted('removeFavourite')).toBeTruthy();
    expect(wrapper.emitted('removeFavourite')?.[0]).toEqual(['abc123']);
  });

  it('emits viewDetails when favourite item clicked', async () => {
    const wrapper = mount(FavouriteList, {
      props: {
        favourites: mockFavourites
      }
    });

    await wrapper.find('.card-header').trigger('click');
    
    const items = wrapper.findAll('.flex-grow-1');
    await items[0].trigger('click');

    expect(wrapper.emitted('viewDetails')).toBeTruthy();
    expect(wrapper.emitted('viewDetails')?.[0]).toEqual(['abc123', 'repo1']);
  });

  it('displays short SHA for each favourite', async () => {
    const wrapper = mount(FavouriteList, {
      props: {
        favourites: mockFavourites
      }
    });

    await wrapper.find('.card-header').trigger('click');

    expect(wrapper.text()).toContain('abc123');
  });

  it('displays repo name for each favourite', async () => {
    const wrapper = mount(FavouriteList, {
      props: {
        favourites: mockFavourites
      }
    });

    await wrapper.find('.card-header').trigger('click');

    expect(wrapper.text()).toContain('repo1');
    expect(wrapper.text()).toContain('repo2');
  });
});
