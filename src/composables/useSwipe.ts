import { ref, onMounted, onUnmounted, type Ref } from 'vue';

interface SwipeOptions {
  threshold?: number;
  timeout?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipe(target: Ref<HTMLElement | null>, options: SwipeOptions = {}) {
  const {
    threshold = 50,
    timeout = 500,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options;

  const touchStartX = ref(0);
  const touchStartY = ref(0);
  const touchEndX = ref(0);
  const touchEndY = ref(0);
  const touchStartTime = ref(0);

  function handleTouchStart(event: TouchEvent) {
    touchStartX.value = event.changedTouches[0].screenX;
    touchStartY.value = event.changedTouches[0].screenY;
    touchStartTime.value = Date.now();
  }

  function handleTouchEnd(event: TouchEvent) {
    touchEndX.value = event.changedTouches[0].screenX;
    touchEndY.value = event.changedTouches[0].screenY;
    
    const elapsedTime = Date.now() - touchStartTime.value;
    
    if (elapsedTime > timeout) return;
    
    handleSwipe();
  }

  function handleSwipe() {
    const deltaX = touchEndX.value - touchStartX.value;
    const deltaY = touchEndY.value - touchStartY.value;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Determine primary direction
    if (absX > absY && absX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absY > absX && absY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
  }

  onMounted(() => {
    if (target.value) {
      target.value.addEventListener('touchstart', handleTouchStart, { passive: true });
      target.value.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  });

  onUnmounted(() => {
    if (target.value) {
      target.value.removeEventListener('touchstart', handleTouchStart);
      target.value.removeEventListener('touchend', handleTouchEnd);
    }
  });

  return {
    touchStartX,
    touchStartY,
    touchEndX,
    touchEndY
  };
}
