# Docker

Gel Cloud: The easiest way to run Gel Gel Cloud is the official hosted service managed by the Gel team, offering the simplest and most reliable way to run Gel in production. While self-hosting is possible (as shown in these guides), Gel Cloud provides a seamlessly integrated experience with perfect compatibility between local development and production environments. It includes a generous free tier, Vercel and GitHub (deploy previews work out of the box), a hosted UI, and using it directly supports the development of Gel itself! Try Gel Cloud today at cloud.geldata.com

## When to use the “geldata/gel” Docker image

This image is primarily intended to be used directly when there is a requirement to use Docker containers, such as in production, or in a development setup that involves multiple containers orchestrated by Docker Compose or a similar tool. Otherwise, using the gel server CLI on the host system is the recommended way to install and run Gel servers.

## How to use this image

The simplest way to run the image (without data persistence) is this:

```bash
$ docker run --name gel -d \
    -e GEL_SERVER_SECURITY=insecure_dev_mode \
    geldata/gel
```

See the Configuration section below for the meaning of the GEL_SERVER_SECURITY variable and other options.

Then, to authenticate to the Gel instance and store the credentials in a Docker volume, run:

```bash
$ docker run -it --rm --link=gel \
    -e GEL_SERVER_PASSWORD=secret \
    -v gel-cli-config:/.config/edgedb geldata/gel-cli \
    -H gel instance link my_instance \
        --tls-security insecure \
        --non-interactive
```

Now, to open an interactive shell to the database instance run this:

```bash
$ docker run -it --rm --link=gel \
    -v gel-cli-config:/.config/edgedb geldata/gel-cli \
    -I my_instance
```

## Data Persistence

If you want the contents of the database to survive container restarts, you must mount a persistent volume at the path specified by GEL_SERVER_DATADIR (/var/lib/gel/data by default).  For example:

```bash
$ docker run \
    --name gel \
    -e GEL_SERVER_PASSWORD=secret \
    -e GEL_SERVER_TLS_CERT_MODE=generate_self_signed \
    -v /my/data/directory:/var/lib/gel/data \
    -d geldata/gel
```

Note that on Windows you must use a Docker volume instead:

```bash
$ docker volume create --name=gel-data
$ docker run \
    --name gel \
    -e GEL_SERVER_PASSWORD=secret \
    -e GEL_SERVER_TLS_CERT_MODE=generate_self_signed \
    -v gel-data:/var/lib/gel/data \
    -d geldata/gel
```

It is also possible to run a gel container on a remote PostgreSQL cluster specified by GEL_SERVER_BACKEND_DSN. See below for details.

## Schema Migrations

A derived image may include application schema and migrations in /dbschema, in which case the container will attempt to apply the schema migrations found in /dbschema/migrations, unless the GEL_DOCKER_APPLY_MIGRATIONS environment variable is set to never.

## Docker Compose

A simple docker-compose configuration might look like this. With a docker-compose.yaml containing:

```yaml
services:
  gel:
    image: geldata/gel
    environment:
      GEL_SERVER_SECURITY: insecure_dev_mode
    volumes:
      - "./dbschema:/dbschema"
    ports:
      - "5656:5656"
```

Once there is a schema in dbschema/ a migration can be created with:

```bash
$ gel --tls-security=insecure -P 5656 migration create
```

Alternatively, if you don’t have the Gel CLI installed on your host machine, you can use the CLI bundled with the server container:

```bash
$ docker compose exec gel \
    gel --tls-security=insecure -P 5656 migration create
```

## Configuration

The Docker image supports the same set of enviroment variables as the Gel server process, which are documented under Reference > Environment Variables.

Gel containers can be additionally configured using initialization scripts and some Docker-specific environment variables, documented below.

Some variables support _ENV and _FILE variants to support more advanced configurations.

## Health Checks

Using an HTTP client, you can perform health checks to monitor the status of your Gel instance. Learn how to use them with our health checks guide.

