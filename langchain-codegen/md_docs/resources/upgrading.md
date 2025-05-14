# Upgrading from v5

With the release of Gel v6, we have introduced a number of changes that affect your workflow. The most obvious change is that the CLI and client libraries are now named after Gel, not EdgeDB. But, there are a number of other smaller changes and enhancements that are worth understanding as you bring your EdgeDB database up-to-date with the latest release.

## CLI

For a few versions we’ve been shipping an alias to the edgedb CLI named gel as we’ve been working on the rename. For the most part, you can now just use gel instead of edgedb as the CLI name. Make sure you are using the latest version of the CLI by running gel cli upgrade. If you see a note about not being able to upgrade, you can try running edgedb cli upgrade and then after that gel cli upgrade.

Don’t forget to update any scripts that use the edgedb CLI to use gel instead.

## Project Configuration File

Gel CLI and client libraries use a configuration file configure various things about your project, such as the location of the schema directory, and the target version of the Gel server. Previously, this file was named edgedb.toml, but it is now named gel.toml.

In addition to the name change, we have also renamed the TOML table for configuring the server version from [edgedb] to [instance].

### (Before) edgedb.toml

```toml
[edgedb]
server-version = "5.7"
```

### (After) gel.toml

```toml-diff
- [edgedb]
+ [instance]
  server-version = "5.7"
```

We continue to support the old file and table name, but we recommend updating to the new name as soon as possible.

There are also a number of useful new workflow features in the CLI that are configured in this file that are worth exploring as well. See the announcement blog post for more details.

## Client Libraries

We’ve started publishing our various client libraries under Gel-flavored names, and will only be publishing to these new packages going forward.

| Language | New Package |
| --- | --- |
| Python | gel on PyPI |
| TypeScript | gel on npm |
| Go | gel-go on GitHub |
| Rust | gel-rust on GitHub |

If you’re using the TypeScript client library, you can use our codemod to automatically update your codebase to point at the new packages:

```bash
$ npx @gel/codemod@latest
```

## Code generation

Some of the languages we support include code generation tools that can generate code from your schema. Here is a table of how those tools have been renamed:

| Language | Previous | Current |
| --- | --- | --- |
| Python | edgedb-py | gel-py |
| TypeScript | @edgedb/generate | @gel/generate |

Check your project task runners and update them accordingly.

## Upgrading instances

To take advantage of the new features in Gel v6, you’ll need to upgrade your instances to the latest version.

## GitHub Action

We publish a GitHub action for accessing a Gel instance in your GitHub Actions workflows. This action has been updated to work with Gel v6. If you’re using the action in your workflow, update it to use the latest version.

```yaml-diff
- - uses: edgedb/setup-edgedb@v1
+ - uses: geldata/setup-gel@v1
- - run: edgedb query 'select sys::get_version_as_str()'
+ - run: gel query 'select sys::get_version_as_str()'
```

