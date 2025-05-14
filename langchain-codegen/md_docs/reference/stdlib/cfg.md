# Config

The cfg module contains a set of types and scalars used for configuring Gel.

| --- | --- |
| Type | Description |
| cfg::AbstractConfig | The abstract base type for all configuration objects. The properties of this type define the set of configuruation settings supported by Gel. |
| cfg::Config | The main configuration object. The properties of this object reflect the overall configuration setting from instance level all the way to session level. |
| cfg::DatabaseConfig | The database configuration object. It reflects all the applicable configuration at the Gel database level. |
| cfg::BranchConfig | The database branch configuration object. It reflects all the applicable configuration at the Gel branch level. |
| cfg::InstanceConfig | The instance configuration object. |
| cfg::ExtensionConfig | The abstract base type for all extension configuration objects. Each extension can define the necessary configuration settings by extending this type and adding the extension-specific properties. |
| cfg::Auth | An object type representing an authentication profile. |
| cfg::ConnectionTransport | An enum type representing the different protocols that Gel speaks. |
| cfg::AuthMethod | An abstract object type representing a method of authentication |
| cfg::Trust | A subclass of AuthMethod indicating an “always trust” policy (no authentication). |
| cfg::SCRAM | A subclass of AuthMethod indicating password-based authentication. |
| cfg::Password | A subclass of AuthMethod indicating basic password-based authentication. |
| cfg::JWT | A subclass of AuthMethod indicating token-based authentication. |
| cfg::memory | A scalar type for storing a quantity of memory storage. |

Type: type
Domain: eql
Summary: An abstract type representing the configuration of an instance or database.
Signature: type cfg::AbstractConfig


An abstract type representing the configuration of an instance or database.

The properties of this object type represent the set of configuration options supported by Gel (listed above).

Type: type
Domain: eql
Summary: The main configuration object type.
Signature: type cfg::Config


The main configuration object type.

This type will have only one object instance. The cfg::Config object represents the sum total of the current Gel configuration. It reflects the result of applying instance, branch, and session level configuration. Examining this object is the recommended way of determining the current configuration.

Here’s an example of checking and disabling access policies:

```edgeql-repl
db> select cfg::Config.apply_access_policies;
{true}
db> configure session set apply_access_policies := false;
OK: CONFIGURE SESSION
db> select cfg::Config.apply_access_policies;
{false}
```

Type: type
Domain: eql
Summary: The branch-level configuration object type.
Signature: type cfg::BranchConfig


The branch-level configuration object type.

This type will have only one object instance. The cfg::BranchConfig object represents the state of the branch and instance-level Gel configuration.

For overall configuration state please refer to the cfg::Config instead.

Type: type
Domain: eql
Summary: The instance-level configuration object type.
Signature: type cfg::InstanceConfig


The instance-level configuration object type.

This type will have only one object instance. The cfg::InstanceConfig object represents the state of only instance-level Gel configuration.

For overall configuraiton state please refer to the cfg::Config instead.

Type: type
Domain: eql
Summary: An abstract type representing extension configuration.
Signature: type cfg::ExtensionConfig


An abstract type representing extension configuration.

Every extension is expected to define its own extension-specific config object type extending cfg::ExtensionConfig. Any necessary extension configuration setting should be represented as properties of this concrete config type.

Up to three instances of the extension-specific config type will be created, each of them with a required single link cfg to the cfg::Config, cfg::DatabaseConfig, or cfg::InstanceConfig object depending on the configuration level. The cfg::AbstractConfig exposes a corresponding computed multi-backlink called extensions.

For example, ext::pgvector extension exposes probes as a configurable parameter via ext::pgvector::Config object:

```edgeql-repl
db> configure session
... set ext::pgvector::Config::probes := 5;
OK: CONFIGURE SESSION
db> select cfg::Config.extensions[is ext::pgvector::Config]{*};
{
  ext::pgvector::Config {
    id: 12b5c70f-0bb8-508a-845f-ca3d41103b6f,
    probes: 5,
    ef_search: 40,
  },
}
```

