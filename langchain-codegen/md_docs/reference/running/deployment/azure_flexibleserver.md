# Azure

Gel Cloud: The easiest way to run Gel Gel Cloud is the official hosted service managed by the Gel team, offering the simplest and most reliable way to run Gel in production. While self-hosting is possible (as shown in these guides), Gel Cloud provides a seamlessly integrated experience with perfect compatibility between local development and production environments. It includes a generous free tier, Vercel and GitHub (deploy previews work out of the box), a hosted UI, and using it directly supports the development of Gel itself! Try Gel Cloud today at cloud.geldata.com

In this guide we show how to deploy Gel using Azure’s Postgres Flexible Server as the backend.

## Prerequisites

## Provision a Gel instance

Login to your Microsoft Azure account.

```bash
$ az login
```

Create a new resource group.

```bash
$ GROUP=my-group-name
$ az group create --name $GROUP --location westus
```

Provision a PostgreSQL server.

If you already have a database provisioned you can skip this step.

For convenience, assign a value to the PG_SERVER_NAME environment variable; we’ll use this variable in multiple later commands.

```bash
$ PG_SERVER_NAME=postgres-for-gel
```

Use the read command to securely assign a value to the PASSWORD environment variable.

```bash
$ echo -n "> " && read -s PASSWORD
```

Then create a Postgres Flexible server.

```bash
$ az postgres flexible-server create \
    --resource-group $GROUP \
    --name $PG_SERVER_NAME \
    --location westus \
    --admin-user gel_admin \
    --admin-password $PASSWORD \
    --sku-name Standard_D2s_v3 \
    --version 14 \
    --yes
```

If you get an error saying "Specified server name is already used." change the value of PG_SERVER_NAME and rerun the command.

Allow other Azure services access to the Postgres instance.

```bash
$ az postgres flexible-server firewall-rule create \
    --resource-group $GROUP \
    --name $PG_SERVER_NAME \
    --rule-name allow-azure-internal \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0
```

Gel requires Postgres’ uuid-ossp extension which needs to be enabled.

```bash
$ az postgres flexible-server parameter set \
    --resource-group $GROUP \
    --server-name $PG_SERVER_NAME \
    --name azure.extensions \
    --value uuid-ossp
```

Azure is not able to reliably pull docker images because of rate limits, so you will need to provide docker hub login credentials to create a container. If you don’t already have a docker hub account you can create one here.

```bash
$ echo -n "docker user> " && read -s DOCKER_USER
$ echo -n "docker password> " && read -s DOCKER_PASSWORD
```

Start a Gel container.

```bash
$ PG_HOST=$(
    az postgres flexible-server list \
      --resource-group $GROUP \
      --query "[?name=='$PG_SERVER_NAME'].fullyQualifiedDomainName | [0]" \
      --output tsv
  )
$ DSN="postgresql://gel_admin:$PASSWORD@$PG_HOST/postgres?sslmode=require"
$ az container create \
    --registry-username $DOCKER_USER \
    --registry-password $DOCKER_PASSWORD \
    --registry-login-server index.docker.io \
    --os-type Linux \
    --cpu 1 \
    --memory 1 \
    --resource-group $GROUP \
    --name gel-container-group \
    --image geldata/gel \
    --dns-name-label geldb \
    --ports 5656 \
    --secure-environment-variables \
      "GEL_SERVER_PASSWORD=$PASSWORD" \
      "GEL_SERVER_BACKEND_DSN=$DSN" \
    --environment-variables \
      GEL_SERVER_TLS_CERT_MODE=generate_self_signed
```

Persist the SSL certificate. We have configured Gel to generate a self signed SSL certificate when it starts. However, if the container is restarted a new certificate would be generated. To preserve the certificate across failures or reboots copy the certificate files and use their contents in the GEL_SERVER_TLS_KEY and GEL_SERVER_TLS_CERT environment variables.

```bash
$ key="$( az container exec \
            --resource-group $GROUP \
            --name gel-container-group \
            --exec-command "cat /tmp/gel/edbprivkey.pem" \
          | tr -d "\r" )"
$ cert="$( az container exec \
             --resource-group $GROUP \
             --name gel-container-group \
             --exec-command "cat /tmp/gel/edbtlscert.pem" \
          | tr -d "\r" )"
$ az container delete \
    --resource-group $GROUP \
    --name gel-container-group \
    --yes
$ az container create \
    --registry-username $DOCKER_USER \
    --registry-password $DOCKER_PASSWORD \
    --registry-login-server index.docker.io \
    --os-type Linux \
    --cpu 1 \
    --memory 1 \
    --resource-group $GROUP \
    --name gel-container-group \
    --image geldata/gel \
    --dns-name-label geldb \
    --ports 5656 \
    --secure-environment-variables \
      "GEL_SERVER_PASSWORD=$PASSWORD" \
      "GEL_SERVER_BACKEND_DSN=$DSN" \
      "GEL_SERVER_TLS_KEY=$key" \
    --environment-variables \
      "GEL_SERVER_TLS_CERT=$cert"
```

To access the Gel instance you’ve just provisioned on Azure from your local machine link the instance.

```bash
$ printf $PASSWORD | gel instance link \
    --password-from-stdin \
    --non-interactive \
    --trust-tls-cert \
    --host $( \
      az container list \
        --resource-group $GROUP \
        --query "[?name=='gel-container-group'].ipAddress.fqdn | [0]" \
        --output tsv ) \
    azure
```

The command groups gel instance and gel project are not intended to manage production instances.

You can now connect to your instance.

```bash
$ gel -I azure
```

## Health Checks

Using an HTTP client, you can perform health checks to monitor the status of your Gel instance. Learn how to use them with our health checks guide.

