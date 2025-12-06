// EmblaCarousel.tsx
import useEmblaCarousel from "embla-carousel-react";

const EmblaCarousel = ({ slides }: { slides: string[] }) => {
  // Initialize the carousel hook with options, e.g., loop: true
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    // Assign the ref to the main viewport container
    <div className="embla" ref={emblaRef}>
      {/* The container for all slides, stacked horizontally via CSS */}
      <div className="embla__container">
        {slides.map((image, index) => (
          // Individual slide item
          <div className="embla__slide" key={index}>
            <img
              className="embla__slide__img"
              src={image}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmblaCarousel;
