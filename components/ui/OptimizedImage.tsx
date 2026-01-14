"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useInViewport } from "@/hooks/useOptimizedScroll";

/**
 * Optimized Image component with:
 * - Blur placeholder
 * - Lazy loading with intersection observer
 * - Error fallback
 * - Responsive sizing
 */

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  showSkeleton?: boolean;
  wrapperClassName?: string;
}

// Default blur placeholder (1x1 gray pixel)
const DEFAULT_BLUR_DATA_URL = 
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEQD8AVQB//9k=";

// Aspect ratio classes
const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  auto: "",
};

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder.jpg",
  aspectRatio = "auto",
  showSkeleton = true,
  wrapperClassName,
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: "200px", triggerOnce: true });
  
  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  const handleError = useCallback(() => {
    setError(true);
    setIsLoading(false);
  }, []);
  
  // Only load when in view (unless priority)
  const shouldLoad = priority || inView;
  
  return (
    <div 
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        aspectRatioClasses[aspectRatio],
        wrapperClassName
      )}
    >
      {/* Skeleton loader */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {shouldLoad && (
        <Image
          src={error ? fallbackSrc : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          placeholder="blur"
          blurDataURL={DEFAULT_BLUR_DATA_URL}
          priority={priority}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * Responsive Image component with automatic srcset generation
 */
interface ResponsiveImageProps extends OptimizedImageProps {
  sizes?: string;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveImage({
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  breakpoints,
  ...props
}: ResponsiveImageProps) {
  // Calculate sizes string from breakpoints if provided
  const calculatedSizes = breakpoints
    ? Object.entries(breakpoints)
        .map(([key, value]) => {
          const breakpointPx = {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
          }[key];
          return breakpointPx ? `(max-width: ${breakpointPx}px) ${value}vw` : "";
        })
        .filter(Boolean)
        .join(", ") + ", 33vw"
    : sizes;
  
  return <OptimizedImage sizes={calculatedSizes} {...props} />;
}

/**
 * Avatar Image with optimized loading and fallback
 */
interface AvatarImageProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackInitials?: string;
}

const avatarSizes = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-12 h-12", text: "text-base" },
  xl: { container: "w-16 h-16", text: "text-lg" },
};

export function AvatarImage({
  src,
  alt,
  size = "md",
  className,
  fallbackInitials,
}: AvatarImageProps) {
  const [error, setError] = useState(false);
  const sizeClasses = avatarSizes[size];
  
  // Generate initials from alt text
  const initials = fallbackInitials || 
    alt
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  
  if (!src || error) {
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-forest to-forest-light flex items-center justify-center text-white font-medium",
          sizeClasses.container,
          sizeClasses.text,
          className
        )}
      >
        {initials}
      </div>
    );
  }
  
  return (
    <div className={cn("relative rounded-full overflow-hidden", sizeClasses.container, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes={`${parseInt(sizeClasses.container.split("-")[1]) * 4}px`}
      />
    </div>
  );
}

/**
 * Background Image component with gradient overlay option
 */
interface BackgroundImageProps {
  src: string;
  alt: string;
  children?: React.ReactNode;
  overlay?: "none" | "light" | "dark" | "gradient";
  className?: string;
  priority?: boolean;
}

const overlayClasses = {
  none: "",
  light: "bg-white/50",
  dark: "bg-black/50",
  gradient: "bg-gradient-to-t from-black/70 via-transparent to-transparent",
};

export function BackgroundImage({
  src,
  alt,
  children,
  overlay = "dark",
  className,
  priority = false,
}: BackgroundImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        placeholder="blur"
        blurDataURL={DEFAULT_BLUR_DATA_URL}
      />
      {overlay !== "none" && (
        <div className={cn("absolute inset-0", overlayClasses[overlay])} />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

/**
 * Gallery Image with lightbox support
 */
interface GalleryImageProps {
  src: string;
  alt: string;
  thumbnailSrc?: string;
  onClick?: () => void;
  className?: string;
}

export function GalleryImage({
  src,
  alt,
  thumbnailSrc,
  onClick,
  className,
}: GalleryImageProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-lg group focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
        className
      )}
    >
      <OptimizedImage
        src={thumbnailSrc || src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        aspectRatio="square"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
          View
        </span>
      </div>
    </button>
  );
}
