import { useRef, useEffect } from "react";

export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  apiDataTotal: any,
  totalElements: any
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback);
    if (observer && ref.current) {
      observer.observe(ref.current);
    }
    if (ref.current !== null) {
      if (apiDataTotal > 0) {
        console.log(apiDataTotal);
        if (apiDataTotal >= totalElements) {
          observer.unobserve(ref.current);
        }
      }
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [callback]);

  return ref;
};
