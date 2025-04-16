'use client';

import BookForm from "@/src/components/BookForm";


export default function AddBookPage() {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Book</h1>
      <BookForm />
    </div>
  );
}
