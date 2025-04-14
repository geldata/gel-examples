import { relations } from "drizzle-orm/relations";
import { book, note } from "./schema";

export const noteRelations = relations(note, ({one}) => ({
	book: one(book, {
		fields: [note.bookId],
		references: [book.id]
	}),
}));

export const bookRelations = relations(book, ({many}) => ({
	notes: many(note),
}));