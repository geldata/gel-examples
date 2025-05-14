# gel branch rebase

Create a branch based on the target branch but including new migrations on the current branch.

```cli-synopsis
gel branch rebase [<options>] <name>
```

## Description

Creates a new branch that is based on the target branch, but also contains any new migrations on the current branch.

When rebasing, the data of the target branch is preserved. This means that if you switch to a branch feature and run gel branch rebase main, you will end up with a branch with the schema from main and any new migrations from feature and the data from main.

For more about how rebasing works, check out the breakdown in our schema migrations guide.

## Options

The branch rebase command runs in the Gel instance it is connected to. For specifying the connection target see connection options.

