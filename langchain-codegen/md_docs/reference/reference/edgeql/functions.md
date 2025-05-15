# Function calls

Gel provides a number of functions in the standard library. It is also possible for users to define their own functions.

The syntax for a function call is as follows:

```edgeql-synopsis
<function_name> "(" [<argument> [, <argument>, ...]] ")"

# where <argument> is:

<expr> | <identifier> := <expr>
```

Here <function_name> is a possibly qualified name of a function, and <argument> is an expression optionally prefixed with an argument name and the assignment operator (:=) for named only arguments.

For example, the following computes the length of a string 'foo':

```edgeql-repl
db> select len('foo');
{3}
```

And here’s an example of using a named only argument to provide a default value:

```edgeql-repl
db> select array_get(['hello', 'world'], 10, default := 'n/a');
{'n/a'}
```

| --- |
| See also |
| Schema > Functions |
| SDL > Functions |
| DDL > Functions |
| Introspection > Functions |
| Cheatsheets > Functions |

