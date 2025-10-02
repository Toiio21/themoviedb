"use client";

import React, { useState, useEffect } from "react";

export default function ImageToggle() {
  const [usePlaceholders, setUsePlaceholders] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("usePlaceholders");
    if (saved !== null) {
      setUsePlaceholders(JSON.parse(saved));
    }
  }, []);

  const handleToggle = () => {
    const newValue = !usePlaceholders;
    setUsePlaceholders(newValue);
    localStorage.setItem("usePlaceholders", JSON.stringify(newValue));
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={usePlaceholders}
          onChange={handleToggle}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <span>Использовать заглушки (быстрее)</span>
      </label>
    </div>
  );
}
