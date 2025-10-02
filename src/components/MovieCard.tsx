"use client";

import React from "react";
import Link from "next/link";
import { Star, Calendar, Eye } from "lucide-react";
import { Movie } from "@/types/movie";
import { getPosterUrl } from "@/services/api";
import MovieImage from "./MovieImage";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <Link href={`/movie/${movie.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        <div className="relative aspect-[2/3] overflow-hidden">
          <MovieImage
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {formatRating(movie.vote_average)}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(movie.release_date)}</span>
          </div>

          {movie.overview && (
            <p className="text-gray-700 text-sm line-clamp-3 mb-3">
              {movie.overview}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{movie.vote_count}</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {movie.original_language.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
