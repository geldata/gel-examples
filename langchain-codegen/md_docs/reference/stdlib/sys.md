# System

| --- | --- |
| sys::approximate_count() | Return an approximate count of the number of objects belonging to a given type. |
| sys::get_version() | Return the server version as a tuple. |
| sys::get_version_as_str() | Return the server version as a string. |
| sys::get_current_database() | Return the name of the current database as a string. |
| sys::get_current_branch() | Return the name of the current database branch as a string. |
| sys::Branch | A read-only type representing all database branches. |
| sys::QueryStats | A read-only type representing query performance statistics. |
| sys::reset_query_stats() | Discard selected query statistics gathered so far. |

Type: function
Domain: eql
Summary: Return an approximate count of the number of objects belonging to a given type.
Signature: function sys::approximate_countint64


Return an approximate count of the number of objects belonging to a given type.

The type argument is a schema::ObjectType representing the type to query.  It can be most easily obtained with the introspect operator.

By default, the count includes all subtypes of the provided type as well. If ignore_subtypes is true, then it includes only the type itself.

The value is based on postgres statistics, and may not be accurate.

```edgeql-repl
db> select sys::approximate_count(introspect schema::Type);
{278}
db> select sys::approximate_count(introspect schema::Type, ignore_subtypes:=True);
{0}
db> select schema::ObjectType {
... name,
... cnt := sys::approximate_count(schema::ObjectType, ignore_subtypes:=True),
... };
{
   schema::ObjectType {name: 'default::Issue', cnt: 4},
   schema::ObjectType {name: 'default::User', cnt: 2},
   ...
}
```

Type: function
Domain: eql
Summary: Return the server version as a tuple.
Signature: function sys::get_versiontuple<major: int64, minor: int64, stage: sys::VersionStage, stage_no: int64, local: array<str>>


Return the server version as a tuple.

The major and minor elements contain the major and the minor components of the version; stage is an enumeration value containing one of 'dev', 'alpha', 'beta', 'rc' or 'final'; stage_no is the stage sequence number (e.g. 2 in an alpha 2 release); and local contains an arbitrary array of local version identifiers.

```edgeql-repl
db> select sys::get_version();
{(major := 1, minor := 0, stage := <sys::VersionStage>'alpha',
  stage_no := 1, local := [])}
```

Type: function
Domain: eql
Summary: Return the server version as a string.
Signature: function sys::get_version_as_strstr


Return the server version as a string.

```edgeql-repl
db> select sys::get_version_as_str();
{'1.0-alpha.1'}
```

Type: function
Domain: eql
Summary: Return the isolation level of the current transaction.
Signature: function sys::get_transaction_isolationsys::TransactionIsolation


Return the isolation level of the current transaction.

Possible return values are given by sys::TransactionIsolation.

```edgeql-repl
db> select sys::get_transaction_isolation();
{sys::TransactionIsolation.Serializable}
```

Type: function
Domain: eql
Summary: Return the name of the current database as a string.
Signature: function sys::get_current_databasestr


Return the name of the current database as a string.

```edgeql-repl
db> select sys::get_current_database();
{'my_database'}
```

Type: function
Domain: eql
Summary: Return the name of the current database branch as a string.
Signature: function sys::get_current_branchstr


Return the name of the current database branch as a string.

```edgeql-repl
db> select sys::get_current_branch();
{'my_branch'}
```

Type: type
Domain: eql
Summary: Enum indicating the possible transaction isolation modes.
Signature: type sys::TransactionIsolation


Enum indicating the possible transaction isolation modes.

This enum only accepts a value of Serializable.

Type: type
Domain: eql
Summary: A read-only type representing all database branches.
Signature: type sys::Branch


A read-only type representing all database branches.

Type: type
Domain: eql
Summary: A read-only type representing query performance statistics.
Signature: type sys::QueryStats


A read-only type representing query performance statistics.

All queries have to be planned by the backend before execution. The planned statements are cached (managed by the Gel server) and reused if the same query is executed multiple times.

After planning, the query is usually executed in the backend, with the result being forwarded to the client.

The following properties are used to identify a unique statistics entry (together with the query text above):

Type: type
Domain: eql
Summary: Enum indicating the possible query types.
Signature: type sys::QueryType


Enum indicating the possible query types.

Possible values are:

Type: type
Domain: eql
Summary: Enum indicating the possible output formats in a binary protocol.
Signature: type sys::OutputFormat


Enum indicating the possible output formats in a binary protocol.

Possible values are:

Type: function
Domain: eql
Summary: Discard selected query statistics gathered so far.
Signature: function sys::reset_query_statsoptional datetime


Discard selected query statistics gathered so far.

Discard query statistics gathered so far corresponding to the specified branch_name and id. If either of the parameters is not specified, the statistics that match with the other parameter will be reset. If no parameter is specified, it will discard all statistics. When minmax_only is true, only the values of minimum and maximum planning and execution time will be reset (i.e. min_plan_time, max_plan_time, min_exec_time and max_exec_time fields). The default value for minmax_only parameter is false. This function returns the time of a reset. This time is saved to stats_reset or minmax_stats_since field of sys::QueryStats if the corresponding reset was actually performed.

```edgeql-repl
db> select sys::reset_query_stats();
{'2021-01-01T00:00:00Z'}

db> select sys::reset_query_stats(branch_name := 'my_branch');
{'2021-01-01T00:00:00Z'}

db> select sys::reset_query_stats(id := <uuid>'00000000-0000-0000-0000-000000000000');
{'2021-01-01T00:00:00Z'}

db> select sys::reset_query_stats(minmax_only := true);
{'2021-01-01T00:00:00Z'}

db> select sys::reset_query_stats(branch_name := 'no_such_branch');
{}
```

