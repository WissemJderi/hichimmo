import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import "../../../css/embla.css";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
  rounded: boolean;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, rounded } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const roundedBorder = rounded ? "rounded-lg" : "";

  return (
    <section className="embla">
      <div
        className={`embla__viewport overflow-hidden ${roundedBorder}`}
        ref={emblaRef}
      >
        <div className="embla__container flex touch-pan-y">
          {slides.map((src, i) => (
            <div
              className="embla__slide flex-[0_0_100%] sm:flex-[0_0_100%] md:flex-[0_0_100%] relative"
              key={i}
            >
              <img
                className="w-full aspect-4/3 md:aspect-video object-fill shadow"
                src={src}
                alt={`slide-${i}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls flex justify-center mt-4 space-x-4">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </section>
  );
};

export default EmblaCarousel;
