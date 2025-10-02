"use client";

import React, { useState, useEffect } from "react";

interface MovieBackdropProps {
  backdropSrc: string;
  posterSrc: string;
  title: string;
  onBackClick: () => void;
}

export default function MovieBackdrop({
  backdropSrc,
  posterSrc,
  title,
  onBackClick,
}: MovieBackdropProps) {
  const getGradientColors = () => {
    const colors = [
      "from-purple-600 via-blue-600 to-indigo-600",
      "from-red-600 via-pink-600 to-rose-600",
      "from-green-600 via-teal-600 to-cyan-600",
      "from-yellow-600 via-orange-600 to-red-600",
      "from-indigo-600 via-purple-600 to-pink-600",
      "from-blue-600 via-indigo-600 to-purple-600",
      "from-emerald-600 via-teal-600 to-blue-600",
      "from-amber-600 via-orange-600 to-red-600",
    ];

    const hash = title.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const gradientClass = getGradientColors();
  const [showBackdropImage, setShowBackdropImage] = useState(false);

  useEffect(() => {
    if (backdropSrc && backdropSrc !== "/placeholder-movie.svg") {
      const testImage = new window.Image();
      testImage.onload = () => setShowBackdropImage(true);
      testImage.onerror = () => setShowBackdropImage(false);
      testImage.src = backdropSrc;
    }
  }, [backdropSrc]);

  return (
    <div className="relative h-96 lg:h-[500px] overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />

      {showBackdropImage && (
        <img
          src={backdropSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/5 to-black/30" />

      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onBackClick}
          className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 border border-white/20"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
