# Declare savepoint

declare savepoint – declare a savepoint within the current transaction

```edgeql-synopsis
declare savepoint <savepoint-name> ;
```

## Description

savepoint establishes a new savepoint within the current transaction.

A savepoint is a special mark inside a transaction that allows all commands that are executed after it was established to be rolled back, restoring the transaction state to what it was at the time of the savepoint.

It is an error to declare a savepoint outside of a transaction.

## Example

```edgeql
# Will select no objects:
select test::TestObject { name };

start transaction;

    insert test::TestObject { name := 'q1' };
    insert test::TestObject { name := 'q2' };

    # Will select two TestObjects with names 'q1' and 'q2'
    select test::TestObject { name };

    declare savepoint f1;
        insert test::TestObject { name:='w1' };

        # Will select three TestObjects with names
        # 'q1' 'q2', and 'w1'
        select test::TestObject { name };
    rollback to savepoint f1;

    # Will select two TestObjects with names 'q1' and 'q2'
    select test::TestObject { name };

rollback;
```

| --- |
| See also |
| Reference > EdgeQL > Start transaction |
| Reference > EdgeQL > Commit |
| Reference > EdgeQL > Rollabck |
| Reference > EdgeQL > Rollback to savepoint |
| Reference > EdgeQL > Release savepoint |

