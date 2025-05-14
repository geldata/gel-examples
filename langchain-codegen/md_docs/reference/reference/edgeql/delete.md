# Delete

delete – remove objects from a database.

```edgeql-synopsis
[ with <with-item> [, ...] ]

delete <expr>

[ filter <filter-expr> ]

[ order by <order-expr> [direction] [then ...] ]

[ offset <offset-expr> ]

[ limit  <limit-expr> ] ;
```

## Output

On successful completion, a delete statement returns the set of deleted objects.

## Examples

Here’s a simple example of deleting a specific user:

```edgeql
with module example
delete User
filter User.name = 'Alice Smith';
```

And here’s the equivalent delete (select ...) statement:

```edgeql
with module example
delete (select User
        filter User.name = 'Alice Smith');
```

| --- |
| See also |
| EdgeQL > Delete |
| Cheatsheets > Deleting data |

