# Configure

configure – change a server configuration parameter

```edgeql-synopsis
configure {session | current branch | instance}
    set <parameter> := <value> ;
configure instance insert <parameter-class> <insert-shape> ;
configure {session | current branch | instance} reset <parameter> ;
configure {current branch | instance}
    reset <parameter-class> [ filter <filter-expr> ] ;
```

Prior to Gel and EdgeDB 5.0 branches were called databases. configure current branch is used to be called configure current database, which is still supported for backwards compatibility.

## Description

This command allows altering the server configuration.

The effects of configure session last until the end of the current session. Some configuration parameters cannot be modified by configure session and can only be set by configure instance.

configure current branch is used to configure an individual Gel branch within a server instance with the changes persisted across server restarts.

configure instance is used to configure the entire Gel instance with the changes persisted across server restarts.  This variant acts directly on the file system and cannot be rolled back, so it cannot be used in a transaction block.

The configure instance insert variant is used for composite configuration parameters, such as Auth.

## Parameters

## Examples

Set the listen_addresses parameter:

```edgeql
configure instance set listen_addresses := {'127.0.0.1', '::1'};
```

Set the query_work_mem parameter for the duration of the session:

```edgeql
configure instance set query_work_mem := <cfg::memory>'4MiB';
```

Add a Trust authentication method for “my_user”:

```edgeql
configure instance insert Auth {
    priority := 1,
    method := (insert Trust),
    user := 'my_user'
};
```

Remove all Trust authentication methods:

```edgeql
configure instance reset Auth filter Auth.method is Trust;
```

