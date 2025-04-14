'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/src/db';
import BookForm from '@/src/components/BookForm';

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

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
        <button onClick={() => router.push('/')} className="text-blue-500 hover:text-blue-600">
          Back to All Books
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Book</h1>
      <BookForm book={book} isEditing={true} />
    </div>
  );
}
