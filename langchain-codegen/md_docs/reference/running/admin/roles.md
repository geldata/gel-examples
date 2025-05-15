# Role

This section describes the administrative commands pertaining to roles.

## Create role

Create a role.

```edgeql-synopsis
create superuser role <name> [ extending <base> [, ...] ]
"{" <subcommand>; [...] "}" ;

# where <subcommand> is one of

  set password := <password>
```

## Alter role

Alter an existing role.

```edgeql-synopsis
alter role <name> "{" <subcommand>; [...] "}" ;

# where <subcommand> is one of

  rename to <newname>
  set password := <password>
  extending ...
```

## Drop role

Remove a role.

```edgeql-synopsis
drop role <name> ;
```

