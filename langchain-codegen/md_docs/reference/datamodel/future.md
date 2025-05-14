# Future behavior

This article explains what the using future ...; statement means in your schema.

Our goal is to make Gel the best database system in the world, which requires us to keep evolving. Usually, we can add new functionality while preserving backward compatibility, but on rare occasions we must implement changes that require elaborate transitions.

To handle these cases, we introduce future behavior, which lets you try out upcoming features before a major release. Sometimes enabling a future is necessary to fix current issues; other times it offers a safe and easy way to ensure your codebase remains compatible. This approach provides more time to adopt a new feature and identify any resulting bugs.

Any time a behavior is available as a future, all new projects enable it by default for empty databases. You can remove a future from your schema if absolutely necessary, but doing so is discouraged. Existing projects are unaffected by default, so you must manually add the future specification to gain early access.

## Flags

At the moment there are three future flags available:

## Declaring future flags

## DDL commands

This section describes the low-level DDL commands for creating and dropping future flags. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

