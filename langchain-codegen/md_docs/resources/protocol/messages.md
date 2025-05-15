# Messages

| --- | --- |
| Server Messages |  |
| AuthenticationOK | Authentication is successful. |
| AuthenticationSASL | SASL authentication is required. |
| AuthenticationSASLContinue | SASL authentication challenge. |
| AuthenticationSASLFinal | SASL authentication final message. |
| CommandComplete | Successful completion of a command. |
| CommandDataDescription | Description of command data input and output. |
| StateDataDescription | Description of state data. |
| Data | Command result data element. |
| Dump Header | Initial message of the database backup protocol |
| Dump Block | Single chunk of database backup data |
| ErrorResponse | Server error. |
| LogMessage | Server log message. |
| ParameterStatus | Server parameter value. |
| ReadyForCommand | Server is ready for a command. |
| RestoreReady | Successful response to the Restore message |
| ServerHandshake | Initial server connection handshake. |
| ServerKeyData | Opaque token identifying the server connection. |
| Client Messages |  |
| AuthenticationSASLInitialResponse | SASL authentication initial response. |
| AuthenticationSASLResponse | SASL authentication response. |
| ClientHandshake | Initial client connection handshake. |
| Dump | Initiate database backup |
| Parse | Parse EdgeQL command(s). |
| Execute | Parse and/or execute a query. |
| Restore | Initiate database restore |
| RestoreBlock | Next block of database dump |
| RestoreEof | End of database dump |
| Sync | Provide an explicit synchronization point. |
| Terminate | Terminate the connection. |

## ErrorResponse

Sent by: server.

Format:

```c
struct ErrorResponse {
  // Message type ('E').
  uint8           mtype = 0x45;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Message severity.
  uint8<ErrorSeverity> severity;

  // Message code.
  uint32          error_code;

  // Error message.
  string          message;

  // Error attributes.
  uint16          num_attributes;
  KeyValue        attributes[num_attributes];
};
```

```c
enum ErrorSeverity {
  ERROR           = 0x78;
  FATAL           = 0xc8;
  PANIC           = 0xff;
};
```

See the list of error codes for all possible error codes.

Known attributes:

Notes:

## LogMessage

Sent by: server.

Format:

```c
struct LogMessage {
  // Message type ('L').
  uint8           mtype = 0x4c;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Message severity.
  uint8<MessageSeverity> severity;

  // Message code.
  uint32          code;

  // Message text.
  string          text;

  // Message annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];
};
```

```c
enum MessageSeverity {
  DEBUG           = 0x14;
  INFO            = 0x28;
  NOTICE          = 0x3c;
  WARNING         = 0x50;
};
```

See the list of error codes for all possible log message codes.

## ReadyForCommand

Sent by: server.

Format:

```c
struct ReadyForCommand {
  // Message type ('Z').
  uint8           mtype = 0x5a;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];

  // Transaction state.
  uint8<TransactionState> transaction_state;
};
```

```c
enum TransactionState {
  NOT_IN_TRANSACTION = 0x49;
  IN_TRANSACTION  = 0x54;
  IN_FAILED_TRANSACTION = 0x45;
};
```

```c
struct Annotation {
  // Name of the annotation
  string          name;

  // Value of the annotation (in JSON
  // format).
  string          value;
};
```

## RestoreReady

Sent by: server.

Initial Restore message accepted, ready to receive data. See Restore Flow.

Format:

```c
struct RestoreReady {
  // Message type ('+').
  uint8           mtype = 0x2b;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];

  // Number of parallel jobs for restore,
  // currently always "1"
  uint16          jobs;
};
```

```c
struct Annotation {
  // Name of the annotation
  string          name;

  // Value of the annotation (in JSON
  // format).
  string          value;
};
```

## CommandComplete

Sent by: server.

Format:

```c
struct CommandComplete {
  // Message type ('C').
  uint8           mtype = 0x43;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];

  // A bit mask of allowed capabilities.
  uint64<Capability> capabilities;

  // Command status.
  string          status;

  // State data descriptor ID.
  uuid            state_typedesc_id;

  // Encoded state data.
  bytes           state_data;
};
```

```c
struct Annotation {
  // Name of the annotation
  string          name;

  // Value of the annotation (in JSON
  // format).
  string          value;
};
```

## Dump

Sent by: client.

Initiates a database backup. See Dump Flow.

Format:

```c
struct Dump {
  // Message type ('>').
  uint8           mtype = 0x3e;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];

  // A bit mask of dump options.
  uint64<DumpFlag> flags;
};
```

