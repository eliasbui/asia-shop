"use client";

import Image from "next/image";
import { Button } from "./button";
import { Link } from "./link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface BannerSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: {
    text: string;
    href: string;
  };
  backgroundColor?: string;
}

interface HeroBannerProps {
  slides: BannerSlide[];
  autoPlayInterval?: number;
}

export function HeroBanner({
  slides,
  autoPlayInterval = 5000,
}: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundColor: slide.backgroundColor || "#f3f4f6" }}
        >
          <div className="container mx-auto h-full flex items-center">
            <div className="grid md:grid-cols-2 gap-8 items-center w-full px-4">
              {/* Content */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  {slide.description}
                </p>
                <Link href={slide.cta.href}>
                  <Button size="lg" className="mt-4">
                    {slide.cta.text}
                  </Button>
                </Link>
              </div>

              {/* Image */}
              <div className="relative h-[250px] md:h-[350px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-primary w-8"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
