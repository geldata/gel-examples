# gel migration create

The next step after setting up the desired target schema is creating a migration script. This is done by invoking the following command:

```cli-synopsis
gel migration create [<options>]
```

This will start an interactive tool that will provide the user with suggestions based on the differences between the current branch and the schema file. The prompts will look something like this:

```default
did you create object type 'default::User'? [y,n,l,c,b,s,q,?]
?

y - confirm the prompt, use the DDL statements
n - reject the prompt
l - list the DDL statements associated with prompt
c - list already confirmed EdgeQL statements
b - revert back to previous save point, perhaps previous question
s - stop and save changes (splits migration into multiple)
q - quit without saving changes
h or ? - print help
```

## Options

The migration create command runs on the database it is connected to. For specifying the connection target see connection options.

