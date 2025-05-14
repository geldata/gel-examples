# Constraints

| --- | --- |
| exclusive | Enforce uniqueness (disallow duplicate values) |
| expression | Custom constraint expression (followed by keyword on) |
| one_of | A list of allowable values |
| max_value | Maximum value numerically/lexicographically |
| max_ex_value | Maximum value numerically/lexicographically (exclusive range) |
| min_value | Minimum value numerically/lexicographically |
| min_ex_value | Minimum value numerically/lexicographically (exclusive range) |
| max_len_value | Maximum length (str only) |
| min_len_value | Minimum length (str only) |
| regexp | Regex constraint (str only) |

Type: constraint
Domain: eql
Summary: A constraint based on an arbitrary expression returning a boolean.
Signature: constraint std::expression


A constraint based on an arbitrary expression returning a boolean.

The expression constraint may be used as in this example to create a custom scalar type:

```sdl
scalar type StartsWithA extending str {
    constraint expression on (__subject__[0] = 'A');
}
```

Example of using an expression constraint based on two object properties to restrict maximum magnitude for a vector:

```sdl
type Vector {
    required x: float64;
    required y: float64;
    constraint expression on (
        __subject__.x^2 + __subject__.y^2 < 25
    );
}
```

Type: constraint
Domain: eql
Summary: Specifies a list of allowed values.
Signature: constraint std::one_of


Specifies a list of allowed values.

Example:

```sdl
scalar type Status extending str {
    constraint one_of ('Open', 'Closed', 'Merged');
}
```

Type: constraint
Domain: eql
Summary: Specifies the maximum allowed value.
Signature: constraint std::max_value


Specifies the maximum allowed value.

Example:

```sdl
scalar type Max100 extending int64 {
    constraint max_value(100);
}
```

Type: constraint
Domain: eql
Summary: Specifies a non-inclusive upper bound for the value.
Signature: constraint std::max_ex_value


Specifies a non-inclusive upper bound for the value.

Example:

```sdl
scalar type Under100 extending int64 {
    constraint max_ex_value(100);
}
```

In this example, in contrast to the max_value constraint, a value of the Under100 type cannot be 100 since the valid range of max_ex_value does not include the value specified in the constraint.

Type: constraint
Domain: eql
Summary: Specifies the maximum allowed length of a value.
Signature: constraint std::max_len_value


Specifies the maximum allowed length of a value.

Example:

```sdl
scalar type Username extending str {
    constraint max_len_value(30);
}
```

Type: constraint
Domain: eql
Summary: Specifies the minimum allowed value.
Signature: constraint std::min_value


Specifies the minimum allowed value.

Example:

```sdl
scalar type NonNegative extending int64 {
    constraint min_value(0);
}
```

Type: constraint
Domain: eql
Summary: Specifies a non-inclusive lower bound for the value.
Signature: constraint std::min_ex_value


Specifies a non-inclusive lower bound for the value.

Example:

```sdl
scalar type PositiveFloat extending float64 {
    constraint min_ex_value(0);
}
```

In this example, in contrast to the min_value constraint, a value of the PositiveFloat type cannot be 0 since the valid range of mix_ex_value does not include the value specified in the constraint.

Type: constraint
Domain: eql
Summary: Specifies the minimum allowed length of a value.
Signature: constraint std::min_len_value


Specifies the minimum allowed length of a value.

Example:

```sdl
scalar type EmailAddress extending str {
    constraint min_len_value(3);
}
```

Type: constraint
Domain: eql
Summary: Limits to string values matching a regular expression.
Signature: constraint std::regexp


Limits to string values matching a regular expression.

Example:

```sdl
scalar type LettersOnly extending str {
    constraint regexp(r'[A-Za-z]*');
}
```

See our documentation on regular expression patterns for more information on those.

Type: constraint
Domain: eql
Summary: Specifies that the link or property value must be exclusive (unique).
Signature: constraint std::exclusive


Specifies that the link or property value must be exclusive (unique).

When applied to a multi link or property, the exclusivity constraint guarantees that for every object, the set of values held by a link or property does not intersect with any other such set in any other object of this type.

This constraint is only valid for concrete links and properties. Scalar type definitions cannot include this constraint.

This constraint has an additional effect of creating an implicit index on a property. This means that there’s no need to add explicit indexes for properties with this constraint.

Example:

```sdl
type User {
    # Make sure user names are unique.
    required name: str {
        constraint exclusive;
    }
    # Already indexed, don't need to do this:
    # index on (.name)

    # Make sure none of the "owned" items belong
    # to any other user.
    multi owns: Item {
        constraint exclusive;
    }
}
```

Sometimes it may be necessary to create a type where each combination of properties is unique. This can be achieved by defining an exclusive constraint for the combination, rather than on each property:

```sdl
type UniqueCoordinates {
    required x: int64;
    required y: int64;

    # Each combination of x and y must be unique.
    constraint exclusive on ( (.x, .y) );
}
```

Any possible expression can appear in the on (<expr>) clause of the exclusive constraint as long as it adheres to the following:

| --- |
| See also |
| Schema > Constraints |
| SDL > Constraints |
| DDL > Constraints |
| Introspection > Constraints |

