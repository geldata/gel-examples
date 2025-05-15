# Analyze

analyze – trigger performance analysis of the appended query

```edgeql-synopsis
analyze <query>;

# where <query> is any EdgeQL query
```

## Description

analyze returns a table with performance metrics broken down by node.

You may prepend the analyze keyword in either of our REPLs (CLI or UI) or you may prepend in the UI’s query builder for a helpful visualization of your query’s performance.

After any analyze in a REPL, run the \expand command to see fine-grained performance analysis of the previously analyzed query.

## Example

```edgeql-repl
db> analyze select Hero {
...   name,
...   secret_identity,
...   villains: {
...     name,
...     nemesis: {
...       name
...     }
...   }
... };
──────────────────────────────────────── Query ────────────────────────────────────────
analyze select ➊  Hero {name, secret_identity, ➋  villains: {name, ➌  nemesis: {name}}};

──────────────────────── Coarse-grained Query Plan ────────────────────────
                  │ Time     Cost Loops Rows Width │ Relations
➊ root            │  0.0 69709.48   1.0  0.0    32 │ Hero
╰──➋ .villains    │  0.0     92.9   0.0  0.0    32 │ Villain, Hero.villains
╰──➌ .nemesis     │  0.0     8.18   0.0  0.0    32 │ Hero
```

| --- |
| See also |
| CLI > gel analyze |
| EdgeQL > Analyze |

