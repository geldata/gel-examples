# Delete

The delete command is used to delete objects from the database.

```edgeql
delete Hero
filter .name = 'Iron Man';
```

## Clauses

Deletion statements support filter, order by, offset, and limit clauses. See EdgeQL > Select for full documentation on these clauses.

```edgeql
delete Hero
filter .name ilike 'the %'
order by .name
offset 10
limit 5;
```

## Link deletion

Every link is associated with a link deletion policy. By default, it isn’t possible to delete an object linked to by another.

```edgeql-repl
db> delete Hero filter .name = "Yelena Belova";
ConstraintViolationError: deletion of default::Hero
(af7076e0-3e98-11ec-abb3-b3435bbe7c7e) is prohibited by link target policy
{}
```

This deletion failed because Yelena is still in the characters list of the Black Widow movie. We must destroy this link before Yelena can be deleted.

```edgeql-repl
db> update Movie
... filter .title = "Black Widow"
... set {
...   characters -= (select Hero filter .name = "Yelena Belova")
... };
{default::Movie {id: af706c7c-3e98-11ec-abb3-4bbf3f18a61a}}
db> delete Hero filter .name = "Yelena Belova";
{default::Hero {id: af7076e0-3e98-11ec-abb3-b3435bbe7c7e}}
```

To avoid this behavior, we could update the Movie.characters link to use the allow deletion policy.

```sdl-diff
  type Movie {
    required title: str { constraint exclusive };
    required release_year: int64;
-   multi characters: Person;
+   multi characters: Person {
+     on target delete allow;
+   };
  }
```

## Return value

A delete statement returns the set of deleted objects. You can pass this set into select to fetch properties and links of the (now-deleted) objects. This is the last moment this data will be available before being permanently deleted.

```edgeql-repl
db> with movie := (delete Movie filter .title = "Untitled")
... select movie {id, title};
{default::Movie {
  id: b11303c6-40ac-11ec-a77d-d393cdedde83,
  title: 'Untitled',
}}
```

| --- |
| See also |
| Reference > Commands > Delete |
| Cheatsheets > Deleting data |

