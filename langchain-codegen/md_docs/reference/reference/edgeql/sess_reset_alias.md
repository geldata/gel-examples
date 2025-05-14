# Reset

reset – reset one or multiple session-level parameters

```edgeql-synopsis
reset module ;
reset alias <alias> ;
reset alias * ;
reset global <name> ;
```

## Description

This command allows resetting one or many configuration parameters of the current session.

## Variations

## Examples

```edgeql
reset module;

reset alias foo;

reset alias *;

reset global current_user_id;
```

| --- |
| See also |
| Reference > EdgeQL > Set |

