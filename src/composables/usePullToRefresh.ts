import { ref, onMounted, onUnmounted, type Ref } from 'vue';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
}

export function usePullToRefresh(target: Ref<HTMLElement | null>, options: PullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    resistance = 2.5
  } = options;

  const isPulling = ref(false);
  const isRefreshing = ref(false);
  const pullDistance = ref(0);
  
  let touchStartY = 0;
  let touchCurrentY = 0;
  let scrollTop = 0;

  function handleTouchStart(event: TouchEvent) {
    if (isRefreshing.value) return;
    
    const element = target.value;
    if (!element) return;
    
    scrollTop = element.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
    
    // Only allow pull-to-refresh when at the top
    if (scrollTop <= 0) {
      touchStartY = event.touches[0].clientY;
      isPulling.value = true;
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isPulling.value || isRefreshing.value) return;
    
    touchCurrentY = event.touches[0].clientY;
    const delta = touchCurrentY - touchStartY;
    
    if (delta > 0) {
      // Apply resistance to make it feel natural
      pullDistance.value = Math.min(delta / resistance, threshold * 1.5);
      
      // Prevent default scroll only when pulling
      if (pullDistance.value > 5) {
        event.preventDefault();
      }
    }
  }

  async function handleTouchEnd() {
    if (!isPulling.value || isRefreshing.value) return;
    
    isPulling.value = false;
    
    if (pullDistance.value >= threshold) {
      isRefreshing.value = true;
      pullDistance.value = threshold;
      
      try {
        await onRefresh();
      } finally {
        setTimeout(() => {
          isRefreshing.value = false;
          pullDistance.value = 0;
        }, 300);
      }
    } else {
      pullDistance.value = 0;
    }
  }

  onMounted(() => {
    if (target.value) {
      target.value.addEventListener('touchstart', handleTouchStart, { passive: true });
      target.value.addEventListener('touchmove', handleTouchMove, { passive: false });
      target.value.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  });

  onUnmounted(() => {
    if (target.value) {
      target.value.removeEventListener('touchstart', handleTouchStart);
      target.value.removeEventListener('touchmove', handleTouchMove);
      target.value.removeEventListener('touchend', handleTouchEnd);
    }
  });

  return {
    isPulling,
    isRefreshing,
    pullDistance
  };
}
