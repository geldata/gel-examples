# Abstract Types

Abstract types are used to describe polymorphic functions, otherwise known as “generic functions,” which can be called on a broad range of types.

Type: type
Domain: eql
Summary: A generic type.
Signature: type anytype


Fields:
- Index Keywords: any anytype


A generic type.

It is a placeholder used in cases where no specific type requirements are needed, such as defining polymorphic parameters in functions and operators.

Type: type
Domain: eql
Summary: A generic object.
Signature: type anyobject


Fields:
- Index Keywords: any anytype object


A generic object.

Similarly to anytype, this type is used to denote a generic object. This is useful when defining polymorphic parameters in functions and operators as it conforms to whatever type is actually passed. This is different friom BaseObject which although is the parent type of any object also only has an id property, making access to other properties and links harder.

Type: type
Domain: eql
Summary: An abstract base scalar type.
Signature: type anyscalar


Fields:
- Index Keywords: any anytype scalar


An abstract base scalar type.

All scalar types are derived from this type.

Type: type
Domain: eql
Summary: An abstract base enumerated type.
Signature: type anyenum


Fields:
- Index Keywords: any anytype enum


An abstract base enumerated type.

All enum types are derived from this type.

Type: type
Domain: eql
Summary: A generic tuple.
Signature: type anytuple


Fields:
- Index Keywords: any anytype anytuple


A generic tuple.

Similarly to anytype, this type is used to denote a generic tuple without detailing its component types. This is useful when defining polymorphic parameters in functions and operators.

## Abstract Numeric Types

These abstract numeric types extend anyscalar.

Type: type
Domain: eql
Summary: An abstract base scalar type for int16, int32, and int64.
Signature: type anyint


Fields:
- Index Keywords: any anytype int


An abstract base scalar type for int16, int32, and int64.

Type: type
Domain: eql
Summary: An abstract base scalar type for float32 and float64.
Signature: type anyfloat


Fields:
- Index Keywords: any anytype float


An abstract base scalar type for float32 and float64.

Type: type
Domain: eql
Summary: An abstract base scalar type for anyint, anyfloat, and decimal.
Signature: type anyreal


Fields:
- Index Keywords: any anytype


An abstract base scalar type for anyint, anyfloat, and decimal.

## Abstract Range Types

There are some types that can be used to construct ranges. These scalar types are distinguished by the following abstract types:

Type: type
Domain: eql
Summary: Abstract base type for all valid ranges.
Signature: type anypoint


Fields:
- Index Keywords: any anypoint anyrange


Abstract base type for all valid ranges.

Abstract base scalar type for int32, int64, float32, float64, decimal, datetime, cal::local_datetime, and cal::local_date.

Type: type
Domain: eql
Summary: An abstract base type for all valid discrete ranges.
Signature: type anydiscrete


Fields:
- Index Keywords: any anydiscrete anyrange discrete


An abstract base type for all valid discrete ranges.

This is an abstract base scalar type for int32, int64, and cal::local_date.

Type: type
Domain: eql
Summary: An abstract base type for all valid contiguous ranges.
Signature: type anycontiguous


Fields:
- Index Keywords: any anycontiguous anyrange


An abstract base type for all valid contiguous ranges.

This is an abstract base scalar type for float32, float64, decimal, datetime, and cal::local_datetime.

