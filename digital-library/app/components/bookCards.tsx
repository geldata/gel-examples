import BookCard from "./bookCard";
import { getBooks } from "../utils";

export default async function BookCards() {
  const books = await getBooks();

  return (
    <aside className="mb-8 pt-10 w-[320px] p-3 px-4 pr-5 h-screen overflow-auto border-r border-border">
      {books.map((book) => (
        <BookCard key={book.id} {...book} />
      ))}
    </aside>
  );
}
