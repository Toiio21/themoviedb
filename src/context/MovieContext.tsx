"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Movie, MovieDetails, Genre } from "@/types/movie";

interface MovieState {
  movies: Movie[];
  selectedMovie: MovieDetails | null;
  genres: Genre[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  searchQuery: string;
  selectedGenre: number | null;
  loading: boolean;
  error: string | null;
}

type MovieAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_MOVIES";
      payload: {
        movies: Movie[];
        page: number;
        totalPages: number;
        totalResults: number;
      };
    }
  | { type: "SET_SELECTED_MOVIE"; payload: MovieDetails | null }
  | { type: "SET_GENRES"; payload: Genre[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_GENRE"; payload: number | null }
  | { type: "APPEND_MOVIES"; payload: Movie[] }
  | { type: "CLEAR_MOVIES" };

const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  genres: [],
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
  searchQuery: "",
  selectedGenre: null,
  loading: false,
  error: null,
};

function movieReducer(state: MovieState, action: MovieAction): MovieState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload.movies,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        loading: false,
        error: null,
      };

    case "APPEND_MOVIES":
      const existingIds = new Set(state.movies.map((movie) => movie.id));
      const newMovies = action.payload.filter(
        (movie) => !existingIds.has(movie.id)
      );

      return {
        ...state,
        movies: [...state.movies, ...newMovies],
        currentPage: state.currentPage + 1,
        loading: false,
        error: null,
      };

    case "SET_SELECTED_MOVIE":
      return { ...state, selectedMovie: action.payload };

    case "SET_GENRES":
      return { ...state, genres: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_SELECTED_GENRE":
      return { ...state, selectedGenre: action.payload };

    case "CLEAR_MOVIES":
      return {
        ...state,
        movies: [],
        currentPage: 1,
        totalPages: 0,
        totalResults: 0,
      };

    default:
      return state;
  }
}

const MovieContext = createContext<{
  state: MovieState;
  dispatch: React.Dispatch<MovieAction>;
} | null>(null);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error(
      "useMovieContext должен использоваться внутри MovieProvider"
    );
  }
  return context;
}
