import { NextResponse } from 'next/server';
import { db } from '../../../../../src/db';
import { note } from '../../../../../drizzle/schema';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    const result = await db.insert(note).values({
      text: body.text,
      bookId: id,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
