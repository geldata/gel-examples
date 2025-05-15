# vs SQL and ORMs

Gel’s approach to schema modeling builds upon the foundation of SQL while taking cues from modern tools like ORM libraries. Let’s see how it stacks up.

## Comparison to SQL

When using SQL databases, there’s no convenient representation of the schema. Instead, the schema only exists as a series of {CREATE|ALTER|DELETE} {TABLE| COLUMN} commands, usually spread across several SQL migration scripts. There’s no simple way to see the current state of your schema at a glance.

Moreover, SQL stores data in a relational way. Connections between tables are represented with foreign key constraints and JOIN operations are required to query across tables.

```default
CREATE TABLE people (
  id            uuid  PRIMARY KEY,
  name          text,
);
CREATE TABLE movies (
  id            uuid  PRIMARY KEY,
  title         text,
  director_id   uuid  REFERENCES people(id)
);
```

In Gel, connections between tables are represented with Links.

```sdl
type Movie {
  required title: str;
  required director: Person;
}

type Person {
  required name: str;
}
```

This approach makes it simple to write queries that traverse this link, no JOINs required.

```edgeql
select Movie {
  title,
  director: {
    name
  }
}
```

## Comparison to ORMs

Object-relational mapping libraries are popular for a reason. They provide a way to model your schema and write queries in a way that feels natural in the context of modern, object-oriented programming languages. But ORMs have downsides too.

From the beginning, Gel was designed to incorporate the best aspects of ORMs — declarative modeling, object-oriented APIs, and intuitive querying — without the drawbacks.

