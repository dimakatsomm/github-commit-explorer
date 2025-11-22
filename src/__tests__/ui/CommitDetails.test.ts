import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CommitDetails from '@/components/commits/CommitDetails.vue';
import type { CommitDetail } from '@/types/commit';

describe('CommitDetails', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    setActivePinia(createPinia());
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const mockDetail: CommitDetail = {
    sha: 'abc123def456789',
    repoName: 'test-repo',
    authorName: 'Jane Doe',
    date: '2025-01-20',
    message: 'Implement new feature\n\nDetailed description here',
    files: [
      {
        filename: 'src/main.ts',
        additions: 10,
        deletions: 2,
        changes: 12,
        status: 'modified'
      },
      {
        filename: 'src/utils.ts',
        additions: 5,
        deletions: 0,
        changes: 5,
        status: 'added'
      }
    ]
  };

  it('does not render when show is false', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: false
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    expect(document.querySelector('.modal-backdrop')).toBeNull();
    wrapper.unmount();
  });

  it('renders modal when show is true', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    expect(document.querySelector('.modal-backdrop')).toBeTruthy();
    wrapper.unmount();
  });

  it('displays commit information', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    const modalText = document.body.textContent || '';
    expect(modalText).toContain('abc123d');
    expect(modalText).toContain('Jane Doe');
    expect(modalText).toContain('Implement new feature');
    wrapper.unmount();
  });

  it('displays files changed count', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    expect(document.body.textContent).toContain('Files Changed (2)');
    wrapper.unmount();
  });

  it('renders file information in table', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    const text = document.body.textContent || '';
    expect(text).toContain('src/main.ts');
    expect(text).toContain('src/utils.ts');
    expect(text).toContain('10');
    expect(text).toContain('2');
    wrapper.unmount();
  });

  it('displays correct status badges', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    const badges = document.querySelectorAll('.badge');
    expect(badges.length).toBeGreaterThan(0);
    const text = document.body.textContent || '';
    expect(text).toContain('modified');
    expect(text).toContain('added');
    wrapper.unmount();
  });

  it('emits close event when close button clicked', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    const closeBtn = document.querySelector('.btn-close') as HTMLElement;
    closeBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });

  it('emits close event when backdrop clicked', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
    backdrop?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });

  it('emits close event when footer close button clicked', async () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: container
    });

    await wrapper.vm.$nextTick();
    const footerBtn = document.querySelector('.modal-footer .btn-secondary') as HTMLElement;
    footerBtn?.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });

  it('handles escape key press', () => {
    const wrapper = mount(CommitDetails, {
      props: {
        detail: mockDetail,
        show: true
      },
      attachTo: document.body
    });

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(wrapper.emitted('close')).toBeTruthy();
    
    wrapper.unmount();
  });
});
