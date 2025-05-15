# administer statistics_update()

Update internal statistics about data.

```edgeql-synopsis
administer statistics_update "("
  [<type_link_or_property> [, ...]]
")"
```

## Description

Updates statistics about the contents of data in the current branch. Subsequently, the query planner uses these statistics to help determine the most efficient execution plans for queries.

## Examples

Update the statistics on type SomeType:

```edgeql
administer statistics_update(SomeType);
```

Update statistics of type SomeType and the link OtherType.ptr.

```edgeql
administer statistics_update(SomeType, OtherType.ptr);
```

Update statistics on everything that is user-accessible in the database:

```edgeql
administer statistics_update();
```

