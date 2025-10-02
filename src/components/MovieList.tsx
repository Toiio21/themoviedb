"use client";

import React, { useEffect, useCallback } from "react";
import { useMovieContext } from "@/context/MovieContext";
import { movieApi } from "@/services/api";
import MovieCard from "./MovieCard";
import { Loader2 } from "lucide-react";

export default function MovieList() {
  const { state, dispatch } = useMovieContext();

  useEffect(() => {
    const loadPopularMovies = async () => {
      if (state.movies.length === 0 && !state.loading) {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
          const response = await movieApi.getPopularMovies(1);
          dispatch({
            type: "SET_MOVIES",
            payload: {
              movies: response.results,
              page: response.page,
              totalPages: response.total_pages,
              totalResults: response.total_results,
            },
          });
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            payload: "Ошибка при загрузке фильмов.",
          });
        }
      }
    };

    loadPopularMovies();
  }, [dispatch, state.movies.length, state.loading]);

  const loadMoreMovies = useCallback(async () => {
    if (state.loading || state.currentPage >= state.totalPages) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      let response;
      const nextPage = state.currentPage + 1;

      if (state.searchQuery) {
        response = await movieApi.searchMovies(state.searchQuery, nextPage);
      } else if (state.selectedGenre) {
        response = await movieApi.getMoviesByGenre(
          state.selectedGenre,
          nextPage
        );
      } else {
        response = await movieApi.getPopularMovies(nextPage);
      }

      if (response.results.length > 0) {
        dispatch({
          type: "APPEND_MOVIES",
          payload: response.results,
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Ошибка при загрузке дополнительных фильмов.",
      });
    }
  }, [state, dispatch]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      loadMoreMovies();
    }
  }, [loadMoreMovies]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (state.error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибка</h3>
          <p className="text-red-600">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (state.movies.length === 0 && !state.loading) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Фильмы не найдены
          </h3>
          <p className="text-gray-600">
            {state.searchQuery
              ? `По запросу "${state.searchQuery}" ничего не найдено.`
              : "Попробуйте изменить критерии поиска."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {state.searchQuery
            ? `Результаты поиска: "${state.searchQuery}"`
            : state.selectedGenre
            ? state.genres.find((g) => g.id === state.selectedGenre)?.name ||
              "Фильмы"
            : "Популярные фильмы"}
        </h2>
        <span className="text-sm text-gray-600">
          Показано: {state.movies.length} из {state.totalResults}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.movies.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </div>

      {state.loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {state.currentPage < state.totalPages && !state.loading && (
        <div className="text-center py-4">
          <button
            onClick={loadMoreMovies}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  );
}
