"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  Users,
} from "lucide-react";
import { movieApi, getBackdropUrl, getPosterUrl } from "@/services/api";
import { MovieDetails } from "@/types/movie";
import { Loader2 } from "lucide-react";
import MovieImage from "@/components/MovieImage";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        setError(null);
        const movieData = await movieApi.getMovieDetails(Number(params.id));
        setMovie(movieData);
      } catch (err) {
        setError("Ошибка при загрузке информации о фильме");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "Не указано";
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return "Не указано";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ч ${mins}мин` : `${mins}мин`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка информации о фильме...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибка</h3>
            <p className="text-red-600 mb-4">{error || "Фильм не найден"}</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {movie.backdrop_path && (
        <div className="relative h-96 lg:h-[500px] overflow-hidden">
          <MovieImage
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => router.back()}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-80 flex-shrink-0">
              <div className="relative aspect-[2/3] lg:h-auto">
                <MovieImage
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
              </div>
            </div>

            <div className="p-6 lg:p-8 flex-1">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-lg text-gray-600 italic mb-4">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({movie.vote_count.toLocaleString("ru-RU")} оценок)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{formatDuration(movie.runtime)}</span>
                  </div>
                </div>

                {/* Genres */}
                {movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Overview */}
              {movie.overview && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Описание
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Информация
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Язык: {movie.original_language.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Статус: {movie.status}
                      </span>
                    </div>
                    {movie.homepage && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a
                          href={movie.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Официальный сайт
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Финансы
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Бюджет: {formatCurrency(movie.budget)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Сборы: {formatCurrency(movie.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Companies */}
              {movie.production_companies.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Производство
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_companies.map((company) => (
                      <span
                        key={company.id}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
