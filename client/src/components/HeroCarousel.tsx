import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Ship,
  Anchor,
  Truck,
  Check,
  Globe,
  Award,
} from "lucide-react";
import SimpleVideoBackground from "./SimpleVideoBackground";
import { carouselVideos } from "../assets/videos";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
  icon: React.ComponentType<any>;
  stats?: { value: string; label: string }[];
}

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const autoAdvanceRef = useRef<number | null>(null);
  const slideStartRef = useRef<number>(0);
  const prefersReducedMotionRef = useRef<boolean>(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const isHeroVisibleRef = useRef<boolean>(true);

  const TARGET_SLIDE_DURATION_MS = 5000;

  const slides: Slide[] = [
    {
      id: 1,
      title: "Navigating Global Trade with You",
      subtitle: "Your Gateway to Global Success",
      description:
        "Connecting continents with reliable and efficient maritime solutions. Experience seamless global trade with our comprehensive services.",
      image: "",
      cta: "Get Quote",
      ctaLink: "/quote",
      icon: Globe,
      stats: [
        { value: "24/7", label: "Support" },
        { value: "Global", label: "Network" },
        { value: "99.9%", label: "Reliability" },
      ],
    },
    {
      id: 2,
      title: "Innovative Logistics Solutions",
      subtitle: "Beyond Boundaries",
      description:
        "Cutting-edge logistics built to meet the demands of modern global trade. Fast, secure and efficient delivery",
      image: "",
      cta: "Vessel Schedule",
      ctaLink: "/schedule",
      icon: Truck,
      stats: [
        { value: "Fast", label: "Delivery" },
        { value: "Secure", label: "Handling" },
        { value: "Eco", label: "Friendly" },
      ],
    },
    {
      id: 3,
      title: "Decades of Excellence",
      subtitle: "Where Every Mile Builds Trust",
      description:
        "With 70+ years of expertise in the maritime industry, we continue to set the standard for quality, performance, and customer care.",
      image: "",
      cta: "About Us",
      ctaLink: "/about",
      icon: Award,
      stats: [
        { value: "70+", label: "Years" },
        { value: "500+", label: "Partners" },
        { value: "100%", label: "Commitment" },
      ],
    },
  ];

  // Detect prefers-reduced-motion once on mount
  useEffect(() => {
    let removeMotionListener: (() => void) | null = null;
    if (typeof window !== "undefined" && "matchMedia" in window) {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotionRef.current = mql.matches;
      const onChange = (e: MediaQueryListEvent) => {
        prefersReducedMotionRef.current = e.matches;
      };
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", onChange);
        removeMotionListener = () =>
          mql.removeEventListener("change", onChange);
      }
    }

    // Intersection observer to pause when hero isn't visible
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const visible = !!entry?.isIntersecting;
          isHeroVisibleRef.current = visible;
          if (!visible) {
            // pause
            if (autoAdvanceRef.current !== null) {
              window.clearTimeout(autoAdvanceRef.current);
              autoAdvanceRef.current = null;
            }
          }
        },
        { root: null, threshold: 0.5 }
      );
      if (heroRef.current) observer.observe(heroRef.current);
    }

    return () => {
      if (removeMotionListener) removeMotionListener();
      if (observer && heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  const clearAutoAdvance = () => {
    if (autoAdvanceRef.current !== null) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  };

  const scheduleAdvanceAfterRemaining = () => {
    if (!isHeroVisibleRef.current) return; // don't schedule when not visible
    const now = performance.now();
    const elapsed = now - slideStartRef.current;
    const baseTarget = TARGET_SLIDE_DURATION_MS;
    const totalTarget = prefersReducedMotionRef.current
      ? Math.min(baseTarget, 2500)
      : baseTarget;
    const remaining = Math.max(0, totalTarget - elapsed);
    clearAutoAdvance();
    autoAdvanceRef.current = window.setTimeout(() => {
      setSlideDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, remaining);
  };

  // When slide index changes, reset timers and mark the start time
  useEffect(() => {
    clearAutoAdvance();
    slideStartRef.current = performance.now();
    return () => {
      clearAutoAdvance();
    };
  }, [currentSlide]);

  const nextSlide = () => {
    clearAutoAdvance();
    setSlideDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    clearAutoAdvance();
    setSlideDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    clearAutoAdvance();
    setSlideDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  if (!slides || slides.length === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        No slides available
      </div>
    );

  const safeCurrentSlideIndex = Math.min(
    Math.max(0, currentSlide),
    slides.length - 1
  );
  const currentSlideData: Slide = slides[safeCurrentSlideIndex]!;

  // Removed unused AnimatedPopup component

  // Floating elements animation
  const FloatingElement = ({
    delay,
    children,
    className = "",
  }: {
    delay: number;
    children: React.ReactNode;
    className?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, x: (Math.random() - 0.5) * 100 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [20, 0, 0, -20],
        x: [0, (Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 40],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
      className={`absolute ${className} pointer-events-none`}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative w-screen h-screen -mt-16 overflow-hidden left-1/2 -translate-x-1/2">
      {/* Floating elements */}
      <FloatingElement delay={0} className="top-1/4 left-1/4">
        <Ship className="w-12 h-12 text-yellow-400/30" />
      </FloatingElement>
      <FloatingElement delay={2} className="top-1/3 right-1/4">
        <Globe className="w-10 h-10 text-white/20" />
      </FloatingElement>
      <FloatingElement delay={4} className="bottom-1/4 left-1/3">
        <Anchor className="w-8 h-8 text-yellow-400/20" />
      </FloatingElement>
      <FloatingElement delay={6} className="top-1/2 right-1/3">
        <Truck className="w-16 h-16 text-white/15" />
      </FloatingElement>

      <div className="absolute inset-0 w-screen h-full">
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={currentSlide}
            className="absolute inset-0 w-screen h-full"
            custom={slideDirection}
            initial="enter"
            animate="center"
            exit="exit"
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? "100%" : "-100%",
                opacity: 0.5,
              }),
              center: {
                x: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeInOut" },
              },
              exit: (direction: number) => ({
                x: direction > 0 ? "-100%" : "100%",
                opacity: 0.5,
                transition: { duration: 0.8, ease: "easeInOut" },
              }),
            }}
          >
            {/* Media Background */}
            <div className="absolute inset-0 z-0">
              {carouselVideos[safeCurrentSlideIndex]?.type === "video" ? (
                <SimpleVideoBackground
                  videoSrc={
                    carouselVideos[safeCurrentSlideIndex]?.video ??
                    carouselVideos[0]?.video ??
                    ""
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={carouselVideos[safeCurrentSlideIndex]?.image}
                  alt={carouselVideos[safeCurrentSlideIndex]?.description}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full w-full flex items-center justify-center">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${currentSlide}`}
                      className={`px-4 sm:px-0 relative z-10 ${
                        currentSlide === 0
                          ? "text-video-dark"
                          : currentSlide === 1
                          ? "text-video-mixed"
                          : "text-video-light"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.5 },
                      }}
                      exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    >
                      {/* Subtitle - Appears FIRST with slide-in from left and fade */}
                      <motion.div
                        className={`inline-flex items-center mb-6 px-6 py-2 rounded-full font-medium text-sm md:text-base shadow-md ${
                          currentSlide === 0
                            ? "bg-white/90 text-video-dark-subtitle border border-white/30"
                            : currentSlide === 1
                            ? "bg-blue-900/90 text-video-mixed-subtitle border border-blue-300/30"
                            : "bg-white/95 text-video-light-subtitle border border-white/30"
                        }`}
                        initial={{
                          opacity: 0,
                          x: prefersReducedMotionRef.current ? 0 : -60,
                          scale: prefersReducedMotionRef.current ? 1 : 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          transition: {
                            delay: prefersReducedMotionRef.current ? 0 : 0.3,
                            duration: prefersReducedMotionRef.current
                              ? 0.2
                              : 0.7,
                            ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
                          },
                        }}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {currentSlideData.subtitle}
                      </motion.div>

                      {/* Title - Appears SECOND with slide-up and scale */}
                      <motion.h1
                        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight ${
                          currentSlide === 0
                            ? "text-video-dark-text"
                            : currentSlide === 1
                            ? "text-video-mixed-text"
                            : "text-video-light-text"
                        }`}
                        style={{
                          textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                        }}
                        initial={{
                          opacity: 0,
                          y: prefersReducedMotionRef.current ? 0 : 40,
                          scale: prefersReducedMotionRef.current ? 1 : 0.95,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            delay: prefersReducedMotionRef.current ? 0 : 0.6,
                            duration: prefersReducedMotionRef.current
                              ? 0.25
                              : 0.8,
                            ease: [0.16, 1, 0.3, 1], // easeOutExpo
                          },
                        }}
                      >
                        {currentSlideData.title}
                      </motion.h1>

                      {/* Description - Appears THIRD with fade and slide-up */}
                      <motion.p
                        className={`text-lg md:text-xl mb-8 max-w-2xl ${
                          currentSlide === 0
                            ? "text-video-dark-description"
                            : currentSlide === 1
                            ? "text-video-mixed-description"
                            : "text-video-light-description"
                        }`}
                        initial={{
                          opacity: 0,
                          y: prefersReducedMotionRef.current ? 0 : 30,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: prefersReducedMotionRef.current ? 0 : 1.1,
                            duration: prefersReducedMotionRef.current
                              ? 0.2
                              : 0.7,
                            ease: [0.33, 1, 0.68, 1], // easeOutCubic
                          },
                        }}
                      >
                        {currentSlideData.description}
                      </motion.p>

                      {/* Buttons - Appear FOURTH with staggered entrance */}
                      <motion.div
                        className="flex flex-wrap gap-4"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: {
                            delay: prefersReducedMotionRef.current ? 0 : 1.5,
                            duration: 0.3,
                          },
                        }}
                        onAnimationComplete={() => {
                          // Schedule auto-advance only after CTA wrapper fully shown
                          scheduleAdvanceAfterRemaining();
                        }}
                      >
                        <motion.a
                          href={currentSlideData.ctaLink}
                          className={`px-8 py-4 font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                            currentSlide === 0
                              ? "bg-video-dark-cta hover:bg-opacity-90 text-video-dark-ctaText"
                              : currentSlide === 1
                              ? "bg-video-mixed-cta hover:bg-opacity-90 text-video-mixed-ctaText"
                              : "bg-video-light-cta hover:bg-opacity-90 text-video-light-ctaText"
                          }`}
                          initial={{
                            opacity: 0,
                            y: prefersReducedMotionRef.current ? 0 : 20,
                            scale: prefersReducedMotionRef.current ? 1 : 0.9,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              delay: prefersReducedMotionRef.current ? 0 : 1.7,
                              duration: 0.5,
                              ease: [0.34, 1.56, 0.64, 1], // easeOutBack
                            },
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {currentSlideData.cta}
                          <ChevronRight className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                          href="/contact"
                          className={`px-6 py-3.5 border-2 font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                            currentSlide === 0
                              ? "border-video-dark-text text-video-dark-text hover:bg-video-dark-cta/10"
                              : currentSlide === 1
                              ? "border-video-mixed-text text-video-mixed-text hover:bg-video-mixed-cta/10"
                              : "border-video-light-text text-video-light-text hover:bg-video-light-cta/10"
                          }`}
                          initial={{
                            opacity: 0,
                            y: prefersReducedMotionRef.current ? 0 : 20,
                            scale: prefersReducedMotionRef.current ? 1 : 0.9,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              delay: prefersReducedMotionRef.current ? 0 : 1.9,
                              duration: 0.5,
                              ease: [0.34, 1.56, 0.64, 1], // easeOutBack
                            },
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Contact Us
                        </motion.a>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-20 backdrop-blur-sm p-3 rounded-full transition-all duration-300 group border ${
          currentSlide === 0
            ? "bg-blue-800/80 hover:bg-blue-700/90 text-blue-100 border-blue-600/50 hover:border-blue-400/80"
            : currentSlide === 1
            ? "bg-teal-600/80 hover:bg-teal-700/90 text-teal-100 border-teal-500/50 hover:border-teal-400/80"
            : "bg-red-700/80 hover:bg-red-800/90 text-red-100 border-red-600/50 hover:border-red-400/80"
        }`}
        aria-label="Previous slide"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-20 backdrop-blur-sm p-3 rounded-full transition-all duration-300 group border shadow-lg ${
          currentSlide === 0
            ? "bg-blue-800/90 hover:bg-blue-700/95 text-blue-50 border-blue-500/60 hover:border-blue-300/80"
            : currentSlide === 1
            ? "bg-teal-600/90 hover:bg-teal-700/95 text-teal-50 border-teal-500/60 hover:border-teal-300/80"
            : "bg-red-700/90 hover:bg-red-800/95 text-red-50 border-red-500/60 hover:border-red-300/80"
        }`}
        aria-label="Next slide"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Slide Indicators */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
      >
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === safeCurrentSlideIndex
                ? "bg-yellow-400 scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Scroll Down Indicator */}
      {/* <motion.div
        className="absolute bottom-8 right-8 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 1 }
        }}
      >
        <motion.div
          className="flex flex-col items-center group cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-sm mb-2 text-white/80 group-hover:text-yellow-400 transition-colors">
            Scroll Down
          </span>
          <div className="w-6 h-10 border-2 border-white/50 group-hover:border-yellow-400 rounded-full flex justify-center transition-all duration-300">
            <motion.div
              className="w-1 h-3 bg-yellow-400 rounded-full mt-2 group-hover:bg-white"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div> */}
    </div>
  );
};

export default HeroCarousel;
