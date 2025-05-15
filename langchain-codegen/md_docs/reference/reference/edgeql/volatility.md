# Volatility

The volatility of an expression refers to how its value may change across successive evaluations.

Expressions may have one of the following volatilities, in order of increasing volatility:

## Expressions

All primitives, ranges, and multiranges are Immutable.

Arrays, tuples, and sets have the volatility of their most volatile component.

Globals are always Stable, even computed globals with an immutable expression.

## Restrictions

Some features restrict the volatility of expressions. A lower volatility can be used.

Indexes expressions must be Immutable. Within the index, pointers to the indexed object are treated as immutable

constraints expressions must be Immutable. Within the constraint, the __subject__ and its pointers are treated as immutable.

Access policies must be Stable.

Aliases, globals, and computed pointers in the schema must be Stable.

The cartesian product of a Volatile or Modifying expression is not allowed.

```edgeql-repl
db> SELECT {1, 2} + random()
QueryError: can not take cross product of volatile operation
```

Modifying expressions are not allowed in a non-scalar argument to a function, except for standard set functions.

The non-optional parameters of Modifying functions must have a cardinality of One. Optional parameters must have a cardinality of AtMostOne.

