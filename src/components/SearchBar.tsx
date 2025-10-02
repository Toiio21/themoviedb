"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useMovieContext } from "@/context/MovieContext";
import { movieApi } from "@/services/api";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { state, dispatch } = useMovieContext();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSearching || state.loading) {
      return;
    }

    if (!searchQuery.trim()) {
      await loadPopularMovies();
      return;
    }

    setIsSearching(true);
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SEARCH_QUERY", payload: searchQuery });
    dispatch({ type: "CLEAR_MOVIES" });

    try {
      const response = await movieApi.searchMovies(searchQuery, 1);
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
        payload: "Ошибка при поиске фильмов. Попробуйте еще раз.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const loadPopularMovies = async () => {
    if (isSearching || state.loading) {
      return;
    }

    setIsSearching(true);
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
    dispatch({ type: "CLEAR_MOVIES" });

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
        payload: "Ошибка при загрузке популярных фильмов.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    loadPopularMovies();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск фильмов..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching || state.loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching || state.loading ? "Поиск..." : "Найти"}
        </button>
      </form>

      {state.searchQuery && (
        <div className="mt-2 text-sm text-gray-600">
          Найдено фильмов: {state.totalResults}
        </div>
      )}
    </div>
  );
}
