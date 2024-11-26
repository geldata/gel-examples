"use client";

import { useState } from "react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  summary: string;
  addBookId: any;
  removeBookId: any;
}

export default function BookCard({
  id,
  title,
  author,
  summary,
  addBookId,
  removeBookId,
}: BookCardProps) {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    if (isActive) {
      removeBookId(id);
    } else {
      addBookId(id);
    }

    setIsActive(!isActive);
  }

  return (
    <div className="relative bg-[#181924] rounded-md mb-3 p-3 pt-2">
      <p>{title}</p>
      <p className="text-sm mb-1">- {author}</p>
      <p
        className="overflow-hidden text-ellipsis text-xs"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        {summary}
      </p>
      <button
        onClick={handleClick}
        className={`w-7 h-7 rounded-full border flex items-center justify-center absolute -top-2 -right-2 transition-colors duration-200
            ${
              isActive
                ? "bg-green border-green"
                : "bg-transparent border-[#9696b8]"
            }`}
      >
        <span
          className={`text-lg transition-colors duration-200 ${
            isActive ? "text-[#181924]" : "text-action"
          }`}
        >
          +
        </span>
      </button>
    </div>
  );
}
