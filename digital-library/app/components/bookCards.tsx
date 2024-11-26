"use client";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import BookCard from "./bookCard";
import { getBooks } from "../utils";

export default function BookCards({
  bookIds,
  updateBookIds,
}: {
  bookIds: string[];
  updateBookIds: Dispatch<SetStateAction<string[]>>;
}) {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    getBooks().then((books) => setBooks(books));
  }, []);

  return (
    <>
      {books.map((book) => (
        <BookCard
          key={book.id}
          {...book}
          addBookId={() => updateBookIds([...bookIds, book.id])}
          removeBookId={() =>
            updateBookIds(bookIds.filter((id) => id !== book.id))
          }
        />
      ))}
    </>
  );
}
