import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RepoList from '@/components/repos/RepoList.vue';
import type { Repo } from '@/types/repo';

describe('RepoList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockRepos: Repo[] = [
    {
      id: '1',
      name: 'awesome-project',
      description: 'An awesome project',
      stars: 100,
      forks: 20,
      language: 'TypeScript'
    },
    {
      id: '2',
      name: 'cool-library',
      description: 'A cool library',
      stars: 50,
      forks: 10,
      language: 'JavaScript'
    }
  ];

  it('renders repository cards', () => {
    const wrapper = mount(RepoList, {
      props: {
        repos: mockRepos
      }
    });

    expect(wrapper.text()).toContain('awesome-project');
    expect(wrapper.text()).toContain('cool-library');
  });

  it('displays repository metadata', () => {
    const wrapper = mount(RepoList, {
      props: {
        repos: mockRepos
      }
    });

    expect(wrapper.text()).toContain('An awesome project');
    expect(wrapper.text()).toContain('TypeScript');
    expect(wrapper.text()).toContain('100');
    expect(wrapper.text()).toContain('20');
  });

  it('emits select event when repository clicked', async () => {
    const wrapper = mount(RepoList, {
      props: {
        repos: mockRepos
      }
    });

    const firstCard = wrapper.findAll('.repo-card')[0];
    await firstCard.trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual(['1']);
  });

  it('renders correct number of cards', () => {
    const wrapper = mount(RepoList, {
      props: {
        repos: mockRepos
      }
    });

    const cards = wrapper.findAll('.repo-card');
    expect(cards).toHaveLength(2);
  });

  it('displays language badge when language is present', () => {
    const wrapper = mount(RepoList, {
      props: {
        repos: mockRepos
      }
    });

    const badges = wrapper.findAll('.badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('handles repos with no description', () => {
    const reposNoDesc: Repo[] = [
      {
        id: '3',
        name: 'test-repo',
        description: '',
        stars: 0,
        forks: 0,
        language: 'Python'
      }
    ];

    const wrapper = mount(RepoList, {
      props: {
        repos: reposNoDesc
      }
    });

    expect(wrapper.text()).toContain('test-repo');
  });
});
