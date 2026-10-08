import { EmblaOptionsType } from "embla-carousel";
import { DotButton } from "./EmblaCarouselDotButton";
import { useDotButton } from "./useDotButton";
import useEmblaCarousel from "embla-carousel-react";
import "../../../css/embla.css";
import { optimizeImageUrl } from "../../../utils";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
  rounded: boolean;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, rounded } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const roundedBorder = rounded ? "rounded-lg" : "";

  return (
    <section className="embla relative">
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
                className="w-full aspect-4/3 md:aspect-video object-cover shadow transition duration-500 group-hover:scale-105"
                src={optimizeImageUrl(src, {
                  width: 800,
                  height: 600,
                })}
                alt={`slide-${i}`}
                width={800}
                height={600}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                decoding="async"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              type="button"
              aria-label={`Afficher la photo ${index + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition ${
                index === selectedIndex ? "bg-white" : "bg-white/45"
              }`}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default EmblaCarousel;
