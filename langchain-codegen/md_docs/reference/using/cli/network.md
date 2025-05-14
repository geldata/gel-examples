# Network usage

Generally command-line tools connect only to the database host with a few exceptions:

## Version Check

Version check checks the current version of command-line tool by fetching https://packages.geldata.com/.jsonindexes/*.json.

Here is how such a request looks like:

```default
GET /archive/.jsonindexes/linux-x86_64.json HTTP/1.1
host: packages.geldata.com
content-length: 0
user-agent: gel
```

The User-Agent header only specifies that request is done by gel command-line tool (without version number). The platform, architecture and whether nightly is used can be devised from the URL of the query.

Latest version number is cached for the random duration from 16 to 32 hours (this randomization is done both for spreading the load and for better anonymizing the data). A failure is cached for the random duration from 6 to 12 hours.

## Disabling Version Check

To disable version check do one of two things:

To verify that check is skipped and no network access is being done logging facility can be used:

```default
$ export RUST_LOG=edgedb::version_check=debug
$ gel --no-cli-update-check
[..snip..] Skipping version check due to --no-cli-update-check
gel>
$ GEL_RUN_VERSION_CHECK=never gel
[..snip..] Skipping version check due to GEL_RUN_VERSION_CHECK=never
gel>
```

## “gel server” and “gel self upgrade”

Generally these commands do requests with exactly the headers like version check.

Data sources for the commands directly:

Data sources that can be used indirectly:

To avoid reaching these hosts, avoid using: gel server and gel self upgrade subcommands. These commands only simplify installation and maintenance of the installations. All Gel features are available without using them.