```c
struct Annotation {
  // Name of the annotation
  string          name;

  // Value of the annotation (in JSON
  // format).
  string          value;
};
```

```c
enum DumpFlag {
  DUMP_SECRETS    = 0x1;
};
```

Use:

## CommandDataDescription

Sent by: server.

Format:

```c
struct CommandDataDescription {
  // Message type ('T').
  uint8           mtype = 0x54;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];

  // A bit mask of allowed capabilities.
  uint64<Capability> capabilities;

  // Actual result cardinality.
  uint8<Cardinality> result_cardinality;

  // Argument data descriptor ID.
  uuid            input_typedesc_id;

  // Argument data descriptor.
  bytes           input_typedesc;

  // Output data descriptor ID.
  uuid            output_typedesc_id;

  // Output data descriptor.
  bytes           output_typedesc;
};
```

```c
enum Cardinality {
  NO_RESULT       = 0x6e;
  AT_MOST_ONE     = 0x6f;
  ONE             = 0x41;
  MANY            = 0x6d;
  AT_LEAST_ONE    = 0x4d;
};
```

```c
struct Annotation {
  // Name of the annotation
  string          name;

  // Value of the annotation (in JSON
  // format).
  string          value;
};
```

The format of the input_typedesc and output_typedesc fields is described in the Type descriptors section.

## StateDataDescription

Sent by: server.

Format:

```c
struct StateDataDescription {
  // Message type ('s').
  uint8           mtype = 0x73;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Updated state data descriptor ID.
  uuid            typedesc_id;

  // State data descriptor.
  bytes           typedesc;
};
```

The format of the typedesc fields is described in the Type descriptors section.

## Sync

Sent by: client.

Format:

```c
struct Sync {
  // Message type ('S').
  uint8           mtype = 0x53;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;
};
```

## Restore

Sent by: client.

Initiate restore to the current branch. See Restore Flow.

Format:

```c
struct Restore {
  // Message type ('<').
  uint8           mtype = 0x3c;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of key-value pairs.
  uint16          num_attributes;
  KeyValue        attributes[num_attributes];

  // Number of parallel jobs for restore
  // (only "1" is supported)
  uint16          jobs;

  // Original DumpHeader packet data
  // excluding mtype and message_length
  bytes           header_data;
};
```

## RestoreBlock

Sent by: client.

Send dump file data block. See Restore Flow.

Format:

```c
struct RestoreBlock {
  // Message type ('=').
  uint8           mtype = 0x3d;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Original DumpBlock packet data excluding
  // mtype and message_length
  bytes           block_data;
};
```

## RestoreEof

Sent by: client.

Notify server that dump is fully uploaded. See Restore Flow.

Format:

```c
struct RestoreEof {
  // Message type ('.').
  uint8           mtype = 0x2e;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;
};
```

## Execute

Sent by: client.

Format:

```c
struct Execute {
  // Message type ('O').
  uint8           mtype = 0x4f;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];

  // A bit mask of allowed capabilities.
  uint64<Capability> allowed_capabilities;

  // A bit mask of query options.
  uint64<CompilationFlag> compilation_flags;

  // Implicit LIMIT clause on returned sets.
  uint64          implicit_limit;

  // Command source language.
  uint8<InputLanguage> input_language;

  // Data output format.
  uint8<OutputFormat> output_format;

  // Expected result cardinality.
  uint8<Cardinality> expected_cardinality;

  // Command text.
  string          command_text;

  // State data descriptor ID.
  uuid            state_typedesc_id;

  // Encoded state data.
  bytes           state_data;

  // Argument data descriptor ID.
  uuid            input_typedesc_id;

  // Output data descriptor ID.
  uuid            output_typedesc_id;

  // Encoded argument data.
  bytes           arguments;
};
```

```c
enum OutputFormat {
  BINARY          = 0x62;
  JSON            = 0x6a;
  JSON_ELEMENTS   = 0x4a;
  NONE            = 0x6e;
};
```

```c
struct Annotation {
  // Name of the annotation
  string          name;

  // Value of the annotation (in JSON
  // format).
  string          value;
};
```

Use:

The data in arguments must be encoded as a tuple value described by a type descriptor identified by input_typedesc_id.

```c
enum Cardinality {
  NO_RESULT       = 0x6e;
  AT_MOST_ONE     = 0x6f;
  ONE             = 0x41;
  MANY            = 0x6d;
  AT_LEAST_ONE    = 0x4d;
};
```

## Parse

Sent by: client.

