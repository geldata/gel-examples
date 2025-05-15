# Vacuum

Reclaim storage space.

```edgeql-synopsis
administer vacuum "("
  [<type_link_or_property> [, ...]]
  [, full := {true | false}]
  [, statistics_update := {true | false}]
")"
```

## Description

Cleans and reclaims storage by removing obsolete data.

## Examples

Vacuum the type SomeType:

```edgeql
administer vacuum(SomeType);
```

Vacuum the type SomeType and the link OtherType.ptr and return reclaimed space to the operating system:

```edgeql
administer vacuum(SomeType, OtherType.ptr, full := true);
```

Vacuum everything that is user-accessible in the database:

```edgeql
administer vacuum();
```

