# Math

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

Type: function
Domain: eql
Summary: Returns the absolute value of the input.
Signature: function math::absanyreal


Returns the absolute value of the input.

```edgeql-repl
db> select math::abs(1);
{1}
db> select math::abs(-1);
{1}
```

Type: function
Domain: eql
Summary: Rounds up a given value to the nearest integer.
Signature: function math::ceilfloat64
Signature: function math::ceilfloat64
Signature: function math::ceilbigint
Signature: function math::ceildecimal


Rounds up a given value to the nearest integer.

```edgeql-repl
db> select math::ceil(1.1);
{2}
db> select math::ceil(-1.1);
{-1}
```

Type: function
Domain: eql
Summary: Rounds down a given value to the nearest integer.
Signature: function math::floorfloat64
Signature: function math::floorfloat64
Signature: function math::floorbigint
Signature: function math::floordecimal


Rounds down a given value to the nearest integer.

```edgeql-repl
db> select math::floor(1.1);
{1}
db> select math::floor(-1.1);
{-2}
```

Type: function
Domain: eql
Summary: Returns the natural logarithm of a given value.
Signature: function math::lnfloat64
Signature: function math::lnfloat64
Signature: function math::lndecimal


Returns the natural logarithm of a given value.

```edgeql-repl
db> select 2.718281829 ^ math::ln(100);
{100.00000009164575}
```

Type: function
Domain: eql
Summary: Returns the base 10 logarithm of a given value.
Signature: function math::lgfloat64
Signature: function math::lgfloat64
Signature: function math::lgdecimal


Returns the base 10 logarithm of a given value.

```edgeql-repl
db> select 10 ^ math::lg(42);
{42.00000000000001}
```

Type: function
Domain: eql
Summary: Returns the logarithm of a given value in the specified base.
Signature: function math::logdecimal


Returns the logarithm of a given value in the specified base.

```edgeql-repl
db> select 3 ^ math::log(15n, base := 3n);
{15.0000000000000005n}
```

Type: function
Domain: eql
Summary: Returns the arithmetic mean of the input set.
Signature: function math::meanfloat64
Signature: function math::meanfloat64
Signature: function math::meandecimal


Returns the arithmetic mean of the input set.

```edgeql-repl
db> select math::mean({1, 3, 5});
{3}
```

Type: function
Domain: eql
Summary: Returns the sample standard deviation of the input set.
Signature: function math::stddevfloat64
Signature: function math::stddevfloat64
Signature: function math::stddevdecimal


Returns the sample standard deviation of the input set.

```edgeql-repl
db> select math::stddev({1, 3, 5});
{2}
```

Type: function
Domain: eql
Summary: Returns the population standard deviation of the input set.
Signature: function math::stddev_popfloat64
Signature: function math::stddev_popfloat64
Signature: function math::stddev_popdecimal


Returns the population standard deviation of the input set.

```edgeql-repl
db> select math::stddev_pop({1, 3, 5});
{1.63299316185545}
```

Type: function
Domain: eql
Summary: Returns the sample variance of the input set.
Signature: function math::varfloat64
Signature: function math::varfloat64
Signature: function math::vardecimal


Returns the sample variance of the input set.

```edgeql-repl
db> select math::var({1, 3, 5});
{4}
```

Type: function
Domain: eql
Summary: Returns the population variance of the input set.
Signature: function math::var_popfloat64
Signature: function math::var_popfloat64
Signature: function math::var_popdecimal


Returns the population variance of the input set.

```edgeql-repl
db> select math::var_pop({1, 3, 5});
{2.66666666666667}
```

Type: function
Domain: eql
Summary: Returns the value of pi.
Signature: function math::pifloat64


Returns the value of pi.

```edgeql-repl
db> select math::pi();
{3.141592653589793}
```

Type: function
Domain: eql
Summary: Returns the arc cosine of the input.
Signature: function math::acosfloat64


Returns the arc cosine of the input.

```edgeql-repl
db> select math::acos(-1);
{3.141592653589793}
db> select math::acos(0);
{1.5707963267948966}
db> select math::acos(1);
{0}
```

Type: function
Domain: eql
Summary: Returns the arc sine of the input.
Signature: function math::asinfloat64


Returns the arc sine of the input.

```edgeql-repl
db> select math::asin(-1);
{-1.5707963267948966}
db> select math::asin(0);
{0}
db> select math::asin(1);
{1.5707963267948966}
```

Type: function
Domain: eql
Summary: Returns the arc tangent of the input.
Signature: function math::atanfloat64


Returns the arc tangent of the input.

```edgeql-repl
db> select math::atan(-1);
{-0.7853981633974483}
db> select math::atan(0);
{0}
db> select math::atan(1);
{0.7853981633974483}
```

Type: function
Domain: eql
Summary: Returns the arc tangent of y / x.
Signature: function math::atan2float64


Returns the arc tangent of y / x.

Uses the signs of the arguments determine the correct quadrant.

```edgeql-repl
db> select math::atan2(1, 1);
{0.7853981633974483}
db> select math::atan2(1, -1);
{2.356194490192345}
db> select math::atan2(-1, -1);
{-2.356194490192345}
db> select math::atan2(-1, 1);
{-0.7853981633974483}
```

Type: function
Domain: eql
Summary: Returns the cosine of the input.
Signature: function math::cosfloat64


Returns the cosine of the input.

```edgeql-repl
db> select math::cos(0);
{1}
db> select math::cos(math::pi() / 2);
{0.000000000}
db> select math::cos(math::pi());
{-1}
db> select math::cos(math::pi() * 3 / 2);
{-0.000000000}
```

Type: function
Domain: eql
Summary: Returns the cotangent of the input.
Signature: function math::cotfloat64


Returns the cotangent of the input.

```edgeql-repl
db> select math::cot(math::pi() / 4);
{1.000000000}
db> select math::cot(math::pi() / 2);
{0.000000000}
db> select math::cot(math::pi() * 3 / 4);
{-0.999999999}
```

Type: function
Domain: eql
Summary: Returns the sinine of the input.
Signature: function math::sinfloat64


Returns the sinine of the input.

```edgeql-repl
db> select math::sin(0);
{0}
db> select math::sin(math::pi() / 2);
{1}
db> select math::sin(math::pi());
{0.000000000}
db> select math::sin(math::pi() * 3 / 2);
{-1}
```

Type: function
Domain: eql
Summary: Returns the tanangent of the input.
Signature: function math::tanfloat64


Returns the tanangent of the input.

```edgeql-repl
db> select math::tan(-math::pi() / 4);
{-0.999999999}
db> select math::tan(0);
{0}
db> select math::tan(math::pi() / 4);
{0.999999999}
```

