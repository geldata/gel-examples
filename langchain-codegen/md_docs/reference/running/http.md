# HTTP API

Gel provides HTTP endpoints that allow you to monitor the health and performance of your instance. You can use these endpoints to check if your instance is alive and ready to receive queries, as well as to collect metrics about its operation.

Your branch’s URL takes the form of http://<hostname>:<port>.

Here’s how to determine your local Gel instance’s HTTP server URL:

To determine the URL of a remote instance you have linked with the CLI, you can get both the hostname and port of the instance from the “Port” column of the gel instance list table (formatted as <hostname>:<port>).

## Health Checks

Gel exposes endpoints to check for aliveness and readiness of your database instance.

## Observability

Retrieve instance metrics.

```default
http://<hostname>:<port>/metrics
```

All Gel instances expose a Prometheus-compatible endpoint available via GET request. The following metrics are made available.

