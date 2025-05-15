# Backend high-availability

High availability is a sophisticated and systematic challenge, especially for databases. To address the problem, Gel server now supports selected highly-available backend Postgres clusters, namely in 2 categories:

When the backend HA feature is enabled in Gel, Gel server will try its best to detect and react to backend failovers, whether a proper API is available or not.

During backend failover, no frontend connections will be closed; instead, all incoming queries will fail with a retryable error until failover has completed successfully. If the query originates from a client that supports retrying transactions, these queries may be retried by the client until the backend connection is restored and the query can be properly resolved.

## API-based HA

Gel server accepts different types of backends by looking into the protocol of the --backend-dsn command-line parameter. Gel supports the following DSN protocols currently:

When using these protocols, Gel builds the actual DSN of the cluster’s leader node by calling the corresponding API using credentials in the --backend-dsn and subscribes to that API for failover events. Once failover is detected, Gel drops all backend connections and routes all new backend connections to the new leader node.

Stolon is an open-source cloud native PostgreSQL manager for PostgreSQL high availability. Currently, Gel supports using a Stolon cluster as the backend in a Consul-based setup, where Gel acts as a Stolon proxy. This way, you only need to manage Stolon sentinels and keepers, plus a Consul deployment. To use a Stolon cluster, run Gel server with a DSN, like so:

```bash
$ gel-server \
    --backend-dsn stolon+consul+http://localhost:8500/my-cluster
```

Gel will connect to the Consul HTTP service at localhost:8500, and subscribe to the updates of the cluster named my-cluster.

Using a regular postgres:// DSN disables API-based HA.

## Adaptive HA

Gel also supports DNS-based generic HA backends. This may be a cloud database with multi-AZ failover or some custom HA Postgres cluster that keeps a DNS name always resolved to the leader node. Adaptive HA can be enabled with a switch in addition to a regular backend DSN:

```bash
$ gel-server \
    --backend-dsn postgres://xxx.rds.amazonaws.com \
    --enable-backend-adaptive-ha
```

Once enabled, Gel server will keep track of unusual backend events like unexpected disconnects or Postgres shutdown notifications. When a threshold is reached, Gel considers the backend to be in the “failover” state. It then drops all current backend connections and try to re-establish new connections with the same backend DSN. Because Gel doesn’t cache resolved DNS values, the new connections will be established with the new leader node.

Under the hood of adaptive HA, Gel maintains a state machine to avoid endless switch-overs in an unstable network. State changes only happen when certain conditions are met.

Set of possible states:

Rules of state switches:

Unhealthy -> Healthy

Unhealthy -> Failover

Healthy -> Unhealthy

Healthy -> Failover

Failover -> Healthy

(“pgcon” is a code name for backend connections, and “sys_pgcon” is a special backend connection which Gel uses to talk to the “Gel system database”.)

