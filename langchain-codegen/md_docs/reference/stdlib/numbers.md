# Numbers

| --- | --- |
| int16 | 16-bit integer |
| int32 | 32-bit integer |
| int64 | 64-bit integer |
| float32 | 32-bit floating point number |
| float64 | 64-bit floating point number |
| bigint | Arbitrary precision integer. |
| decimal | Arbitrary precision number. |
| anyreal + anyreal | Arithmetic addition. |
| anyreal - anyreal | Arithmetic subtraction. |
| -anyreal | Arithmetic negation. |
| anyreal * anyreal | Arithmetic multiplication. |
| anyreal / anyreal | Arithmetic division. |
| anyreal // anyreal | Floor division. |
| anyreal % anyreal | Remainder from division (modulo). |
| anyreal ^ anyreal | Power operation. |
| = != ?= ?!= < > <= >= | Comparison operators |
| sum() | Returns the sum of the set of numbers. |
| min() | Returns the smallest value in the given set. |
| max() | Returns the largest value in the given set. |
| round() | Rounds a given number to the nearest value. |
| random() | Returns a pseudo-random number in the range of 0.0 <= x < 1.0. |

## Mathematical functions

| --- | --- |
| math::abs() | Returns the absolute value of the input. |
| math::ceil() | Rounds up a given value to the nearest integer. |
| math::floor() | Rounds down a given value to the nearest integer. |
| math::ln() | Returns the natural logarithm of a given value. |
| math::lg() | Returns the base 10 logarithm of a given value. |
| math::log() | Returns the logarithm of a given value in the specified base. |
| math::mean() | Returns the arithmetic mean of the input set. |
| math::stddev() | Returns the sample standard deviation of the input set. |
| math::stddev_pop() | Returns the population standard deviation of the input set. |
| math::var() | Returns the sample variance of the input set. |
| math::var_pop() | Returns the population variance of the input set. |
| math::pi() | Returns the value of pi. |
| math::acos() | Returns the arc cosine of the input. |
| math::asin() | Returns the arc sine of the input. |
| math::atan() | Returns the arc tangent of the input. |
| math::atan2() | Returns the arc tangent of y / x. |
| math::cos() | Returns the cosine of the input. |
| math::cot() | Returns the cotangent of the input. |
| math::sin() | Returns the sinine of the input. |
| math::tan() | Returns the tanangent of the input. |

## Bitwise functions

| --- | --- |
| bit_and() | Bitwise AND operator for 2 intergers. |
| bit_or() | Bitwise OR operator for 2 intergers. |
| bit_xor() | Bitwise exclusive OR operator for 2 intergers. |
| bit_not() | Bitwise negation operator for 2 intergers. |
| bit_lshift() | Bitwise left-shift operator for intergers. |
| bit_rshift() | Bitwise arithemtic right-shift operator for intergers. |
| bit_count() | Return the number of bits set in the bytes value. |

## String parsing

| --- | --- |
| to_bigint() | Returns a bigint value parsed from the given string. |
| to_decimal() | Returns a decimal value parsed from the given string. |
| to_int16() | Returns an int16 value parsed from the given input. |
| to_int32() | Returns an int32 value parsed from the given input. |
| to_int64() | Returns an int64 value parsed from the given input. |
| to_float32() | Returns a float32 value parsed from the given string. |
| to_float64() | Returns a float64 value parsed from the given string. |

It’s possible to explicitly cast between all numeric types. All numeric types can also be cast to and from str and json.

## Definitions

Type: type
Domain: eql
Summary: A 16-bit signed integer.
Signature: type int16


A 16-bit signed integer.

int16 is capable of representing values from -32768 to +32767 (inclusive).

Type: type
Domain: eql
Summary: A 32-bit signed integer.
Signature: type int32


A 32-bit signed integer.

int32 is capable of representing values from -2147483648 to +2147483647 (inclusive).

Type: type
Domain: eql
Summary: A 64-bit signed integer.
Signature: type int64


A 64-bit signed integer.

int64 is capable of representing values from -9223372036854775808 to +9223372036854775807 (inclusive).

Type: type
Domain: eql
Summary: A variable precision, inexact number.
Signature: type float32


A variable precision, inexact number.

The minimal guaranteed precision is at least 6 decimal digits. The approximate range of a float32 spans from -3.4e+38 to +3.4e+38.

Type: type
Domain: eql
Summary: A variable precision, inexact number.
Signature: type float64


A variable precision, inexact number.

The minimal guaranteed precision is at least 15 decimal digits. The approximate range of a float64 spans from -1.7e+308 to +1.7e+308.

Type: type
Domain: eql
Summary: An arbitrary precision integer.
Signature: type bigint


An arbitrary precision integer.

Our philosophy is that use of bigint should always be an explicit opt-in and should never be implicit. Once used, these values should not be accidentally cast to a different numerical type that could lead to a loss of precision.

