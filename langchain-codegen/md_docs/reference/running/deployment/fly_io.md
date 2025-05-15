# Fly.io

In this guide we show how to deploy Gel using a Fly.io PostgreSQL cluster as the backend. The deployment consists of two apps: one running Postgres and the other running Gel.

Gel Cloud: The easiest way to run Gel Gel Cloud is the official hosted service managed by the Gel team, offering the simplest and most reliable way to run Gel in production. While self-hosting is possible (as shown in these guides), Gel Cloud provides a seamlessly integrated experience with perfect compatibility between local development and production environments. It includes a generous free tier, Vercel and GitHub (deploy previews work out of the box), a hosted UI, and using it directly supports the development of Gel itself! Try Gel Cloud today at cloud.geldata.com

## Prerequisites

## Provision a Fly.io app for Gel

Every Fly.io app must have a globally unique name, including service VMs like Postgres and Gel. Pick a name and assign it to a local environment variable called EDB_APP. In the command below, replace myorg-gel with a name of your choosing.

```bash
$ EDB_APP=myorg-gel
$ flyctl apps create --name $EDB_APP
New app created: myorg-gel
```

Now let’s use the read command to securely assign a value to the PASSWORD environment variable.

```bash
$ echo -n "> " && read -s PASSWORD
```

Now let’s assign this password to a Fly secret, plus a few other secrets that we’ll need. There are a couple more environment variables we need to set:

```bash
$ flyctl secrets set \
    GEL_SERVER_PASSWORD="$PASSWORD" \
    GEL_SERVER_BACKEND_DSN_ENV=DATABASE_URL \
    GEL_SERVER_TLS_CERT_MODE=generate_self_signed \
    GEL_SERVER_PORT=8080 \
    --app $EDB_APP
Secrets are staged for the first deployment
```

Let’s discuss what’s going on with all these secrets.

Finally, let’s configure the VM size as Gel requires a little bit more than the default Fly.io VM side provides. Put this in a file called fly.toml in your current directory.:

```yaml
[build]
  image = "geldata/gel"

[[vm]]
  memory = "512mb"
  cpus = 1
  cpu-kind = "shared"
```

## Create a PostgreSQL cluster

Now we need to provision a PostgreSQL cluster and attach it to the Gel app.

If you have an existing PostgreSQL cluster in your Fly.io organization, you can skip to the attachment step.

Then create a new PostgreSQL cluster. This may take a few minutes to complete.

```bash
$ PG_APP=myorg-postgres
$ flyctl pg create --name $PG_APP --vm-size shared-cpu-1x
? Select region: sea (Seattle, Washington (US))
? Specify the initial cluster size: 1
? Volume size (GB): 10
Creating postgres cluster myorg-postgres in organization personal
Postgres cluster myorg-postgres created
    Username:    postgres
    Password:    <random password>
    Hostname:    myorg-postgres.internal
    Proxy Port:  5432
    PG Port: 5433
Save your credentials in a secure place, you won't be able to see them
again!
Monitoring Deployment
...
--> v0 deployed successfully
```

In the output, you’ll notice a line that says Machine <machine-id> is created. The ID in that line is the ID of the virtual machine created for your Postgres cluster. We now need to use that ID to scale the cluster since the shared-cpu-1x VM doesn’t have enough memory by default. Scale it with this command:

```bash
$ flyctl machine update <machine-id> --memory 1024 --app $PG_APP -y
Searching for image 'flyio/postgres:14.6' remotely...
image found: img_0lq747j0ym646x35
Image: registry-1.docker.io/flyio/postgres:14.6
Image size: 361 MB

Updating machine <machine-id>
  Waiting for <machine-id> to become healthy (started, 3/3)
Machine <machine-id> updated successfully!
==> Monitoring health checks
  Waiting for <machine-id> to become healthy (started, 3/3)
...
```

With the VM scaled sufficiently, we can now attach the PostgreSQL cluster to the Gel app:

```bash
$ PG_ROLE=myorg_gel
$ flyctl pg attach "$PG_APP" \
    --database-user "$PG_ROLE" \
    --app $EDB_APP
Postgres cluster myorg-postgres is now attached to myorg-gel
The following secret was added to myorg-gel:
  DATABASE_URL=postgres://...
```

Lastly, Gel needs the ability to create Postgres databases and roles, so let’s adjust the permissions on the role that Gel will use to connect to Postgres:

```bash
$ echo "alter role \"$PG_ROLE\" createrole createdb; \quit" \
    | flyctl pg connect --app $PG_APP
...
ALTER ROLE
```

## Start Gel

Everything is set! Time to start Gel.

```bash
$ flyctl deploy --remote-only --app $EDB_APP
...
Finished launching new machines
-------
 ✔ Machine e286630dce9638 [app] was created
-------
```

That’s it!  You can now start using the Gel instance located at gel://myorg-gel.internal in your Fly.io apps.

If deploy did not succeed:

## Persist the generated TLS certificate

Now we need to persist the auto-generated TLS certificate to make sure it survives Gel app restarts. (If you’ve provided your own certificate, skip this step).

```bash
$ EDB_SECRETS="GEL_SERVER_TLS_KEY GEL_SERVER_TLS_CERT"
$ flyctl ssh console --app $EDB_APP -C \
    "gel-show-secrets.sh --format=toml $EDB_SECRETS" \
  | tr -d '\r' | flyctl secrets import --app $EDB_APP
```

## Connecting to the instance

Let’s construct the DSN (AKA “connection string”) for our instance. DSNs have the following format: gel://<username>:<password>@<hostname>:<port>. We can construct the DSN with the following components:

We can construct this value and assign it to a new environment variable called DSN.

```bash
$ DSN=gel://admin:$PASSWORD@$EDB_APP.internal:8080
```

Consider writing it to a file to ensure the DSN looks correct. Remember to delete the file after you’re done. (Printing this value to the terminal with echo is insecure and can leak your password into shell logs.)

```bash
$ echo $DSN > dsn.txt
$ open dsn.txt
$ rm dsn.txt
```

## Health Checks

Using an HTTP client, you can perform health checks to monitor the status of your Gel instance. Learn how to use them with our health checks guide.

