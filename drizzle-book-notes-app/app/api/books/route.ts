import { book } from '@/drizzle/schema';
import { db } from '@/src/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allBooks = await db.query.book.findMany({
      with: {
        notes: true,
      }
    });

    return NextResponse.json(allBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await db.insert(book).values({
      title: body.title,
      author: body.author,
      year: body.year,
      genre: body.genre,
      readDate: new Date(body.read_date),
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
}
