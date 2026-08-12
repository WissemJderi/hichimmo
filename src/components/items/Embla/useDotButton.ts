import { useCallback, useRef, useSyncExternalStore } from "react";
import { EmblaCarouselType } from "embla-carousel";

const EMPTY_SNAPS: number[] = [];

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
  const snapListCache = useRef<number[] | null>(null);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("reInit", onStoreChange).on("select", onStoreChange);
      return () => {
        emblaApi.off("reInit", onStoreChange).off("select", onStoreChange);
      };
    },
    [emblaApi],
  );

  const selectedIndex = useSyncExternalStore(
    subscribe,
    useCallback(() => emblaApi?.selectedScrollSnap() ?? 0, [emblaApi]),
  );

  const scrollSnaps = useSyncExternalStore(
    subscribe,
    useCallback(() => {
      const snaps = emblaApi?.scrollSnapList();
      const cached = snapListCache.current;
      if (!snaps) return cached ?? EMPTY_SNAPS;
      if (cached && cached.length === snaps.length) return cached;
      snapListCache.current = snaps;
      return snaps;
    }, [emblaApi]),
  );

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};
