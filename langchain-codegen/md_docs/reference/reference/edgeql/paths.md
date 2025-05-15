# Paths

A path expression (or simply a path) represents a set of values that are reachable when traversing a given sequence of links or properties from some source set.

The result of a path expression depends on whether it terminates with a link or property reference.

The syntactic form of a path is:

```edgeql-synopsis
<expression> <path-step> [ <path-step> ... ]

# where <path-step> is:
  <step-direction> <pointer-name>
```

The individual path components are:

