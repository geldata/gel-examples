"use client";

import { useState, useContext } from "react";
import { BooksContext } from "../booksProvider";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  summary: string;
}

export default function BookCard({
  id,
  title,
  author,
  summary,
}: BookCardProps) {
  const bookIds = useContext(BooksContext)?.bookIds;
  const setBookIds = useContext(BooksContext)?.setBookIds;

  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    if (bookIds && setBookIds) {
      if (isActive) {
        setBookIds(bookIds?.filter((bookId) => bookId !== id));
      } else {
        setBookIds([...bookIds, id]);
      }
    }

    setIsActive(!isActive);
  }

  return (
    <div className="relative bg-elem rounded-md mb-3 p-3 pt-2">
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
                ? "bg-text border-text"
                : "bg-transparent border-[#CCCCCC]"
            }`}
      >
        <span
          className={`text-lg transition-colors duration-200 ${
            isActive ? "text-bg" : "text-[#CCCCCC]"
          }`}
        >
          +
        </span>
      </button>
    </div>
  );
}
