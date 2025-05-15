# Reference

Learn three components, and you know Gel: how to work with schema, how to write queries with EdgeQL, and what’s available to you in our standard library. Start in those sections if you’re new to Gel. Move over to our reference when you’re ready to dive deep into the internals, syntax, and other advanced topics.

## Schema

Gel schemas are declared using our schema definition language (SDL).

```sdl
module default {
  type Book {
    required title: str;
    release_year: int16;
    author: Person;
  }
  type Person {
    required name: str;
  }
}
```

The example schema above defines two types: Book and Person, each with a property or two. Book also contains a link to the author, which is a link to objects of the Person type. Learn more about how to define your schema using SDL in the schema section.

## EdgeQL

EdgeQL is a next-generation query language designed to match SQL in power and surpass it in terms of clarity, brevity, and intuitiveness.

```edgeql-repl
db> select Book {
...   title,
...   release_year,
...   author: {
...     name
...   }
... } order by .title;
{
  default::Book {
    title: '1984',
    release_year: 1949,
    author: default::Person {
      name: 'George Orwell'
    }
  },
  default::Book {
    title: 'Americanah',
    release_year: 2013,
    author: default::Person {
      name: 'Chimamanda Ngozi Adichie'
    }
  },
  ...
}
```

You can use EdgeQL to easily return nested data structures just by putting a shape with a link on an object as shown above.

## Standard library

Gel comes with a rigorously defined type system consisting of scalar types, collection types (like arrays and tuples), and object types. It also includes a library of built-in functions and operators for working with each datatype, alongside some additional utilities and extensions.

```edgeql-repl
db> select count(Book);
{16}
db> select Book {
...   title,
...   title_length := len(.title)
... } order by .title_length;
{
  default::Book {
    title: 'Sula',
    title_length: 4
  },
  default::Book {
    title: '1984',
    title_length: 4
  },
  default::Book {
    title: 'Beloved',
    title_length: 7
  },
  default::Book {
    title: 'The Fellowship of the Ring',
    title_length: 26
  },
  default::Book {
    title: 'One Hundred Years of Solitude',
    title_length: 29
  },
}
db> select math::stddev(len(Book.title));
{7.298401651503339}
```

Gel comes with a rigorously defined type system consisting of scalar types, collection types (like arrays and tuples), and object types. It also includes a library of built-in functions and operators for working with each datatype, alongside some additional utilities and extensions.

## Cheatsheets

Learn to do various common tasks using the many tools included with Gel.

