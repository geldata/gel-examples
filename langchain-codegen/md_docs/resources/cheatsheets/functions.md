# Declaring functions

Define a function for counting reviews given a user name:

```edgeql
create function review_count(name: str) -> int64
using (
    with module default
    select count(
        (
            select Review
            filter .author.name = name
        )
    )
)
```

Drop a user-defined function:

```edgeql
drop function review_count(name: str);
```

Define and use polymorphic function:

```edgeql-repl
db> create function make_name(name: str) -> str
... using ('my_name_' ++ name);
CREATE FUNCTION
db> create function make_name(name: int64) -> str
... using ('my_name_' ++ <str>name);
CREATE FUNCTION
q> select make_name('Alice');
{'my_name_Alice'}
q> select make_name(42);
{'my_name_42'}
```

| --- |
| See also |
| Schema > Functions |
| SDL > Functions |
| DDL > Functions |
| Reference > Function calls |
| Introspection > Functions |

