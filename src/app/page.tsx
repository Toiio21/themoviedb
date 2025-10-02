"use client";

import { MovieProvider } from "@/context/MovieContext";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MovieList from "@/components/MovieList";
import ImageToggle from "@/components/ImageToggle";
import GradientTest from "@/components/GradientTest";

export default function Home() {
  return (
    <MovieProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Поиск фильмов
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Найдите информацию о любом фильме с помощью The Movie Database
              </p>
              <ImageToggle />
            </div>

            <SearchBar />
            <GenreFilter />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <GradientTest />
          <MovieList />
        </div>
      </div>
    </MovieProvider>
  );
}
