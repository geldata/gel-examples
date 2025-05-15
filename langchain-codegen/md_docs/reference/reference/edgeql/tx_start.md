# Start transaction

start transaction – start a transaction

```edgeql-synopsis
start transaction <transaction-mode> [ , ... ] ;

# where <transaction-mode> is one of:

isolation serializable
read write | read only
deferrable | not deferrable
```

## Description

This command starts a new transaction block.

Any Gel command outside of an explicit transaction block starts an implicit transaction block; the transaction is then automatically committed if the command was executed successfully, or automatically rollbacked if there was an error.  This behavior is often called “autocommit”.

## Parameters

The <transaction-mode> can be one of the following:

## Examples

Start a new transaction and rollback it:

```edgeql
start transaction;
select 'Hello World!';
rollback;
```

Start a serializable deferrable transaction:

```edgeql
start transaction isolation serializable, read only, deferrable;
```

| --- |
| See also |
| Reference > EdgeQL > Commit |
| Reference > EdgeQL > Rollback |
| Reference > EdgeQL > Declare savepoint |
| Reference > EdgeQL > Rollback to savepoint |
| Reference > EdgeQL > Release savepoint |

