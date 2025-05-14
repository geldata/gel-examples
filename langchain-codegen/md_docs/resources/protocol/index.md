# Binary protocol

Gel uses a message-based binary protocol for communication between clients and servers.  The protocol is supported over TCP/IP.

## Connecting to Gel

The Gel binary protocol has two modes of operation: sockets and HTTP tunnelling. When connecting to Gel, the client can specify an accepted ALPN Protocol to use. If the client does not specify an ALPN protocol, HTTP tunnelling is assumed.

## Conventions and data Types

The message format descriptions in this section use a C-like struct definitions to describe their layout.  The structs are packed, i.e. there are never any alignment gaps.

The following data types are used in the descriptions:

| --- | --- |
| int8 | 8-bit integer |
| int16 | 16-bit integer, most significant byte first |
| int32 | 32-bit integer, most significant byte first |
| int64 | 64-bit integer, most significant byte first |
| uint8 | 8-bit unsigned integer |
| uint16 | 16-bit unsigned integer, most significant byte first |
| uint32 | 32-bit unsigned integer, most significant byte first |
| uint64 | 64-bit unsigned integer, most significant byte first |
| int8<T> or uint8<T> | an 8-bit signed or unsigned integer enumeration, where T denotes the name of the enumeration |
| string | a UTF-8 encoded text string prefixed with its byte length as uint32 |
| bytes | a byte string prefixed with its length as uint32 |
| KeyValue | struct KeyValue {   // Key code (specific to the type of the   // Message).   uint16          code;    // Value data.   bytes           value; }; |
| Annotation | struct Annotation {   // Name of the annotation   string          name;    // Value of the annotation (in JSON   // format).   string          value; }; |
| uuid | an array of 16 bytes with no length prefix, equivalent to byte[16] |

## Message Format

All messages in the Gel wire protocol have the following format:

```c
struct {
    uint8    message_type;
    int32    payload_length;
    uint8    payload[payload_length - 4];
};
```

The server and the client MUST not fragment messages. I.e the complete message must be sent before starting a new message. It’s advised that whole message should be buffered before initiating a network call (but this requirement is neither observable nor enforceable at the other side). It’s also common to buffer the whole message on the receiver side before starting to process it.

## Errors

At any point the server may send an ErrorResponse indicating an error condition.  This is implied in the message flow documentation, and only successful paths are explicitly documented.  The handling of the ErrorResponse message depends on the connection phase, as well as the severity of the error.

If the server is not able to recover from an error, the connection is closed immediately after an ErrorResponse message is sent.

## Logs

Similarly to ErrorResponse the server may send a LogMessage message.  The client should handle the message and continue as before.

## Message Flow

There are two main phases in the lifetime of a Gel connection: the connection phase, and the command phase.  The connection phase is responsible for negotiating the protocol and connection parameters, including authentication.  The command phase is the regular operation phase where the server is processing queries sent by the client.

## Termination

The normal termination procedure is that the client sends a Terminate message and immediately closes the connection.  On receipt of this message, the server cleans up the connection resources and closes the connection.

In some cases the server might disconnect without a client request to do so. In such cases the server will attempt to send an ErrorResponse or a LogMessage message to indicate the reason for the disconnection.

