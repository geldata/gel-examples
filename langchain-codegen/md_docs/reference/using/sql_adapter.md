# SQL adapter

## Connecting

Gel server supports PostgreSQL connection interface. It implements PostgreSQL wire protocol as well as SQL query language.

As of Gel 6.0, it also supports a subset of Data Modification Language, namely INSERT, DELETE and UPDATE statements.

It does not, however, support PostgreSQL Data Definition Language (e.g. CREATE TABLE). This means that it is not possible to use SQL connections to Gel to modify its schema. Instead, the schema should be managed in .gel files using Gel Schema Definition Language and migration commands.

Any Postgres-compatible client can connect to a Gel database by using the same port that is used for the Gel protocol and the branch name, username, and password already used for the database.

The insecure DSN returned by the CLI for Gel Cloud instances will not contain the password. You will need to either create a new role and set the password, using those values to connect to your SQL client, or change the password of the existing role, using that role name along with the newly created password. db> alter role admin { ...   set password := 'my-password' ... }; OK: ALTER ROLE

## Querying

Object types in your Gel schema are exposed as regular SQL tables containing all the data you store in your Gel database.

If you have a database with the following schema:

```sdl
module default {
    type Person {
        name: str;
    };

    type Movie extending common::Content {
        release_year: int32;
        director: Person;
        star: Person {
            role: str;
        };
        multi actors: Person {
            role: str;
        };
        multi labels: str;
    };
}
module common {
    type Content {
        title: str;
    };
}
```

you can access your data after connecting using the following SQL queries:

```sql
SELECT id, name FROM "Person";
SELECT id, title, release_year, director_id, star_id FROM "Movie";
```

Because the link star has link properties, it has its own table. source is the id of the Movie. target is the id of the Person.

```sql
SELECT source, target, role FROM "Movie.star";
```

Links are in separate tables.

```sql
SELECT source, target, role FROM "Movie.actors";
```

Multi properties are in separate tables. source is the id of the Movie. target is the value of the property.

```sql
SELECT source, target FROM "Movie.labels";
```

When using inheritance, parent object types’ tables will by default contain all objects of both the parent type and any child types. The query below will return all common::Content objects as well as all Movie objects.

```sql
SELECT id, title FROM common."Content";
```

To omit objects of child types, use ONLY. This query will return common::Content objects but not Movie objects.

```sql
SELECT id, title FROM ONLY common."Content";
```

The SQL adapter supports a large majority of SQL language, including:

```sql
SELECT id, 'Title is: ' || tittle
FROM "Movie" m
JOIN "Person" d ON m.director_id = d.id
WHERE EXISTS (
    SELECT 1
    FROM "Movie.actors" act
    WHERE act.source = m.id
);
```

The SQL adapter emulates the information_schema and pg_catalog views to mimic the catalogs provided by Postgres 13.

Learn more about the Postgres information schema from the Postgres information schema documentation.

## Tested SQL tools

## Gel to PostgreSQL

As mentioned, the SQL schema of the database is managed trough Gel Schema Definition Language. Here is a breakdown of how each of its constructs is mapped to PostgreSQL schema:

## DML commands

When using INSERT, DELETE or UPDATE on any table, mutation rewrites and triggers are applied. These commands do not have a straight-forward translation to EdgeQL DML commands, but instead use the following mapping:

## Connection settings

SQL adapter supports most of PostgreSQL connection settings (for example search_path), in the same manner as plain PostgreSQL:

```sql
SET search_path TO my_module;

SHOW search_path;

RESET search_path;
```

## Introspection

The adapter emulates introspection schemas of PostgreSQL: information_schema and pg_catalog.

Both schemas are not perfectly emulated, since they are quite large and complicated stores of information, that also changed between versions of PostgreSQL.

Because of that, some tools might show objects that are not queryable or might report problems when introspecting. In such cases, please report the problem on GitHub so we can track the incompatibility down.

Note that since the two information schemas are emulated, querying them may perform worse compared to other tables in the database. As a result, tools like pg_dump and other introspection utilities might seem slower.

## Locking

SQL adapter supports LOCK command with the following limitations:

## Query cache

An SQL query is issued to Gel, it is compiled to an internal SQL query, which is then issued to the backing PostgreSQL instance. The compiled query is then cached, so each following issue of the same query will not perform any compilation, but just pass through the cached query.

## Known limitations

Following SQL statements are not supported:

Following functions are not supported:

## Example: gradual transition from ORMs to Gel

When a project is using Object-Relational Mappings (e.g. SQLAlchemy, Django, Hibernate ORM, TypeORM) and is considering the migration to Gel, it might want to execute the transition gradually, as opposed to a total rewrite of the project.

In this case, the project can start the transition by migrating the ORM models to Gel Schema Definition Language.

For example, such Hibernate ORM model in Java:

```default
@Entity
class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    private String title;

    @NotNull
    private Integer releaseYear;

    // ... getters and setters ...
}
```

… would be translated to the following Gel SDL:

```sdl
type Movie {
    title: str;

    required releaseYear: int32;
}
```

A new Gel instance can now be created and migrated to the translated schema. At this stage, Gel will allow SQL connections to write into the "Movie" table, just as it would have been created with the following DDL command:

```sql
CREATE TABLE "Movie" (
    id UUID PRIMARY KEY DEFAULT (...),
    __type__ UUID NOT NULL DEFAULT (...),
    title TEXT,
    releaseYear INTEGER NOT NULL
);
```

When translating the old ORM model to Gel SDL, one should aim to make the SQL schema of Gel match the SQL schema that the ORM expects.

When this match is accomplished, any query that used to work with the old, plain PostgreSQL, should now also work with the Gel. For example, we can execute the following query:

```sql
INSERT INTO "Movie" (title, releaseYear)
VALUES ("Madagascar", 2012)
RETURNING id, title, releaseYear;
```

To complete the migration, the data can be exported from our old database into an .sql file, which can be import it into Gel:

```bash
$ pg_dump {your PostgreSQL connection params} \
    --data-only --inserts --no-owner --no-privileges \
    > dump.sql

$ psql {your Gel connection params} --file dump.sql
```

Now, the ORM can be pointed to Gel instead of the old PostgreSQL database, which has been fully replaced.

Arguably, the development of new features with the ORM is now more complex for the duration of the transition, since the developer has to modify two model definitions: the ORM and the Gel schema.

But it allows any new models to use Gel schema, EdgeQL and code generators for the client language of choice. The ORM-based code can now also be gradually rewritten to use EdgeQL, one model at the time.

For a detailed migration example, see repository geldata/hibernate-example.

