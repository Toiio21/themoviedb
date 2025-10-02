"use client";

import React, { useEffect } from "react";
import { useMovieContext } from "@/context/MovieContext";
import { movieApi } from "@/services/api";
import { Genre } from "@/types/movie";

export default function GenreFilter() {
  const { state, dispatch } = useMovieContext();

  useEffect(() => {
    if (state.genres.length === 0) {
      const loadGenres = async () => {
        try {
          const response = await movieApi.getGenres();
          dispatch({ type: "SET_GENRES", payload: response.genres });
        } catch (error) {
          console.error("Ошибка при загрузке жанров:", error);
        }
      };

      loadGenres();
    }
  }, [dispatch, state.genres.length]);

  const handleGenreSelect = async (genreId: number | null) => {
    if (state.loading) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SELECTED_GENRE", payload: genreId });
    dispatch({ type: "CLEAR_MOVIES" });

    try {
      let response;
      if (genreId) {
        response = await movieApi.getMoviesByGenre(genreId, 1);
      } else {
        response = await movieApi.getPopularMovies(1);
      }

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
        payload: "Ошибка при фильтрации по жанру.",
      });
    }
  };

  if (state.genres.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Фильтр по жанрам
        </h3>
        <div className="text-sm text-gray-500">Загрузка жанров...</div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Фильтр по жанрам
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleGenreSelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            state.selectedGenre === null
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Все жанры
        </button>
        {state.genres.map((genre: Genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreSelect(genre.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              state.selectedGenre === genre.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
