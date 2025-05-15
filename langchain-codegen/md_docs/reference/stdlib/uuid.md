# UUIDs

| --- | --- |
| uuid | UUID type |
| = != ?= ?!= < > <= >= | Comparison operators |
| uuid_generate_v1mc() | Return a version 1 UUID. |
| uuid_generate_v4() | Return a version 4 UUID. |
| to_uuid() | Returns a uuid value parsed from 128-bit input. |

Type: type
Domain: eql
Summary: Universally Unique Identifiers (UUID).
Signature: type uuid


Universally Unique Identifiers (UUID).

For formal definition see RFC 4122 and ISO/IEC 9834-8:2005.

Every Object has a globally unique property id represented by a UUID value.

A UUID can be cast to an object type if an object of that type with a matching ID exists.

```edgeql-repl
db> select <Hero><uuid>'01d9cc22-b776-11ed-8bef-73f84c7e91e7';
{default::Hero {id: 01d9cc22-b776-11ed-8bef-73f84c7e91e7}}
```

Type: function
Domain: eql
Summary: Return a version 1 UUID.
Signature: function std::uuid_generate_v1mcuuid


Return a version 1 UUID.

The algorithm uses a random multicast MAC address instead of the real MAC address of the computer.

The UUID will contain 47 random bits, 60 bits representing the current time, and 14 bits of clock sequence that may be used to ensure uniqueness. The rest of the bits indicate the version of the UUID.

This is the default function used to populate the id column.

```edgeql-repl
db> select uuid_generate_v1mc();
{1893e2b6-57ce-11e8-8005-13d4be166783}
```

Type: function
Domain: eql
Summary: Return a version 4 UUID.
Signature: function std::uuid_generate_v4uuid


Return a version 4 UUID.

The UUID is derived entirely from random numbers: it will contain 122 random bits and 6 version bits.

It is permitted to override the default of the id column with a call to this function, but this should be done with caution: fully random ids will be less clustered than time-based id, which may lead to worse index performance.

```edgeql-repl
db> select uuid_generate_v4();
{92673afc-9c4f-42b3-8273-afe0053f0f48}
```

Type: function
Domain: eql
Summary: Returns a uuid value parsed from 128-bit input.
Signature: function std::to_uuiduuid


Returns a uuid value parsed from 128-bit input.

The bytes string has to be a valid 128-bit UUID representation.

```edgeql-repl
db> select to_uuid(
...   b'\x92\x67\x3a\xfc\
...     \x9c\x4f\
...     \x42\xb3\
...     \x82\x73\
...     \xaf\xe0\x05\x3f\x0f\x48');
{92673afc-9c4f-42b3-8273-afe0053f0f48}
```