```c
struct Parse {
  // Message type ('P').
  uint8           mtype = 0x50;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of annotations.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];

  // A bit mask of allowed capabilities.
  uint64<Capability> allowed_capabilities;

  // A bit mask of query options.
  uint64<CompilationFlag> compilation_flags;

  // Implicit LIMIT clause on returned sets.
  uint64          implicit_limit;

  // Command source language.
  uint8<InputLanguage> input_language;

  // Data output format.
  uint8<OutputFormat> output_format;

  // Expected result cardinality.
  uint8<Cardinality> expected_cardinality;

  // Command text.
  string          command_text;

  // State data descriptor ID.
  uuid            state_typedesc_id;

  // Encoded state data.
  bytes           state_data;
};
```

```c
enum Capability {
  MODIFICATIONS   = 0x1;
  SESSION_CONFIG  = 0x2;
  TRANSACTION     = 0x4;
  DDL             = 0x8;
  PERSISTENT_CONFIG = 0x10;
  ALL             = 0xffffffffffffffff;
};
```

```c
struct Annotation {
  // Name of the annotation
  string          name;

  // Value of the annotation (in JSON
  // format).
  string          value;
};
```

See RFC1004 for more information on capability flags.

```c
enum CompilationFlag {
  INJECT_OUTPUT_TYPE_IDS = 0x1;
  INJECT_OUTPUT_TYPE_NAMES = 0x2;
  INJECT_OUTPUT_OBJECT_IDS = 0x4;
};
```

Use:

```c
enum OutputFormat {
  BINARY          = 0x62;
  JSON            = 0x6a;
  JSON_ELEMENTS   = 0x4a;
  NONE            = 0x6e;
};
```

Use:

```c
enum Cardinality {
  NO_RESULT       = 0x6e;
  AT_MOST_ONE     = 0x6f;
  ONE             = 0x41;
  MANY            = 0x6d;
  AT_LEAST_ONE    = 0x4d;
};
```

## Data

Sent by: server.

Format:

```c
struct Data {
  // Message type ('D').
  uint8           mtype = 0x44;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Encoded output data array. The array is
  // currently always of size 1.
  uint16          num_data;
  DataElement     data[num_data];
};
```

```c
struct DataElement {
  // Encoded output data.
  uint32          num_data;
  uint8           data[num_data];
};
```

The exact encoding of DataElement.data is defined by the query output type descriptor.

Wire formats for the standard scalar types and collections are documented in Data wire formats.

## Dump Header

Sent by: server.

Initial message of database backup protocol. See Dump Flow.

Format:

```c
struct DumpHeader {
  // Message type ('@').
  uint8           mtype = 0x40;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of key-value pairs.
  uint16          num_attributes;
  KeyValue        attributes[num_attributes];

  // Major version of Gel.
  uint16          major_ver;

  // Minor version of Gel.
  uint16          minor_ver;

  // Schema.
  string          schema_ddl;

  // Type identifiers.
  uint32          num_types;
  DumpTypeInfo    types[num_types];

  // Object descriptors.
  uint32          num_descriptors;
  DumpObjectDesc  descriptors[num_descriptors];
};
```

```c
struct DumpTypeInfo {
  string          type_name;

  string          type_class;

  uuid            type_id;
};
```

```c
struct DumpObjectDesc {
  uuid            object_id;

  bytes           description;

  uint16          num_dependencies;
  uuid            dependencies[num_dependencies];
};
```

Known attributes:

## Dump Block

Sent by: server.

The actual protocol data in the backup protocol. See Dump Flow.

Format:

```c
struct DumpBlock {
  // Message type ('=').
  uint8           mtype = 0x3d;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // A set of key-value pairs.
  uint16          num_attributes;
  KeyValue        attributes[num_attributes];
};
```

Known attributes:

## ServerKeyData

Sent by: server.

Format:

```c
struct ServerKeyData {
  // Message type ('K').
  uint8           mtype = 0x4b;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Key data.
  uint8           data[32];
};
```

## ParameterStatus

Sent by: server.

Format:

```c
struct ParameterStatus {
  // Message type ('S').
  uint8           mtype = 0x53;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Parameter name.
  bytes           name;

  // Parameter value.
  bytes           value;
};
```

Known statuses:

## ClientHandshake

Sent by: client.

Format:

```c
struct ClientHandshake {
  // Message type ('V').
  uint8           mtype = 0x56;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Requested protocol major version.
  uint16          major_ver;

  // Requested protocol minor version.
  uint16          minor_ver;

  // Connection parameters.
  uint16          num_params;
  ConnectionParam params[num_params];

  // Requested protocol extensions.
  uint16          num_extensions;
  ProtocolExtension extensions[num_extensions];
};
```

