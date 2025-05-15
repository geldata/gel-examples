# Bytes

| --- | --- |
| bytes | Byte sequence |
| Endian | An enum for indicating integer value encoding. |
| bytes[i] | Accesses a byte at a given index. |
| bytes[from:to] | Produces a bytes sub-sequence from an existing bytes value. |
| bytes ++ bytes | Concatenates two bytes values into one. |
| = != ?= ?!= < > <= >= | Comparison operators |
| len() | Returns the number of bytes. |
| contains() | Checks if the byte sequence contains a given subsequence. |
| find() | Finds the index of the first occurrence of a subsequence. |
| to_bytes() | Converts a given value into binary representation as bytes. |
| to_str() | Returns the string representation of the input value. |
| to_int16() | Returns an int16 value parsed from the given input. |
| to_int32() | Returns an int32 value parsed from the given input. |
| to_int64() | Returns an int64 value parsed from the given input. |
| to_uuid() | Returns a uuid value parsed from 128-bit input. |
| bytes_get_bit() | Returns the specified bit of the bytes value. |
| bit_count() | Return the number of bits set in the bytes value. |
| enc::base64_encode() | Returns a Base64-encoded str of the bytes value. |
| enc::base64_decode() | Returns the bytes of a Base64-encoded str. |

Type: type
Domain: eql
Summary: A sequence of bytes representing raw data.
Signature: type bytes


A sequence of bytes representing raw data.

Bytes can be represented as a literal using this syntax: b''.

```edgeql-repl
db> select b'Hello, world';
{b'Hello, world'}
db> select b'Hello,\x20world\x01';
{b'Hello, world\x01'}
```

There are also some generic functions that can operate on bytes:

```edgeql-repl
db> select contains(b'qwerty', b'42');
{false}
```

Bytes are rendered as base64-encoded strings in JSON. When you cast a bytes value into JSON, that’s what you’ll get. In order to cast a json value into bytes, it must be a base64-encoded string.

```edgeql-repl
db> select <json>b'Hello Gel!';
{"\"SGVsbG8gRWRnZURCIQ==\""}
db> select <bytes>to_json("\"SGVsbG8gRWRnZURCIQ==\"");
{b'Hello Gel!'}
```

Type: type
Domain: eql
Summary: An enum for indicating integer value encoding.
Signature: type Endian


An enum for indicating integer value encoding.

This enum is used by the to_int16(), to_int32(), to_int64() and the to_bytes() converters working with bytes and integers.

Endian.Big stands for big-endian encoding going from most significant byte to least. Endian.Little stands for little-endian encoding going from least to most significant byte.

```edgeql-repl
db> select to_bytes(<int32>16908295, Endian.Big);
{b'\x01\x02\x00\x07'}
db> select to_int32(b'\x01\x02\x00\x07', Endian.Big);
{16908295}
db> select to_bytes(<int32>16908295, Endian.Little);
{b'\x07\x00\x02\x01'}
db> select to_int32(b'\x07\x00\x02\x01', Endian.Little);
{16908295}
```

Type: operator
Domain: eql
Summary: Accesses a byte at a given index.
Signature: operator bytes [ int64 ] -> bytes


Accesses a byte at a given index.

Examples:

```edgeql-repl
db> select b'binary \x01\x02\x03\x04 ftw!'[2];
{b'n'}
db> select b'binary \x01\x02\x03\x04 ftw!'[8];
{b'\x02'}
```

Type: operator
Domain: eql
Summary: Produces a bytes sub-sequence from an existing bytes value.
Signature: operator bytes [ int64 : int64 ] -> bytes


Produces a bytes sub-sequence from an existing bytes value.

Examples:

```edgeql-repl
db> select b'\x01\x02\x03\x04 ftw!'[2:-1];
{b'\x03\x04 ftw'}
db> select b'some bytes'[2:-3];
{b'me by'}
```

Type: operator
Domain: eql
Summary: Concatenates two bytes values into one.
Signature: operator bytes ++ bytes ->


Concatenates two bytes values into one.

```edgeql-repl
db> select b'\x01\x02' ++ b'\x03\x04';
{b'\x01\x02\x03\x04'}
```

Type: function
Domain: eql
Summary: Converts a given value into binary representation as bytes.
Signature: function std::to_bytesbytes
Signature: function std::to_bytesbytes
Signature: function std::to_bytesbytes
Signature: function std::to_bytesbytes
Signature: function std::to_bytesbytes


Converts a given value into binary representation as bytes.

The strings get converted using UTF-8 encoding:

```edgeql-repl
db> select to_bytes('テキスト');
{b'\xe3\x83\x86\xe3\x82\xad\xe3\x82\xb9\xe3\x83\x88'}
```

The integer values can be encoded as big-endian (most significant bit comes first) byte strings:

```edgeql-repl
db> select to_bytes(<int16>31, Endian.Big);
{b'\x00\x1f'}
db> select to_bytes(<int32>31, Endian.Big);
{b'\x00\x00\x00\x1f'}
db> select to_bytes(123456789123456789, Endian.Big);
{b'\x01\xb6\x9bK\xac\xd0_\x15'}
```

The UUID values are converted to the underlying string of 16 bytes:

```edgeql-repl
db> select to_bytes(<uuid>'1d70c86e-cc92-11ee-b4c7-a7aa0a34e2ae');
{b'\x1dp\xc8n\xcc\x92\x11\xee\xb4\xc7\xa7\xaa\n4\xe2\xae'}
```

To perform the reverse conversion there are corresponding functions: to_str(), to_int16(), to_int32(), to_int64(), to_uuid().

Type: function
Domain: eql
Summary: Returns the specified bit of the bytes value.
Signature: function std::bytes_get_bitint64


Returns the specified bit of the bytes value.

When looking for the nth bit, this function will enumerate bits from least to most significant in each byte.

```edgeql-repl
db> for n in {0, 1, 2, 3, 4, 5, 6, 7,
...           8, 9, 10, 11, 12, 13 ,14, 15}
... union bytes_get_bit(b'ab', n);
{1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0}
```

Type: function
Domain: eql
Summary: Returns a Base64-encoded str of the bytes value.
Signature: function enc::base64_encodestr


Returns a Base64-encoded str of the bytes value.

```edgeql-repl
db> select enc::base64_encode(b'hello');
{'aGVsbG8='}
```

Type: function
Domain: eql
Summary: Returns the bytes of a Base64-encoded str.
Signature: function enc::base64_decodebytes


Returns the bytes of a Base64-encoded str.

Returns an InvalidValueError if input is not valid Base64.

```edgeql-repl
db> select enc::base64_decode('aGVsbG8=');
{b'hello'}
db> select enc::base64_decode('aGVsbG8');
gel error: InvalidValueError: invalid base64 end sequence
```

