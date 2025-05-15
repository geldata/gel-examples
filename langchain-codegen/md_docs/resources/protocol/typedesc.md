# Type descriptors

This section describes how type information for query input and results is encoded.  Specifically, this is needed to decode the server response to the CommandDataDescription message.

The type descriptor is essentially a list of type information blocks:

While parsing the blocks, a database driver can assemble an encoder or a decoder of the Gel binary data.

An encoder is used to encode objects, native to the driver’s runtime, to binary data that Gel can decode and work with.

A decoder is used to decode data from Gel native format to data types native to the driver.

There is one special type with type id of zero: 00000000-0000-0000-0000-000000000000. The describe result of this type contains zero blocks. It’s used when a statement returns no meaningful results, e.g. the CREATE BRANCH example statement.  It is also used to represent the input descriptor when a query does not receive any arguments, or the state descriptor for an empty/default state.

## Descriptor and type IDs

The descriptor and type IDs in structures below are intended to be semi-stable unique identifiers of a type.  Fundamental types have globally stable known IDs, and type IDs for schema-defined types (i.e. with schema_defined = true) persist.  Ephemeral type ids are derived from type structure and are not guaranteed to be stable, but are still useful as cache keys.

## Set Descriptor

```c
struct SetDescriptor {
    // Indicates that this is a Set value descriptor.
    uint8   tag = 0;

    // Descriptor ID.
    uuid    id;

    // Set element type descriptor index.
    uint16  type;
};
```

Set values are encoded on the wire as single-dimensional arrays.

## Scalar Type Descriptor

```c
struct ScalarTypeDescriptor {
    // Indicates that this is a
    // Scalar Type descriptor.
    uint8   tag = 3;

    // Schema type ID.
    uuid    id;

    // Schema type name.
    string  name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool    schema_defined;

    // Number of ancestor scalar types.
    uint16  ancestors_count;

    // Indexes of ancestor scalar type descriptors
    // in ancestor resolution order (C3).
    uint16  ancestors[ancestors_count];
};
```

The descriptor IDs for fundamental scalar types are constant. The following table lists all Gel fundamental type descriptor IDs:

| ID | Type |
| --- | --- |
| 00000000-0000-0000-0000-000000000100 | std::uuid |
| 00000000-0000-0000-0000-000000000101 | std::str |
| 00000000-0000-0000-0000-000000000102 | std::bytes |
| 00000000-0000-0000-0000-000000000103 | std::int16 |
| 00000000-0000-0000-0000-000000000104 | std::int32 |
| 00000000-0000-0000-0000-000000000105 | std::int64 |
| 00000000-0000-0000-0000-000000000106 | std::float32 |
| 00000000-0000-0000-0000-000000000107 | std::float64 |
| 00000000-0000-0000-0000-000000000108 | std::decimal |
| 00000000-0000-0000-0000-000000000109 | std::bool |
| 00000000-0000-0000-0000-00000000010A | std::datetime |
| 00000000-0000-0000-0000-00000000010E | std::duration |
| 00000000-0000-0000-0000-00000000010F | std::json |
| 00000000-0000-0000-0000-00000000010B | cal::local_datetime |
| 00000000-0000-0000-0000-00000000010C | cal::local_date |
| 00000000-0000-0000-0000-00000000010D | cal::local_time |
| 00000000-0000-0000-0000-000000000110 | std::bigint |
| 00000000-0000-0000-0000-000000000111 | cal::relative_duration |
| 00000000-0000-0000-0000-000000000112 | cal::date_duration |
| 00000000-0000-0000-0000-000000000130 | cfg::memory |

## Tuple Type Descriptor

```c
struct TupleTypeDescriptor {
    // Indicates that this is a
    // Tuple Type descriptor.
    uint8     tag = 4;

    // Schema type ID.
    uuid      id;

    // Schema type name.
    string    name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool      schema_defined;

    // Number of ancestor scalar types.
    uint16    ancestors_count;

    // Indexes of ancestor scalar type descriptors
    // in ancestor resolution order (C3).
    uint16    ancestors[ancestors_count];

    // The number of elements in tuple.
    uint16    element_count;

    // Indexes of element type descriptors.
    uint16    element_types[element_count];
};
```

An empty tuple type descriptor has an ID of 00000000-0000-0000-0000-0000000000FF.

## Named Tuple Type Descriptor

```c
struct NamedTupleTypeDescriptor {
    // Indicates that this is a
    // Named Tuple Type descriptor.
    uint8         tag = 5;

    // Schema type ID.
    uuid          id;

    // Schema type name.
    string        name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool          schema_defined;

    // Number of ancestor scalar types.
    uint16        ancestors_count;

    // Indexes of ancestor scalar type descriptors
    // in ancestor resolution order (C3).
    uint16        ancestors[ancestors_count];

    // The number of elements in tuple.
    uint16        element_count;

    // Indexes of element descriptors.
    TupleElement  elements[element_count];
};

struct TupleElement {
    // Field name.
    string  name;

    // Field type descriptor index.
    int16   type;
};
```

## Array Type Descriptor