```c
struct ConnectionParam {
  string          name;

  string          value;
};
```

```c
struct ProtocolExtension {
  // Extension name.
  string          name;

  // A set of extension annotaions.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];
};
```

The ClientHandshake message is the first message sent by the client upon connecting to the server.  It is the first phase of protocol negotiation, where the client sends the requested protocol version and extensions. Currently, the only defined major_ver is 1, and minor_ver is 0. No protocol extensions are currently defined.  The server always responds with the ServerHandshake.

## ServerHandshake

Sent by: server.

Format:

```c
struct ServerHandshake {
  // Message type ('v').
  uint8           mtype = 0x76;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // maximum supported or client-requested
  // protocol major version, whichever is
  // greater.
  uint16          major_ver;

  // maximum supported or client-requested
  // protocol minor version, whichever is
  // greater.
  uint16          minor_ver;

  // Supported protocol extensions.
  uint16          num_extensions;
  ProtocolExtension extensions[num_extensions];
};
```

```c
struct ProtocolExtension {
  // Extension name.
  string          name;

  // A set of extension annotaions.
  uint16          num_annotations;
  Annotation      annotations[num_annotations];
};
```

The ServerHandshake message is a direct response to the ClientHandshake message and is sent by the server in the case where the server does not support the protocol version or protocol extensions requested by the client.  It contains the maximum protocol version supported by the server, considering the version requested by the client.  It also contains the intersection of the client-requested and server-supported protocol extensions.  Any requested extensions not listed in the Server Handshake message are considered unsupported.

## AuthenticationOK

Sent by: server.

Format:

```c
struct AuthenticationOK {
  // Message type ('R').
  uint8           mtype = 0x52;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Specifies that this message contains a
  // successful authentication indicator.
  uint32          auth_status;
};
```

The AuthenticationOK message is sent by the server once it considers the authentication to be successful.

## AuthenticationSASL

Sent by: server.

Format:

```c
struct AuthenticationRequiredSASLMessage {
  // Message type ('R').
  uint8           mtype = 0x52;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Specifies that this message contains a
  // SASL authentication request.
  uint32          auth_status = 0xa;

  // A list of supported SASL authentication
  // methods.
  uint32          num_methods;
  string          methods[num_methods];
};
```

The AuthenticationSASL message is sent by the server if it determines that a SASL-based authentication method is required in order to connect using the connection parameters specified in the ClientHandshake.  The message contains a list of authentication methods supported by the server in the order preferred by the server.

At the moment, the only SASL authentication method supported by Gel is SCRAM-SHA-256 (RFC 7677).

The client must select an appropriate authentication method from the list returned by the server and send an AuthenticationSASLInitialResponse. One or more server-challenge and client-response message follow.  Each server-challenge is sent in an AuthenticationSASLContinue, followed by a response from the client in an AuthenticationSASLResponse message.  The particulars of the messages are mechanism specific.  Finally, when the authentication exchange is completed successfully, the server sends an AuthenticationSASLFinal, followed immediately by an AuthenticationOK.

## AuthenticationSASLContinue

Sent by: server.

Format:

```c
struct AuthenticationSASLContinue {
  // Message type ('R').
  uint8           mtype = 0x52;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Specifies that this message contains a
  // SASL challenge.
  uint32          auth_status = 0xb;

  // Mechanism-specific SASL data.
  bytes           sasl_data;
};
```

## AuthenticationSASLFinal

Sent by: server.

Format:

```c
struct AuthenticationSASLFinal {
  // Message type ('R').
  uint8           mtype = 0x52;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Specifies that SASL authentication has
  // completed.
  uint32          auth_status = 0xc;

  bytes           sasl_data;
};
```

## AuthenticationSASLInitialResponse

Sent by: client.

Format:

```c
struct AuthenticationSASLInitialResponse {
  // Message type ('p').
  uint8           mtype = 0x70;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Name of the SASL authentication
  // mechanism that the client selected.
  string          method;

  // Mechanism-specific "Initial Response"
  // data.
  bytes           sasl_data;
};
```

## AuthenticationSASLResponse

Sent by: client.

Format:

```c
struct AuthenticationSASLResponse {
  // Message type ('r').
  uint8           mtype = 0x72;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;

  // Mechanism-specific response data.
  bytes           sasl_data;
};
```

## Terminate

Sent by: client.

Format:

```c
struct Terminate {
  // Message type ('X').
  uint8           mtype = 0x58;

  // Length of message contents in bytes,
  // including self.
  uint32          message_length;
};
```

