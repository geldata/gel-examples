# Update

update – update objects in a database

```edgeql-synopsis
[ with <with-item> [, ...] ]

update <selector-expr>

[ filter <filter-expr> ]

set <shape> ;
```

update changes the values of the specified links in all objects selected by update-selector-expr and, optionally, filtered by filter-expr.

## Output

On successful completion, an update statement returns the set of updated objects.

## Examples

Here are a couple of examples of the update statement with simple assignments using :=:

```edgeql
# update the user with the name 'Alice Smith'
with module example
update User
filter .name = 'Alice Smith'
set {
    name := 'Alice J. Smith'
};

# update all users whose name is 'Bob'
with module example
update User
filter .name like 'Bob%'
set {
    name := User.name ++ '*'
};
```

For usage of += and -= consider the following Post type:

```sdl
# ... Assume some User type is already defined
type Post {
    required title: str;
    required body: str;
    # A "tags" property containing a set of strings
    multi tags: str;
    author: User;
}
```

The following queries add or remove tags from some user’s posts:

```edgeql
with module example
update Post
filter .author.name = 'Alice Smith'
set {
    # add tags
    tags += {'example', 'edgeql'}
};

with module example
update Post
filter .author.name = 'Alice Smith'
set {
    # remove a tag, if it exist
    tags -= 'todo'
};
```

The statement for <x> in <expr> allows to express certain bulk updates more clearly. See Usage of for statement for more details.

| --- |
| See also |
| EdgeQL > Update |
| Cheatsheets > Updating data |

