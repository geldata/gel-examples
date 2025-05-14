# Parameters

EdgeQL queries can reference parameters with $ notation. The value of these parameters are supplied externally.

```edgeql
select <str>$var;
select <int64>$a + <int64>$b;
select BlogPost filter .id = <uuid>$blog_id;
```

Note that we provided an explicit type cast before the parameter. This is required, as it enables Gel to enforce the provided types at runtime.

Parameters can be named or unnamed tuples.

```edgeql
select <tuple<str, bool>>$var;
select <optional tuple<str, bool>>$var;
select <tuple<name: str, flag: bool>>$var;
select <optional tuple<name: str, flag: bool>>$var;
```

## Usage with clients

## Parameter types and JSON

In Gel, parameters can also be tuples. If you need to pass complex structures as parameters, use Gel’s built-in JSON functionality.

```edgeql-repl
db> with data := <json>$data
... insert Movie {
...   title := <str>data['title'],
...   release_year := <int64>data['release_year'],
... };
Parameter <json>$data: {"title": "The Marvels", "release_year": 2023}
{default::Movie {id: 8d286cfe-3c0a-11ec-aa68-3f3076ebd97f}}
```

Arrays can be “unpacked” into sets and assigned to multi links or properties.

```edgeql
with friends := (
  select User filter .id in array_unpack(<array<uuid>>$friend_ids)
)
insert User {
  name := <str>$name,
  friends := friends,
};
```

## Optional parameters

By default, query parameters are required; the query will fail if the parameter value is an empty set. You can use an optional modifier inside the type cast if the parameter is optional.

```edgeql-repl
db> select <optional str>$name;
Parameter <str>$name (Ctrl+D for empty set `{}`):
{}
```

The <required foo> type cast is also valid (though redundant) syntax. select <required str>$name;

## Default parameter values

When using optional parameters, you may want to provide a default value to use in case the parameter is not passed. You can do this by using the ?? (coalesce) operator.

```edgeql-repl
db> select 'Hello ' ++ <optional str>$name ?? 'there';
Parameter <str>$name (Ctrl+D for empty set `{}`): Gel
{'Hello Gel'}
db> select 'Hello ' ++ <optional str>$name ?? 'there';
Parameter <str>$name (Ctrl+D for empty set `{}`):
{'Hello there'}
```

## What can be parameterized?

Any data manipulation language (DML) statement can be parameterized: select, insert, update, and delete. Since parameters can only be scalars, arrays of scalars, and tuples of scalars, only parts of the query that would be one of those types can be parameterized. This excludes parts of the query like the type being queried and the property to order by.

You can parameterize order by for a limited number of options by using if..else: select Movie {*} order by (.title if <str>$order_by = 'title' else <str>{}) then (.release_year if <str>$order_by = 'release_year' else <int64>{}); If a user running this query enters title as the parameter value, Movie objects will be sorted by their title property. If they enter release_year, they will be sorted by the release_year property. Since the if and else result clauses need to be of compatible types, your else expressions should be an empty set of the same type as the property.

Schema definition language (SDL) and configure statements cannot be parameterized. Data definition language (DDL) has limited support for parameters, but it’s not a recommended pattern. Some of the limitations might be lifted in future versions.