In keeping with this philosophy, our mathematical functions are designed to maintain separation between big integer values and the rest of our numeric types.

All of the following types can be explicitly cast into a bigint type:

A bigint literal is an integer literal, followed by ‘n’:

```edgeql-repl
db> select 42n is bigint;
{true}
```

To represent really big integers, it is possible to use the exponent notation (e.g. 1e20n instead of 100000000000000000000n) as long as the exponent is positive and there is no dot anywhere:

```edgeql-repl
db> select 1e+100n is bigint;
{true}
```

When a float literal is followed by n it will produce a decimal value instead:

```edgeql-repl
db> select 1.23n is decimal;
{true}

db> select 1.0e+100n is decimal;
{true}
```

Type: type
Domain: eql
Summary: Any number of arbitrary precision.
Signature: type decimal


Any number of arbitrary precision.

Our philosophy is that use of decimal should always be an explicit opt-in and should never be implicit. Once used, these values should not be accidentally cast to a different numerical type that could lead to a loss of precision.

In keeping with this philosophy, our mathematical functions are designed to maintain separation between decimal values and the rest of our numeric types.

All of the following types can be explicitly cast into decimal:

A decimal literal is a float literal, followed by n:

The Gel philosophy is that using a decimal type should be an explicit opt-in, but once used, the values should not be accidentally cast into a numeric type with less precision.

In accordance with this the mathematical functions are designed to keep the separation between decimal values and the rest of the numeric types.

All of the following types can be explicitly cast into decimal: str, json, int16, int32, int64, float32, float64, and bigint.

A decimal literal is a float literal followed by ‘n’:

```edgeql-repl
db> select 1.23n is decimal;
{true}

db> select 1.0e+100n is decimal;
{true}
```

Note that an integer literal (without a dot or exponent) followed by n produces a bigint value. A literal without a dot and with a positive exponent makes a bigint, too:

```edgeql-repl
db> select 42n is bigint;
{true}

db> select 12e+34n is bigint;
{true}
```

Type: operator
Domain: eql
Summary: Arithmetic addition.
Signature: operator anyreal + anyreal -> anyreal


Arithmetic addition.

```edgeql-repl
db> select 2 + 2;
{4}
```

Type: operator
Domain: eql
Summary: Arithmetic subtraction.
Signature: operator anyreal - anyreal -> anyreal


Arithmetic subtraction.

```edgeql-repl
db> select 3 - 2;
{1}
```

Type: operator
Domain: eql
Summary: Arithmetic negation.
Signature: operator - anyreal -> anyreal


Arithmetic negation.

```edgeql-repl
db> select -5;
{-5}
```

Type: operator
Domain: eql
Summary: Arithmetic multiplication.
Signature: operator anyreal * anyreal -> anyreal


Arithmetic multiplication.

```edgeql-repl
db> select 2 * 10;
{20}
```

Type: operator
Domain: eql
Summary: Arithmetic division.
Signature: operator anyreal / anyreal -> anyreal


Arithmetic division.

```edgeql-repl
db> select 10 / 4;
{2.5}
```

Division by zero will result in an error:

```edgeql-repl
db> select 10 / 0;
DivisionByZeroError: division by zero
```

Type: operator
Domain: eql
Summary: Floor division.
Signature: operator anyreal // anyreal -> anyreal


Floor division.

In floor-based division, the result of a standard division operation is rounded down to its nearest integer. It is the equivalent to using regular division and then applying math::floor() to the result.

```edgeql-repl
db> select 10 // 4;
{2}
db> select math::floor(10 / 4);
{2}
db> select -10 // 4;
{-3}
```

It also works on float, bigint, and decimal types. The type of the result corresponds to the type of the operands:

```edgeql-repl
db> select 3.7 // 1.1;
{3.0}
db> select 3.7n // 1.1n;
{3.0n}
db> select 37 // 11;
{3}
```

Regular division, floor division, and % operations are related in the following way: A // B  =  (A - (A % B)) / B.

Type: operator
Domain: eql
Summary: Remainder from division (modulo).
Signature: operator anyreal % anyreal -> anyreal


Remainder from division (modulo).

This is commonly referred to as a “modulo” operation.

This is the remainder from floor division. Just as is the case with // the result type of the remainder operator corresponds to the operand type:

```edgeql-repl
db> select 10 % 4;
{2}
db> select 10n % 4;
{2n}
db> select -10 % 4;
{2}
db> # floating arithmetic is inexact, so
... # we get 0.3999999999999999 instead of 0.4
... select 3.7 % 1.1;
{0.3999999999999999}
db> select 3.7n % 1.1n;
{0.4n}
db> select 37 % 11;
{4}
```

Regular division, // and % operations are related in the following way: A // B  =  (A - (A % B)) / B.

