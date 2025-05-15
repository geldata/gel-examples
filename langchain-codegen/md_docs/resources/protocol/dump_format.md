# Dump file format

This description uses the same conventions as the protocol description.

## General Structure

Dump file is structure as follows:

## General Dump Block

Both header and data blocks are formatted as follows:

```c
struct DumpHeader {
    int8            mtype;

    // SHA1 hash sum of block data
    byte            sha1sum[20];

    // Length of message contents in bytes,
    // including self.
    int32           message_length;

    // Block data. Should be treated in opaque way by a client.
    byte            data[message_length];
}
```

Upon receiving a protocol dump data message, the dump client should:

## Header Block

Format:

```c
struct DumpHeader {
    // Message type ('H')
    int8            mtype = 0x48;

    // SHA1 hash sum of block data
    byte            sha1sum[20];

    // Length of message contents in bytes,
    // including self.
    int32           message_length;

    // A set of message headers.
    Headers         headers;

    // Protocol version of the dump
    int16           major_ver;
    int16           minor_ver;

    // Schema data
    string          schema_ddl;

    // Type identifiers
    int32           num_types;
    TypeInfo        types[num_types];

    // Object descriptors
    int32           num_descriptors;
    ObjectDesc      descriptors[num_descriptors]
};

struct TypeInfo {
    string          type_name;
    string          type_class;
    byte            type_id[16];
}

struct ObjectDesc {
    byte            object_id[16];
    bytes           description;

    int16           num_dependencies;
    byte            dependency_id[num_dependencies][16];
}
```

Known headers:

## Data Block

Format:

```c
struct DumpBlock {
    // Message type ('=')
    int8            mtype = 0x3d;

    // Length of message contents in bytes,
    // including self.
    int32           message_length;

    // A set of message headers.
    Headers         headers;
}
```

Known headers:

