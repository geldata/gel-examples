# Base Objects

| --- | --- |
| BaseObject | Root object type |
| Object | Root for user-defined object types |

std::BaseObject is the root of the object type hierarchy and all object types in Gel, including system types, extend it either directly or indirectly.  User-defined object types extend from std::Object type, which is a subtype of std::BaseObject.

Type: type
Domain: eql
Summary: The root object type.
Signature: type BaseObject


The root object type.

Definition:

```sdl
abstract type std::BaseObject {
    # Universally unique object identifier
    required id: uuid {
        default := (select std::uuid_generate_v1mc());
        readonly := true;
        constraint exclusive;
    }

    # Object type in the information schema.
    required readonly __type__: schema::ObjectType;
}
```

Subtypes may override the id property, but only with a valid UUID generation function. Currently, these are uuid_generate_v1mc() and uuid_generate_v4().

Type: type
Domain: eql
Summary: The root object type for user-defined types.
Signature: type Object


The root object type for user-defined types.

Definition:

```sdl
abstract type std::Object extending std::BaseObject;
```

