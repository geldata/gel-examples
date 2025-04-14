'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '../db';

interface BookFormProps {
  book?: Book;
  isEditing?: boolean;
}

export default function BookForm({ book, isEditing = false }: BookFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [year, setYear] = useState(book?.year?.toString() || '');
  const [genre, setGenre] = useState(book?.genre || '');
  const [readDate, setReadDate] = useState(
    book?.readDate
      ? new Date(book.readDate).toISOString().split('T')[0]
      : ''
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const bookData = {
      title,
      author,
      year: year ? parseInt(year) : undefined,
      genre,
      read_date: readDate || undefined,
    };

    try {
      if (isEditing && book) {
        // Update existing book
        await fetch(`/api/books/${book.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
      } else {
        // Create new book
        await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-white font-semibold mb-1" htmlFor="title">
          Title*
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1" htmlFor="year">
          Publication Year
        </label>
        <input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white font-semibold mb-1" htmlFor="genre">
          Genre
        </label>
        <input
          id="genre"
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <div className="mb-6">
        <label className="block text-white font-semibold mb-1" htmlFor="readDate">
          Date Read
        </label>
        <input
          id="readDate"
          type="date"
          value={readDate}
          onChange={(e) => setReadDate(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-700 transition duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-150"
        >
          {isEditing ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}
