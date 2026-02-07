"use client";

import {
  useState,
  createContext,
  type SetStateAction,
  type Dispatch,
} from "react";

interface BookContextType {
  bookIds: string[];
  setBookIds: Dispatch<SetStateAction<string[]>>;
}

export const BooksContext = createContext<BookContextType | undefined>(
  undefined
);

export default function BooksProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookIds, setBookIds] = useState<string[]>([]);

  return (
    <BooksContext.Provider value={{ bookIds, setBookIds }}>
      {children}
    </BooksContext.Provider>
  );
}
