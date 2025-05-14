# Connection parameters

The CLI and client libraries (collectively referred to as “clients” below) must connect to a Gel instance to run queries or commands. Ultimately, configuration works to specify a specific Gel branch on a specific Gel instance, and any required credentials. Additionally, client connection behavior can also be specified.

There are multiple places where the configuration can be specified, and the clients all share the same resolution logic and priority order. Let’s first look at how to specify the connection configuration, and then we’ll look at the different environments your own applications may run in and what the common practices are for specifying the configuration for each type of environment.

## Connecting to a Gel branch

The first job of the configuration system is to specify a Gel branch on a specific Gel instance. The parts that make up the full configuration are:

There are several ways to specify these parameters:

## Environments

There are two common scenarios or environments for applications connecting to a Gel branch:

## Priority levels

The section above describes the various ways of specifying a Gel instance.  There are also several ways to provide this configuration information to the client. From highest to lowest priority, you can pass them explicitly as parameters/flags (useful for debugging), use environment variables (recommended for production), or rely on gel project (recommended for development).

If no connection information can be detected using the above mechanisms, the connection fails.

## Parameter Reference

The following is a list of all of the connection parameters and their corresponding environment variables, CLI flags, and client library parameters. Different language clients may have different parameter casing depending on the idiomatic conventions of the language, so see the specific client documentation for details.

