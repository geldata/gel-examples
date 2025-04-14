'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookWithNotes } from '@/src/db';

export default function Home() {
  const [books, setBooks] = useState<BookWithNotes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-center">
        My Book Notes
      </h1>

      <Link
        href="/books/add"
        className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 text-white font-medium px-4 py-2 rounded transition duration-150 ease-in-out mb-8 inline-block"
      >
        Add New Book
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {books.length === 0 ? (
          <p className="text-lg text-center">No books found. Add your first book!</p>
        ) : (
          books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="mt-3 inline-block font-medium hover:shadow-lg transform hover:scale-105 transition duration-200"
            >
              <div
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md "
              >
                <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                {book.author && (
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    by {book.author}
                  </p>
                )}
                {book.year && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Published: {book.year}
                  </p>
                )}
                {book.genre && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Genre: {book.genre}
                  </p>
                )}
                <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {book.notes?.length || 0} notes
                </p>

              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
