import { drizzle } from 'drizzle-orm/gel';
import { createClient } from 'gel';

import * as schema from '../../drizzle/schema';
import * as relations from '../../drizzle/relations';

// Initialize Gel client
const gelClient = createClient();

// Create Drizzle instance
export const db = drizzle({
  client: gelClient, schema: {
    ...schema,
    ...relations
  },
});

// Helper types for use in our application
export type Book = typeof schema.book.$inferSelect;
export type NewBook = typeof schema.book.$inferInsert;
export interface BookWithNotes extends Book {
  notes: Note[];
};

export type Note = typeof schema.note.$inferSelect;
export type NewNote = typeof schema.note.$inferInsert;
