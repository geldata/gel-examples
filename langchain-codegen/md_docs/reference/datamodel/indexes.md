# Indexes

An index is a data structure used internally to speed up filtering, ordering, and grouping operations in Gel. Indexes help accomplish this in two key ways:

The Postgres query planner decides when to use indexes for a query. In some cases—e.g. when tables are small—it may be faster to scan the whole table rather than use an index. In such scenarios, the index might be ignored. For more information on how the planner decides this, see the Postgres query planner documentation.

## Tradeoffs

While improving query performance, indexes also increase disk and memory usage and can slow down insertions and updates. Creating too many indexes may be detrimental; only index properties you often filter, order, or group by.

## Index on a property

Most commonly, indexes are declared within object type declarations and reference a particular property. The index can be used to speed up queries that reference that property in a filter, order by, or group by clause:

```sdl
type User {
  required name: str;
  index on (.name);
}
```

By indexing on User.name, the query planner will have access to that index when planning queries using the name property. This may result in better performance as the database can look up a name in the index instead of scanning through all User objects sequentially—though ultimately it’s up to the Postgres query planner whether to use the index.

To see if an index helps, compare query plans by adding analyze to your queries.

Even if your database is small now, you may benefit from an index as it grows.

## Index on an expression

Indexes may be defined using an arbitrary singleton expression that references multiple properties of the enclosing object type.

Example:

```sdl
type User {
  required first_name: str;
  required last_name: str;
  index on (str_lower(.first_name + ' ' + .last_name));
}
```

## Index on multiple properties

A composite index references multiple properties. This can speed up queries that filter, order, or group on multiple properties at once.

An index on multiple properties may also be used in queries where only a single property in the index is referenced. In many traditional database systems, placing the most frequently used columns first in the composite index can improve the likelihood of its use. Read the Postgres documentation on multicolumn indexes to learn more about how the query planner uses these indexes.

In Gel, a composite index is created by indexing on a tuple of properties:

```sdl
type User {
  required name: str;
  required email: str;
  index on ((.name, .email));
}
```

## Index on a link property

Link properties can also be indexed. The special placeholder __subject__ refers to the source object in a link property expression:

```sdl
abstract link friendship {
  strength: float64;
  index on (__subject__@strength);
}

type User {
  multi friends: User {
    extending friendship;
  };
}
```

## Exclude objects from an index

When specifying an index, you can provide an optional except clause to exclude objects from the index. This is known as creating a partial index. Partial indexes are particularly useful in scenarios where you frequently query a subset of data that meets certain criteria, while consistently excluding other data. For example, if you often filter on a property but always exclude objects with a specific value for another property, a partial index can optimize these queries by indexing only the relevant subset of data, thus improving query performance and reducing index size.

```sdl
type User {
  required name: str;
  required email: str;
  archived_at: datetime;

  index on (.name) except (exists .archived_at);
}
```

## Specify a Postgres index type

Gel exposes Postgres index types that can be used directly in schemas via the pg module:

Example:

```sdl
type User {
  required name: str;
  index pg::spgist on (.name);
}
```

## Annotate an index

Indexes can include annotations:

```sdl
type User {
  name: str;
  index on (.name) {
    annotation description := 'Indexing all users by name.';
  };
}
```

## Declaring indexes

This section describes the syntax to use indexes in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping indexes. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

