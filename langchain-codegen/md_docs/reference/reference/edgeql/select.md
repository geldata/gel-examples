# Select

select–retrieve or compute a set of values.

```edgeql-synopsis
[ with <with-item> [, ...] ]

select <expr>

[ filter <filter-expr> ]

[ order by <order-expr> [direction] [then ...] ]

[ offset <offset-expr> ]

[ limit  <limit-expr> ] ;
```

## Description

select retrieves or computes a set of values.  The data flow of a select block can be conceptualized like this:

```edgeql-synopsis
with module example

# select clause
select
    <expr>  # compute a set of things

# optional clause
filter
    <expr>  # filter the computed set

# optional clause
order by
    <expr>  # define ordering of the filtered set

# optional clause
offset
    <expr>  # slice the filtered/ordered set

# optional clause
limit
    <expr>  # slice the filtered/ordered set
```

Please note that the order by clause defines ordering that can only be relied upon if the resulting set is not used in any other operation. select, offset and limit clauses are the only exception to that rule as they preserve the inherent ordering of the underlying set.

The first clause is select. It indicates that filter, order by, offset, or limit clauses may follow an expression, i.e. it makes an expression into a select statement. Without any of the optional clauses a (select Expr) is completely equivalent to Expr for any expression Expr.

Consider an example using the filter optional clause:

```edgeql
with module example
select User {
    name,
    owned := (select
        User.<owner[is Issue] {
            number,
            body
        }
    )
}
filter User.name like 'Alice%';
```

The above example retrieves a single user with a specific name. The fact that there is only one such user is a detail that can be well- known and important to the creator of the database, but otherwise non- obvious. However, forcing the cardinality to be at most 1 by using the limit clause ensures that a set with a single object or {} is returned. This way any further code that relies on the result of this query can safely assume there’s only one result available.

```edgeql
with module example
select User {
    name,
    owned := (select
        User.<owner[is Issue] {
            number,
            body
        }
    )
}
filter User.name like 'Alice%'
limit 1;
```

Next example makes use of order by and limit clauses:

```edgeql
with module example
select Issue {
    number,
    body,
    due_date
}
filter
    exists Issue.due_date
    and
    Issue.status.name = 'Open'
order by
    Issue.due_date
limit 3;
```

The above query retrieves the top 3 open Issues with the closest due date.

## Filter

The filter clause cannot affect anything aggregate-like in the preceding select clause. This is due to how filter clause works. It can be conceptualized as a function like filter($input, set of $cond), where the $input represents the value of the preceding clause, while the $cond represents the filtering condition expression. Consider the following:

```edgeql
with module example
select count(User)
filter User.name like 'Alice%';
```

The above can be conceptualized as:

```edgeql
with module example
select _filter(
    count(User),
    User.name like 'Alice%'
);
```

In this form it is more apparent that User is a set of argument (of count()), while User.name like 'Alice%' is also a set of argument (of filter). So the symbol User in these two expressions exists in 2 parallel scopes. Contrast it with:

```edgeql
# This will actually only count users whose name starts with
# 'Alice'.

with module example
select count(
    (select User
     filter User.name like 'Alice%')
);

# which can be represented as:
with module example
select count(
    _filter(User,
           User.name like 'Alice%')
);
```

## Clause signatures

Here is a summary of clauses that can be used with select:

| --- |
| See also |
| EdgeQL > Select |
| Cheatsheets > Selecting data |

