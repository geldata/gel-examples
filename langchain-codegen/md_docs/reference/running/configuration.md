# Configuration

The behavior of the Gel server is configurable with sensible defaults. Some configuration can be set on the running instance using configuration parameters, while other configuration is set at startup using environment variables or command line arguments to the gel-server binary.

## Configuration parameters

Gel exposes a number of configuration parameters that affect its behavior.  In this section we review the ways to change the server configuration, as well as detail each available configuration parameter.

## Configuration parameters

## Environment variables

Certain behaviors of the Gel server are configured at startup. This configuration can be set with environment variables. The variables documented on this page are supported when using the gel-server binary or the official Docker image.

Some environment variables (noted below) support _FILE and _ENV variants.

For Gel versions before 6.0 the prefix for all environment variables is EDGEDB_ instead of GEL_.

## Docker image specific variables

These variables are only used by the Docker image. Setting these variables outside that context will have no effect.