Modulo division by zero will result in an error:

```edgeql-repl
db> select 10 % 0;
DivisionByZeroError: division by zero
```

Type: operator
Domain: eql
Summary: Power operation.
Signature: operator anyreal ^ anyreal -> anyreal


Power operation.

```edgeql-repl
db> select 2 ^ 4;
{16}
```

Type: function
Domain: eql
Summary: Rounds a given number to the nearest value.
Signature: function std::roundfloat64
Signature: function std::roundfloat64
Signature: function std::roundbigint
Signature: function std::rounddecimal
Signature: function std::rounddecimal


Rounds a given number to the nearest value.

The function will round a .5 value differently depending on the type of the parameter passed.

The float64 tie is rounded to the nearest even number:

```edgeql-repl
db> select round(1.2);
{1}

db> select round(1.5);
{2}

db> select round(2.5);
{2}
```

But the decimal tie is rounded away from zero:

```edgeql-repl
db> select round(1.2n);
{1n}

db> select round(1.5n);
{2n}

db> select round(2.5n);
{3n}
```

Additionally, when rounding a decimal value, you may pass the optional argument d to specify the precision of the rounded result:

```edgeql-repl
db> select round(163.278n, 2);
{163.28n}

db> select round(163.278n, 1);
{163.3n}

db> select round(163.278n, 0);
{163n}

db> select round(163.278n, -1);
{160n}

db> select round(163.278n, -2);
{200n}
```

Type: function
Domain: eql
Summary: Returns a pseudo-random number in the range of 0.0 <= x < 1.0.
Signature: function std::randomfloat64


Returns a pseudo-random number in the range of 0.0 <= x < 1.0.

```edgeql-repl
db> select random();
{0.62649393780157}
```

Type: function
Domain: eql
Summary: Bitwise AND operator for 2 intergers.
Signature: function std::bit_andint16
Signature: function std::bit_andint32
Signature: function std::bit_andint64


Bitwise AND operator for 2 intergers.

```edgeql-repl
db> select bit_and(17, 3);
{1}
```

Type: function
Domain: eql
Summary: Bitwise OR operator for 2 intergers.
Signature: function std::bit_orint16
Signature: function std::bit_orint32
Signature: function std::bit_orint64


Bitwise OR operator for 2 intergers.

```edgeql-repl
db> select bit_or(17, 3);
{19}
```

Type: function
Domain: eql
Summary: Bitwise exclusive OR operator for 2 intergers.
Signature: function std::bit_xorint16
Signature: function std::bit_xorint32
Signature: function std::bit_xorint64


Bitwise exclusive OR operator for 2 intergers.

```edgeql-repl
db> select bit_xor(17, 3);
{18}
```

Type: function
Domain: eql
Summary: Bitwise negation operator for 2 intergers.
Signature: function std::bit_notint16
Signature: function std::bit_notint32
Signature: function std::bit_notint64


Bitwise negation operator for 2 intergers.

Bitwise negation for integers ends up similar to mathematical negation because typically the signed integers use “two’s complement” representation. In this represenation mathematical negation is achieved by aplying bitwise negation and adding 1.

```edgeql-repl
db> select bit_not(17);
{-18}
db> select -17 = bit_not(17) + 1;
{true}
```

Type: function
Domain: eql
Summary: Bitwise left-shift operator for intergers.
Signature: function std::bit_lshiftint16
Signature: function std::bit_lshiftint32
Signature: function std::bit_lshiftint64


Bitwise left-shift operator for intergers.

The integer val is shifted by n bits to the left. The rightmost added bits are all 0. Shifting an integer by a number of bits greater than the bit size of the integer results in 0.

```edgeql-repl
db> select bit_lshift(123, 2);
{492}
db> select bit_lshift(123, 65);
{0}
```

Left-shifting an integer can change the sign bit:

```edgeql-repl
db> select bit_lshift(123, 60);
{-5764607523034234880}
```

In general, left-shifting an integer in small increments produces the same result as shifting it in one step:

```edgeql-repl
db> select bit_lshift(bit_lshift(123, 1), 3);
{1968}
db> select bit_lshift(123, 4);
{1968}
```

It is an error to attempt to shift by a negative number of bits:

```edgeql-repl
db> select bit_lshift(123, -2);
gel error: InvalidValueError: bit_lshift(): cannot shift by
negative amount
```

Type: function
Domain: eql
Summary: Bitwise arithemtic right-shift operator for intergers.
Signature: function std::bit_rshiftint16
Signature: function std::bit_rshiftint32
Signature: function std::bit_rshiftint64


Bitwise arithemtic right-shift operator for intergers.

The integer val is shifted by n bits to the right. In the arithmetic right-shift, the sign is preserved. This means that the leftmost added bits are 1 or 0 depending on the sign bit. Shifting an integer by a number of bits greater than the bit size of the integer results in 0 for positive numbers or -1 for negative numbers.

