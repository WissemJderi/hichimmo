import { EmblaOptionsType } from "embla-carousel";
import { DotButton } from "./EmblaCarouselDotButton";
import { useDotButton } from "./useDotButton";
import useEmblaCarousel from "embla-carousel-react";
import "../../../css/embla.css";
import { optimizeImageUrl } from "../../../utils";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
  rounded?: boolean;
  withPhotoOverlay?: boolean;
  showThumbnails?: boolean;
  showCounter?: boolean;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const {
    slides,
    options,
    rounded = true,
    withPhotoOverlay = false,
    showThumbnails = false,
    showCounter = false,
  } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const roundedBorder = rounded ? "rounded-lg" : "";

  return (
    <section className="embla relative">
      {slides.length === 0 && (
        <div className="relative aspect-4/3 md:aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Aucune photo disponible</p>
        </div>
      )}

      {slides.length > 0 && (
        <>
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

          {withPhotoOverlay && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          )}

          {showCounter && (
            <span className="absolute bottom-4 right-4 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {selectedIndex + 1} / {slides.length}
            </span>
          )}

          {slides.length > 1 && !showThumbnails && !showCounter && (
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
          )}

          {showThumbnails && slides.length > 1 && (
            <div className="no-scrollbar mt-3 mb-4 ml-1 flex gap-2.5 overflow-x-auto pb-1">
              {slides.map((src, index) => {
                const isActive = index === selectedIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Afficher la photo ${index + 1}`}
                    aria-current={isActive}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`group relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-primary shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={optimizeImageUrl(src, { width: 240, height: 160 })}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};
export default EmblaCarousel;
