# gel migration

Gel provides schema migration tools as server-side tools. This means that, from the point of view of the application, migrations are language- and platform-agnostic and don’t require additional libraries.

Using the migration tools is the recommended way to make schema changes.

## Setup

First of all, the migration tools need a place to store the schema and migration information. By default they will look in the dbschema directory, but it’s also possible to specify any other location by using the schema-dir option.

Inside this directory, you will find an .gel file with an SDL schema description. You may split your schema across multiple .gel files. The migration tools will read all of them and treat them as a single SDL document.

| --- | --- |
| gel migration apply | Bring current branch to the latest or a specified revision |
| gel migration create | Create a migration script |
| gel migration edit | Edit migration file |
| gel migration extract | Extract migration history and write it to /migrations. |
| gel migration log | Show all migration versions |
| gel migration status | Show current migration state |
| gel migration upgrade-check | Checks your schema against a different Gel version. |