```edgeql-repl
db> select bit_rshift(123, 2);
{30}
db> select bit_rshift(123, 65);
{0}
db> select bit_rshift(-123, 2);
{-31}
db> select bit_rshift(-123, 65);
{-1}
```

In general, right-shifting an integer in small increments produces the same result as shifting it in one step:

```edgeql-repl
db> select bit_rshift(bit_rshift(123, 1), 3);
{7}
db> select bit_rshift(123, 4);
{7}
db> select bit_rshift(bit_rshift(-123, 1), 3);
{-8}
db> select bit_rshift(-123, 4);
{-8}
```

It is an error to attempt to shift by a negative number of bits:

```edgeql-repl
db> select bit_rshift(123, -2);
gel error: InvalidValueError: bit_rshift(): cannot shift by
negative amount
```

Type: function
Domain: eql
Summary: Return the number of bits set in the bytes value.
Signature: function std::bit_countint64
Signature: function std::bit_countint64
Signature: function std::bit_countint64
Signature: function std::bit_countint64


Return the number of bits set in the bytes value.

This is also known as the population count.

```edgeql-repl
db> select bit_count(255);
{8}
db> select bit_count(b'\xff\xff');
{16}
```

Type: function
Domain: eql
Summary: Returns a bigint value parsed from the given string.
Signature: function std::to_bigintbigint


Returns a bigint value parsed from the given string.

The function will use an optional format string passed as fmt. See the number formatting options for help writing a format string.

```edgeql-repl
db> select to_bigint('-000,012,345', 'S099,999,999,999');
{-12345n}
db> select to_bigint('31st', '999th');
{31n}
```

Type: function
Domain: eql
Summary: Returns a decimal value parsed from the given string.
Signature: function std::to_decimaldecimal


Returns a decimal value parsed from the given string.

The function will use an optional format string passed as fmt. See the number formatting options for help writing a format string.

```edgeql-repl
db> select to_decimal('-000,012,345', 'S099,999,999,999');
{-12345.0n}
db> select to_decimal('-012.345');
{-12.345n}
db> select to_decimal('31st', '999th');
{31.0n}
```

Type: function
Domain: eql
Summary: Returns an int16 value parsed from the given input.
Signature: function std::to_int16int16
Signature: function std::to_int16int16


Returns an int16 value parsed from the given input.

The string parsing function will use an optional format string passed as fmt. See the number formatting options for help writing a format string.

```edgeql-repl
db> select to_int16('23');
{23}
db> select to_int16('23%', '99%');
{23}
```

The bytes conversion function expects exactly 2 bytes with specified endianness.

```edgeql-repl
db> select to_int16(b'\x00\x07', Endian.Big);
{7}
db> select to_int16(b'\x07\x00', Endian.Little);
{7}
```

Type: function
Domain: eql
Summary: Returns an int32 value parsed from the given input.
Signature: function std::to_int32int32
Signature: function std::to_int32int32


Returns an int32 value parsed from the given input.

The string parsin function will use an optional format string passed as fmt. See the number formatting options for help writing a format string.

```edgeql-repl
db> select to_int32('1000023');
{1000023}
db> select to_int32('1000023%', '9999999%');
{1000023}
```

The bytes conversion function expects exactly 4 bytes with specified endianness.

```edgeql-repl
db> select to_int32(b'\x01\x02\x00\x07', Endian.Big);
{16908295}
db> select to_int32(b'\x07\x00\x02\x01', Endian.Little);
{16908295}
```

Type: function
Domain: eql
Summary: Returns an int64 value parsed from the given input.
Signature: function std::to_int64int64
Signature: function std::to_int64int64


Returns an int64 value parsed from the given input.

The string parsing function will use an optional format string passed as fmt. See the number formatting options for help writing a format string.

```edgeql-repl
db> select to_int64('10000234567');
{10000234567}
db> select to_int64('10000234567%', '99999999999%');
{10000234567}
```

The bytes conversion function expects exactly 8 bytes with specified endianness.

```edgeql-repl
db> select to_int64(b'\x01\x02\x00\x07\x11\x22\x33\x44',
...                 Endian.Big);
{72620574343574340}
db> select to_int64(b'\x44\x33\x22\x11\x07\x00\x02\x01',
...                 Endian.Little);
{72620574343574340}
```

Type: function
Domain: eql
Summary: Returns a float32 value parsed from the given string.
Signature: function std::to_float32float32


Returns a float32 value parsed from the given string.

The function will use an optional format string passed as fmt. See the number formatting options for help writing a format string.

Type: function
Domain: eql
Summary: Returns a float64 value parsed from the given string.
Signature: function std::to_float64float64


Returns a float64 value parsed from the given string.

The function will use an optional format string passed as fmt. See the number formatting options for help writing a format string.

