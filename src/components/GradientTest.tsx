"use client";

import React from "react";

export default function GradientTest() {
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Тест градиентов</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`h-32 w-full bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white font-bold`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
