import React, { useEffect, useState } from 'react';

const images = [
  {
    src: 'src/assets/22.jpg',
    alt: 'Slide 1',
  },
  {
    src: 'src/assets/20.jpg',
    alt: 'Slide 2',
  },
  {
    src: 'src/assets/21.jpg',
    alt: 'Slide 3',
  },
  {
    src: 'src/assets/1.jpg',
    alt: 'Slide 4',
  },
  {
    src: 'src/assets/23.jpg',
    alt: 'Slide 5',
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3000);
    return () => clearInterval(interval);
  }, [length]);

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev - 1 + length) % length);
  const next = () => setCurrent((prev) => (prev + 1) % length);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-72 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden rounded-2xl shadow-2xl bg-gray-200 mt-8 mb-10 border border-gray-300 flex items-center justify-center">
      {/* Image Slides */}
      {images.map((img, idx) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out
            ${idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}
          `}
          style={{ pointerEvents: idx === current ? 'auto' : 'none', background: '#f8fafc' }}
        />
      ))}
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-20 pointer-events-none transition-all duration-1000" />
      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 text-2xl px-2 py-1 rounded-full shadow-lg transition z-30 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Previous slide"
        style={{ backdropFilter: 'blur(2px)' }}
      >
        &#8249;
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 text-2xl px-2 py-1 rounded-full shadow-lg transition z-30 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Next slide"
        style={{ backdropFilter: 'blur(2px)' }}
      >
        &#8250;
      </button>
      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full border-2 border-white bg-white/70 transition-all duration-300 shadow
              ${current === idx ? 'bg-blue-500 scale-125 shadow-lg' : 'bg-gray-400 opacity-60'}
            `}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;