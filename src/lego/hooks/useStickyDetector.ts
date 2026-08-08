import { useEffect, RefObject, useState } from 'react';

export const useStickyDetector = (ref: RefObject<HTMLElement>): boolean => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(entry.intersectionRatio < 1);
      },
      { threshold: [1] },
    );

    intersectionObserver.observe(element);

    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  return isSticky;
};
