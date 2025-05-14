# For

EdgeQL supports a top-level for statement. These “for loops” iterate over each element of some input set, execute some expression with it, and merge the results into a single output set.

```edgeql-repl
db> for number in {0, 1, 2, 3}
... union (
...   select { number, number + 0.5 }
... );
{0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5}
```

This statement iterates through each number in the set. Inside the loop, the number variable is bound to a singleton set. The inner expression is executed for every element of the input set, and the results of each execution are merged into a single output set.

The union keyword is required prior to EdgeDB 5.0 and is intended to indicate explicitly that the results of each loop execution are ultimately merged.

## Bulk inserts

The for statement is commonly used for bulk inserts.

```edgeql-repl
db> for hero_name in {'Cersi', 'Ikaris', 'Thena'}
... union (
...   insert Hero { name := hero_name }
... );
{
  default::Hero {id: d7d7e0f6-40ae-11ec-87b1-3f06bed494b9},
  default::Hero {id: d7d7f870-40ae-11ec-87b1-f712a4efc3a5},
  default::Hero {id: d7d7f8c0-40ae-11ec-87b1-6b8685d56610}
}
```

This statement iterates through each name in the list of names. Inside the loop, hero_name is bound to a str singleton, so it can be assigned to Hero.name.

Instead of literal sets, it’s common to use a json parameter for bulk inserts. This value is then “unpacked” into a set of json elements and used inside the for loop:

```edgeql-repl
db> with
...   raw_data := <json>$data,
... for item in json_array_unpack(raw_data) union (
...   insert Hero { name := <str>item['name'] }
... );
Parameter <json>$data: [{"name":"Sersi"},{"name":"Ikaris"},{"name":"Thena"}]
{
  default::Hero {id: d7d7e0f6-40ae-11ec-87b1-3f06bed494b9},
  default::Hero {id: d7d7f870-40ae-11ec-87b1-f712a4efc3a5},
  default::Hero {id: d7d7f8c0-40ae-11ec-87b1-6b8685d56610}
}
```

A similar approach can be used for bulk updates.

## Conditional DML

DML (i.e., insert, update, delete) is not supported in if..else. If you need to do one of these conditionally, you can use a for loop as a workaround. For example, you might want to write this conditional:

```default
# 🚫 Does not work
with admin := (select User filter .role = 'admin')
select admin if exists admin
  else (insert User {role := 'admin'});
```

Because of the lack of support for DML in a conditional, this query will fail. Here’s how you can accomplish the same thing using the workaround:

```edgeql
# ✅ Works!
with
  admin := (select User filter .role = 'admin'),
  new := (for _ in (select () filter not exists admin) union (
    insert User {role := 'admin'}
  )),
select {admin, new};
```

The admin alias represents the condition we want to test for. In this case, “do we have a User object with a value of admin for the role property?” In the new alias, we write a for loop with a select query that will produce a set with a single value if that object we queried for does not exist. (You can use exists instead of not exists in the nested select inside the for loop if you don’t want to invert the condition.)

A set with a single value results in a single iteration of the for loop. Inside that loop, we run our conditional DML — in this case to insert an admin user. Then we select both aliases to execute both of their queries. The query will return the User object. This in effect gives us a query that will insert a User object with a role of admin if none exists or return that object if it does exist.

If you’re trying to conditionally run DML in response to a violation of an exclusivity constraint, you don’t need this workaround. You should use unless conflict instead.

| --- |
| See also |
| Reference > Commands > For |

