# gel

Gel interactive shell:

```cli-synopsis
gel [<connection-option>...]
```

It’s also possible to run an EdgeQL script by piping it into the Gel shell. The shell will then run in non-interactive mode and print all the responses into the standard output:

```cli-synopsis
cat myscript.edgeql | gel [<connection-option>...]
```

The above command also works on PowerShell in Windows, while the classic Windows Command Prompt uses a different command as shown below:

```cli-synopsis
type myscript.edgeql | gel [<connection-option>...]
```

## Description

gel is a terminal-based front-end to Gel.  It allows running queries and seeing results interactively.

## Options

## Backslash Commands

