"use client";

import { useState } from "react";
import BookCard from "./bookCard";
import { SidebarIcon } from "../icons";

export default function BookCards({ books }: { books: any[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <aside
        className={`pt-14 border-r border-border transition-all duration-300 ease-in-out 
          bg-bg absolute lg:relative top-0 left-0 z-20 shrink-0 ${
            isCollapsed
              ? "h-fit lg:h-screen border-b rounded-br-lg w-14"
              : "h-screen w-[300px] block"
          }  `}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-2 right-2 p-2 text-md rounded-md text-text hover:bg-elem"
          aria-label="Toggle Sidebar"
        >
          <SidebarIcon />
        </button>
        <div
          className={`h-full overflow-y-auto p-3 px-4 pr-5 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </aside>
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-10 lg:hidden" />
      )}
    </>
  );
}
