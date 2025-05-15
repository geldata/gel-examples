# Set

set – set one or multiple session-level parameters

```edgeql-synopsis
set module <module> ;
set alias <alias> as module <module> ;
set global <name> := <expr> ;
```

## Description

This command allows altering the configuration of the current session.

## Variations

## Examples

```edgeql
set module foo;

set alias foo AS module std;

set global current_user_id :=
    <uuid>'00ea8eaa-02f9-11ed-a676-6bd11cc6c557';
```

| --- |
| See also |
| Reference > EdgeQL > Reset |

