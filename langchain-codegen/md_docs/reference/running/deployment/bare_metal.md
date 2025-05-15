# Bare Metal

In this guide we show how to deploy Gel to bare metal using your system’s package manager and systemd.

Gel Cloud: The easiest way to run Gel Gel Cloud is the official hosted service managed by the Gel team, offering the simplest and most reliable way to run Gel in production. While self-hosting is possible (as shown in these guides), Gel Cloud provides a seamlessly integrated experience with perfect compatibility between local development and production environments. It includes a generous free tier, Vercel and GitHub (deploy previews work out of the box), a hosted UI, and using it directly supports the development of Gel itself! Try Gel Cloud today at cloud.geldata.com

## Install the Gel Package

The steps for installing the Gel package will be slightly different depending on your Linux distribution. Once you have the package installed you can jump to Enable a systemd unit.

## Enable a systemd unit

The Gel package comes bundled with a systemd unit that is disabled by default. You can start the server by enabling the unit.

```bash
$ sudo systemctl enable --now gel-server-6
```

This will start the server on port 5656, and the data directory will be /var/lib/gel/6/data.

## Set environment variables

To set environment variables when running Gel with systemctl,

```bash
$ systemctl edit --full gel-server-6
```

This opens a systemd unit file. Set the desired environment variables under the [Service] section. View the supported environment variables at Reference > Environment Variables.

```toml
[Service]
Environment="GEL_SERVER_TLS_CERT_MODE=generate_self_signed"
Environment="GEL_SERVER_ADMIN_UI=enabled"
```

Save the file and exit, then restart the service.

```bash
$ systemctl restart gel-server-6
```

## Set a password

There is no default password. To set one, you will first need to get the Unix socket directory. You can find this by looking at your system.d unit file.

```bash
$ sudo systemctl cat gel-server-6
```

Set a password by connecting from localhost.

```bash
$ echo -n "> " && read -s PASSWORD
$ RUNSTATE_DIR=$(systemctl show gel-server-6 -P ExecStart | \
   grep -o -m 1 -- "--runstate-dir=[^ ]\+" | \
   awk -F "=" '{print $2}')
$ sudo gel --port 5656 --tls-security insecure --admin \
   --unix-path $RUNSTATE_DIR \
   query "ALTER ROLE admin SET password := '$PASSWORD'"
```

The server listens on localhost by default. Changing this looks like this.

```bash
$ gel --port 5656 --tls-security insecure --password query \
   "CONFIGURE INSTANCE SET listen_addresses := {'0.0.0.0'};"
```

The listen port can be changed from the default 5656 if your deployment scenario requires a different value.

```bash
$ gel --port 5656 --tls-security insecure --password query \
   "CONFIGURE INSTANCE SET listen_port := 1234;"
```

You may need to restart the server after changing the listen port or addresses.

```bash
$ sudo systemctl restart gel-server-6
```

## Link the instance with the CLI

The following is an example of linking a bare metal instance that is running on localhost. This command assigns a name to the instance, to make it more convenient to refer to when running CLI commands.

```bash
$ gel instance link \
   --host localhost \
   --port 5656 \
   --user admin \
   --branch main \
   --trust-tls-cert \
   bare_metal_instance
```

This allows connecting to the instance with its name.

```bash
$ gel -I bare_metal_instance
```

## Upgrading Gel

The command groups gel instance and gel project are not intended to manage production instances.

When you want to upgrade to the newest point release upgrade the package and restart the gel-server-6 unit.

## Health Checks

Using an HTTP client, you can perform health checks to monitor the status of your Gel instance. Learn how to use them with our health checks guide.

