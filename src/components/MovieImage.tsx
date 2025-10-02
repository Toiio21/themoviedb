"use client";

import React, { useState } from "react";
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
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc("/placeholder-movie.svg");
    }
  };

  const imageProps = {
    src: imageSrc,
    alt,
    onError: handleError,
    className,
    priority,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes }),
  };

  return <Image {...imageProps} />;
}