```c
struct ArrayTypeDescriptor {
    // Indicates that this is an
    // Array Type descriptor.
    uint8   tag = 6;

    // Schema type ID.
    uuid    id;

    // Schema type name.
    string  name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool    schema_defined;

    // Number of ancestor scalar types.
    uint16  ancestors_count;

    // Indexes of ancestor scalar type descriptors
    // in ancestor resolution order (C3).
    uint16  ancestors[ancestors_count];

    // Array element type.
    uint16  type;

    // The number of array dimensions, at least 1.
    uint16  dimension_count;

    // Sizes of array dimensions, -1 indicates
    // unbound dimension.
    int32   dimensions[dimension_count];
};
```

## Enumeration Type Descriptor

```c
struct EnumerationTypeDescriptor {
    // Indicates that this is an
    // Enumeration Type descriptor.
    uint8   tag = 7;

    // Schema type ID.
    uuid    id;

    // Schema type name.
    string  name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool    schema_defined;

    // Number of ancestor scalar types.
    uint16  ancestors_count;

    // Indexes of ancestor scalar type descriptors
    // in ancestor resolution order (C3).
    uint16  ancestors[ancestors_count];

    // The number of enumeration members.
    uint16  member_count;

    // Names of enumeration members.
    string  members[member_count];
};
```

## Range Type Descriptor

```c
struct RangeTypeDescriptor {
    // Indicates that this is a
    // Range Type descriptor.
    uint8   tag = 9;

    // Schema type ID.
    uuid    id;

    // Schema type name.
    string  name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool    schema_defined;

    // Number of ancestor scalar types.
    uint16  ancestors_count;

    // Indexes of ancestor scalar type descriptors
    // in ancestor resolution order (C3).
    uint16  ancestors[ancestors_count];

    // Range type descriptor index.
    uint16  type;
};
```

Ranges are encoded on the wire as ranges.

## Object Type Descriptor

```c
struct ObjectTypeDescriptor {
    // Indicates that this is an
    // object type descriptor.
    uint8   tag = 10;

    // Schema type ID.
    uuid    id;

    // Schema type name (can be empty for ephemeral free object types).
    string  name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool    schema_defined;
};
```

## Compound Type Descriptor

```c
struct CompoundTypeDescriptor {
    // Indicates that this is a
    // compound type descriptor.
    uint8                 tag = 11;

    // Schema type ID.
    uuid                  id;

    // Schema type name.
    string                name;

    // Whether the type is defined in the schema
    // or is ephemeral.
    bool                  schema_defined;

    // Compound type operation, see TypeOperation below.
    uint8<TypeOperation>  op;

    // Number of compound type components.
    uint16                component_count;

    // Compound type component type descriptor indexes.
    uint16                components[component_count];
};

enum TypeOperation {
    // Foo | Bar
    UNION         = 1;

    // Foo & Bar
    INTERSECTION  = 2;
};
```

## Object Output Shape Descriptor

```c
struct ObjectShapeDescriptor {
    // Indicates that this is an
    // Object Shape descriptor.
    uint8         tag = 1;

    // Descriptor ID.
    uuid          id;

    // Whether is is an ephemeral free shape,
    // if true, then `type` would always be 0
    // and should not be interpreted.
    bool          ephemeral_free_shape;

    // Object type descriptor index.
    uint16        type;

    // Number of elements in shape.
    uint16        element_count;

    // Array of shape elements.
    ShapeElement  elements[element_count];
};

struct ShapeElement {
    // Field flags:
    //   1 << 0: the field is implicit
    //   1 << 1: the field is a link property
    //   1 << 2: the field is a link
    uint32              flags;

    // The cardinality of the shape element.
    uint8<Cardinality>  cardinality;

    // Element name.
    string              name;

    // Element type descriptor index.
    uint16              type;

    // Source schema type descriptor index
    // (useful for polymorphic queries).
    uint16              source_type;
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

Objects are encoded on the wire as tuples.

## Input Shape Descriptor

```c
struct InputShapeDescriptor {
    // Indicates that this is an
    // Object Shape descriptor.
    uint8              tag = 8;

    // Descriptor ID.
    uuid               id;

    // Number of elements in shape.
    uint16             element_count;

    // Shape elements.
    InputShapeElement  elements[element_count];
};

struct InputShapeElement {
    // Field flags, currently always zero.
    uint32              flags;

    // The cardinality of the shape element.
    uint8<Cardinality>  cardinality;

    // Element name.
    string              name;

    // Element type descriptor index.
    uint16              type;
};
```

Input objects are encoded on the wire as sparse objects.

## Type Annotation Text Descriptor

```c
struct TypeAnnotationDescriptor {
    // Indicates that this is an
    // Type Annotation descriptor.
    uint8   tag = 127;

    // Index of the descriptor the
    // annotation is for.
    uint16  descriptor;

    // Annotation key.
    string  key;

    // Annotation value.
    string  value;
};
```

## SQL Record Descriptor

```c
struct SQLRecordDescriptor {
    // Indicates that this is a
    // SQL Record descriptor.
    uint8         tag = 13;

    // Descriptor ID.
    uuid          id;

    // Number of elements in record.
    uint16        element_count;

    // Array of shape elements.
    SQLRecordElement  elements[element_count];
};

struct SQLRecordElement {
    // Element name.
    string              name;

    // Element type descriptor index.
    uint16              type;
};
```

