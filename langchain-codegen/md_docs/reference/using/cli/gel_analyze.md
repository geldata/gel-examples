# gel analyze

Performance analysis is also available in our CLI REPL and the UI’s REPL and query builder (both accessible by running gel ui to invoke your instance’s UI). Use it by prepending your query with analyze.

Run a query performance analysis on the given query.

```cli-synopsis
gel analyze [<options>] <query>
```

An example of analyze output from a simple query:

```default
──────────────────────────────────────── Query ────────────────────────────────────────
analyze select ➊  Hero {name, secret_identity, ➋  villains: {name, ➌  nemesis: {name}}};

──────────────────────── Coarse-grained Query Plan ────────────────────────
                   │ Time     Cost Loops Rows Width │ Relations
➊ root            │  0.0 69709.48   1.0  0.0    32 │ Hero
╰──➋ .villains    │  0.0     92.9   0.0  0.0    32 │ Villain, Hero.villains
╰──➌ .nemesis     │  0.0     8.18   0.0  0.0    32 │ Hero
```

## Options

The analyze command runs on the database it is connected to. For specifying the connection target see connection options.

