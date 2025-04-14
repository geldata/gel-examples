'use client';

import { useState, useEffect, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookWithNotes } from '@/src/db';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [book, setBook] = useState<BookWithNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch book');
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id, router]);

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();

    if (!noteText.trim()) return;

    try {
      const response = await fetch(`/api/books/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText }),
      });

      if (!response.ok) throw new Error('Failed to add note');

      const newNote = await response.json();
      setBook(prev => prev ? {
        ...prev,
        notes: [...prev.notes, newNote]
      } : null);
      setNoteText('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      setBook(prev => prev ? {
        ...prev,
        notes: prev.notes.filter(note => note.id !== noteId)
      } : null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleDeleteBook = async () => {
    if (!confirm('Are you sure you want to delete this book and all its notes?')) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete book');

      router.push('/');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto p-4">
        <p>Book not found.</p>
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          Back to All Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/" className="text-blue-400 hover:underline">
          ← Back
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-4xl font-extrabold leading-tight text-white">
          {book.title}
        </h1>
        <div className="mt-4 sm:mt-0 space-x-2">
          <Link
            href={`/books/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 inline-block"
          >
            Edit
          </Link>
          <button
            onClick={handleDeleteBook}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-150"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        {book.author && (
          <p className="text-lg font-medium mb-2 text-white">
            by {book.author}
          </p>
        )}
        <div className="space-y-1 text-sm text-gray-300">
          {book.year && <p>Published: {book.year}</p>}
          {book.genre && <p>Genre: {book.genre}</p>}
          {book.readDate && (
            <p>Read on: {new Date(book.readDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Notes</h2>

        <form onSubmit={handleAddNote} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a new note..."
              className="flex-grow px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            >
              Add
            </button>
          </div>
        </form>

        {book.notes.length === 0 ? (
          <p className="text-gray-400 italic">
            No notes yet. Add your first note above.
          </p>
        ) : (
          <ul className="space-y-4">
            {book.notes.map((note) => (
              <li
                key={note.id}
                className="flex justify-between items-start bg-gray-800 text-white p-4 rounded shadow-sm"
              >
                <div>
                  <p>{note.text}</p>
                  {note.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-400 hover:text-red-600 focus:outline-none transition duration-150"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
