# Update

The update command is used to update existing objects.

```edgeql-repl
db> update Hero
... filter .name = "Hawkeye"
... set { name := "Ronin" };
{default::Hero {id: d476b12e-3e7b-11ec-af13-2717f3dc1d8a}}
```

If you omit the filter clause, all objects will be updated. This is useful for updating values across all objects of a given type. The example below cleans up all Hero.name values by trimming whitespace and converting them to title case.

```edgeql-repl
db> update Hero
... set { name := str_trim(str_title(.name)) };
{default::Hero {id: d476b12e-3e7b-11ec-af13-2717f3dc1d8a}}
```

## Syntax

The structure of the update statement (update...filter...set) is an intentional inversion of SQL’s UPDATE...SET...WHERE syntax. Curiously, in SQL, the where clauses typically occur last despite being applied before the set statement. EdgeQL is structured to reflect this; first, a target set is specified, then filters are applied, then the data is updated.

