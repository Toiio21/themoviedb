"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MovieImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function MovieImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
}: MovieImageProps) {
  const [imageSrc, setImageSrc] = useState("/placeholder-movie.svg");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src || src === "/placeholder-movie.svg") {
      setImageSrc("/placeholder-movie.svg");
      setIsLoading(false);
      return;
    }

    const testImage = new window.Image();
    const timeout = setTimeout(() => {
      setImageSrc("/placeholder-movie.svg");
      setIsLoading(false);
    }, 3000);

    testImage.onload = () => {
      clearTimeout(timeout);
      setImageSrc(src);
      setIsLoading(false);
    };

    testImage.onerror = () => {
      clearTimeout(timeout);
      setImageSrc("/placeholder-movie.svg");
      setIsLoading(false);
    };

    testImage.src = src;
  }, [src]);

  const imageProps = {
    src: imageSrc,
    alt,
    className,
    priority,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes }),
  };

  return <Image {...imageProps} />;
}
