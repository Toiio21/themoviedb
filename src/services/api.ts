import axios from 'axios';
import { MovieDetails, MoviesResponse, GenresResponse } from '@/types/movie';

const API_KEY = '07f0c1a63763d77f2b0073f1077c02c4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(`API Error: ${error.response.status} - ${error.response.data?.status_message || 'Unknown error'}`);
  } else if (error.request) {
    throw new Error('Network Error: Не удалось подключиться к серверу');
  } else {
    throw new Error(`Request Error: ${error.message}`);
  }
};

export const movieApi = {
  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
        language: 'ru-RU',
      },
    });
    return response.data;
  },

  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await api.get('/movie/popular', {
      params: {
        page,
        language: 'ru-RU',
      },
    });
    return response.data;
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        language: 'ru-RU',
      },
    });
    return response.data;
  },

  getGenres: async (): Promise<GenresResponse> => {
    const response = await api.get('/genre/movie/list', {
      params: {
        language: 'ru-RU',
      },
    });
    return response.data;
  },

  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MoviesResponse> => {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        language: 'ru-RU',
      },
    });
    return response.data;
  },
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) {
    return '/placeholder-movie.svg';
  }
  
  if (typeof window !== 'undefined') {
    const usePlaceholders = localStorage.getItem("usePlaceholders");
    if (usePlaceholders === 'true') {
      return '/placeholder-movie.svg';
    }
  }
  
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null): string => {
  return getImageUrl(path, 'w500');
};

export const getBackdropUrl = (path: string | null): string => {
  return getImageUrl(path, 'original');
};
