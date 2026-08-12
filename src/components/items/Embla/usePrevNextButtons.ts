import { useCallback, useSyncExternalStore } from "react";
import { EmblaCarouselType } from "embla-carousel";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
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

  const prevBtnDisabled = useSyncExternalStore(
    subscribe,
    useCallback(() => !emblaApi?.canScrollPrev(), [emblaApi]),
  );

  const nextBtnDisabled = useSyncExternalStore(
    subscribe,
    useCallback(() => !emblaApi?.canScrollNext(), [emblaApi]),
  );

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};
