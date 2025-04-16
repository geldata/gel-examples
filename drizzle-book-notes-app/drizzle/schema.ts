import { gelTable, uniqueIndex, uuid, text, timestamptz, smallint, foreignKey } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"


export const book = gelTable("Book", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	author: text(),
	genre: text(),
	readDate: timestamptz("read_date"),
	title: text().notNull(),
	year: smallint(),
}, (table) => [
	uniqueIndex("5f1d3546-1943-11f0-be08-df1707d45eaa;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const note = gelTable("Note", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	bookId: uuid("book_id").notNull(),
	createdAt: timestamptz("created_at").default(sql`(clock_timestamp())`),
	text: text().notNull(),
}, (table) => [
	uniqueIndex("5f1e4652-1943-11f0-a4a0-f1f912666606;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [book.id],
			name: "Note_fk_book"
		}),
]);