Type: type
Domain: eql
Summary: An object type designed to specify a client authentication profile.
Signature: type cfg::Auth


An object type designed to specify a client authentication profile.

```edgeql-repl
db> configure instance insert
...   Auth {priority := 0, method := (insert Trust)};
OK: CONFIGURE INSTANCE
```

Below are the properties of the Auth class.

Type: type
Domain: eql
Summary: An enum listing the various protocols that Gel can speak.
Signature: type cfg::ConnectionTransport


An enum listing the various protocols that Gel can speak.

Possible values are:

| --- | --- |
| Value | Description |
| cfg::ConnectionTransport.TCP | Gel binary protocol |
| cfg::ConnectionTransport.TCP_PG | Postgres protocol for the SQL query mode |
| cfg::ConnectionTransport.HTTP | Gel binary protocol tunneled over HTTP |
| cfg::ConnectionTransport.SIMPLE_HTTP | EdgeQL over HTTP and GraphQL endpoints |

Type: type
Domain: eql
Summary: An abstract object class that represents an authentication method.
Signature: type cfg::AuthMethod


An abstract object class that represents an authentication method.

It currently has four concrete subclasses, each of which represent an available authentication method: cfg::SCRAM, cfg::JWT, cfg::Password, and cfg::Trust.

Type: type
Domain: eql
Summary: The cfg::Trust indicates an "always-trust" policy.
Signature: type cfg::Trust


The cfg::Trust indicates an “always-trust” policy.

When active, it disables password-based authentication.

```edgeql-repl
db> configure instance insert
...   Auth {priority := 0, method := (insert Trust)};
OK: CONFIGURE INSTANCE
```

Type: type
Domain: eql
Summary: cfg::SCRAM indicates password-based authentication.
Signature: type cfg::SCRAM


cfg::SCRAM indicates password-based authentication.

It uses a challenge-response scheme to avoid transmitting the password directly.  This policy is implemented via SCRAM-SHA-256

It is available for the TCP, TCP_PG, and HTTP transports and is the default for TCP and TCP_PG.

```edgeql-repl
db> configure instance insert
...   Auth {priority := 0, method := (insert SCRAM)};
OK: CONFIGURE INSTANCE
```

Type: type
Domain: eql
Summary: cfg::JWT uses a JWT signed by the server to authenticate.
Signature: type cfg::JWT


cfg::JWT uses a JWT signed by the server to authenticate.

It is available for the TCP, HTTP, and HTTP_SIMPLE transports and is the default for HTTP.

Type: type
Domain: eql
Summary: cfg::Password indicates simple password-based authentication.
Signature: type cfg::Password


cfg::Password indicates simple password-based authentication.

Unlike cfg::SCRAM, this policy transmits the password over the (encrypted) channel.  It is implemened using HTTP Basic Authentication over TLS.

This policy is available only for the SIMPLE_HTTP transport, where it is the default.

Type: type
Domain: eql
Summary: A scalar type representing a quantity of memory storage.
Signature: type cfg::memory


A scalar type representing a quantity of memory storage.

As with uuid, datetime, and several other types, cfg::memory values are declared by casting from an appropriately formatted string.

```edgeql-repl
db> select <cfg::memory>'1B'; # 1 byte
{<cfg::memory>'1B'}
db> select <cfg::memory>'5KiB'; # 5 kibibytes
{<cfg::memory>'5KiB'}
db> select <cfg::memory>'128MiB'; # 128 mebibytes
{<cfg::memory>'128MiB'}
```

The numerical component of the value must be a non-negative integer; the units must be one of B|KiB|MiB|GiB|TiB|PiB. We’re using the explicit KiB unit notation (1024 bytes) instead of kB (which is ambiguous, and may mean 1000 or 1024 bytes).

