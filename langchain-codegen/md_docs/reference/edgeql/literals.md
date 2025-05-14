# Literals

EdgeQL is inextricably tied to Gel’s rigorous type system. Below is an overview of how to declare a literal value of each primitive type. Click a link in the left column to jump to the associated section.

| --- | --- |
| String | str |
| Boolean | bool |
| Numbers | int16 int32 int64 float32 float64 bigint decimal |
| UUID | uuid |
| Enums | enum<X, Y, Z> |
| Dates and times | datetime duration cal::local_datetime cal::local_date cal::local_time cal::relative_duration |
| Durations | duration cal::relative_duration cal::date_duration |
| Ranges | range<x> |
| Bytes | bytes |
| Arrays | array<x> |
| Tuples | tuple<x, y, ...> or tuple<foo: x, bar: y, ...> |
| JSON | json |

## Strings

The str type is a variable-length string of Unicode characters. A string can be declared with either single or double quotes.

```edgeql-repl
db> select 'I ❤️ EdgeQL';
{'I ❤️ EdgeQL'}
db> select "hello there!";
{'hello there!'}
db> select 'hello\nthere!';
{'hello
there!'}
db> select 'hello
... there!';
{'hello
there!'}
db> select r'hello
... there!'; # multiline
{'hello
there!'}
```

There is a special syntax for declaring “raw strings”. Raw strings treat the backslash \ as a literal character instead of an escape character.

```edgeql-repl
db> select r'hello\nthere'; # raw string
{r'hello\\nthere'}
db> select $$one
... two
... three$$; # multiline raw string
{'one
two
three'}
db> select $label$You can add an interstitial label
... if you need to use "$$" in your string.$label$;
{
  'You can add an interstital label
  if you need to use "$$" in your string.',
}
```

EdgeQL contains a set of built-in functions and operators for searching, comparing, and manipulating strings.

```edgeql-repl
db> select 'hellothere'[5:10];
{'there'}
db> select 'hello' ++ 'there';
{'hellothere'}
db> select len('hellothere');
{10}
db> select str_trim('  hello there  ');
{'hello there'}
db> select str_split('hello there', ' ');
{['hello', 'there']}
```

For a complete reference on strings, see Standard Library > String or click an item below.

| --- | --- |
| Indexing and slicing | str[i] str[from:to] |
| Concatenation | str ++ str |
| Utilities | len() |
| Transformation functions | str_split() str_lower() str_upper() str_title() str_pad_start() str_pad_end() str_trim() str_trim_start() str_trim_end() str_repeat() |
| Comparison operators | = != ?= ?!= < > <= >= |
| Search | contains() find() |
| Pattern matching and regexes | str like pattern str ilike pattern re_match() re_match_all() re_replace() re_test() |

## Booleans

The bool type represents a true/false value.

```edgeql-repl
db> select true;
{true}
db> select false;
{false}
```

Gel provides a set of operators that operate on boolean values.

| --- | --- |
| Comparison operators | = != ?= ?!= < > <= >= |
| Logical operators | or and not |
| Aggregation | all() any() |

## Numbers

There are several numerical types in Gel’s type system.

| --- | --- |
| int16 | 16-bit integer |
| int32 | 32-bit integer |
| int64 | 64-bit integer |
| float32 | 32-bit floating point number |
| float64 | 64-bit floating point number |
| bigint | Arbitrary precision integer. |
| decimal | Arbitrary precision number. |

Number literals that do not contain a decimal are interpreted as int64. Numbers containing decimals are interpreted as float64. The n suffix designates a number with arbitrary precision: either bigint or decimal.

| Syntax | Inferred type |
| --- | --- |
| select 3; | int64 |
| select 3.14; | float64 |
| select 314e-2; | float64 |
| select 42n; | bigint |
| select 42.0n; | decimal |
| select 42e+100n; | decimal |

To declare an int16, int32, or float32, you must provide an explicit type cast. For details on type casting, see Casting.

| Syntax | Type |
| --- | --- |
| select <int16>1234; | int16 |
| select <int32>123456; | int32 |
| select <float32>123.456; | float32 |

EdgeQL includes a full set of arithmetic and comparison operators. Parentheses can be used to indicate the order-of-operations or visually group subexpressions; this is true across all EdgeQL queries.

```edgeql-repl
db> select 5 > 2;
{true}
db> select 2 + 2;
{4}
db> select 2 ^ 10;
{1024}
db> select (1 + 1) * 2 / (3 + 8);
{0.36363636363636365}
```

EdgeQL provides a comprehensive set of built-in functions and operators on numerical data.

| --- | --- |
| Comparison operators | = != ?= ?!= < > <= >= |
| Arithmetic | + - - * / // % ^ |
| Statistics | sum() min() max() math::mean() math::stddev() math::stddev_pop() math::var() math::var_pop() |
| Math | round() math::abs() math::ceil() math::floor() math::ln() math::lg() math::log() |
| Random number | random() |

## UUID

The uuid type is commonly used to represent object identifiers. UUID literal must be explicitly cast from a string value matching the UUID specification.

```edgeql-repl
db> select <uuid>'a5ea6360-75bd-4c20-b69c-8f317b0d2857';
{a5ea6360-75bd-4c20-b69c-8f317b0d2857}
```

Generate a random UUID.

```edgeql-repl
db> select uuid_generate_v1mc();
{b4d94e6c-3845-11ec-b0f4-93e867a589e7}
```

## Enums

Enum types must be declared in your schema.

```sdl
scalar type Color extending enum<Red, Green, Blue>;
```

Once declared, an enum literal can be declared with dot notation, or by casting an appropriate string literal:

```edgeql-repl
db> select Color.Red;
{Red}
db> select <Color>"Red";
{Red}
```

## Dates and times

Gel’s typesystem contains several temporal types.

| --- | --- |
| datetime | Timezone-aware point in time |
| cal::local_datetime | Date and time w/o timezone |
| cal::local_date | Date type |
| cal::local_time | Time type |

All temporal literals are declared by casting an appropriately formatted string.

```edgeql-repl
db> select <datetime>'1999-03-31T15:17:00Z';
{<datetime>'1999-03-31T15:17:00Z'}
db> select <datetime>'1999-03-31T17:17:00+02';
{<datetime>'1999-03-31T15:17:00Z'}
db> select <cal::local_datetime>'1999-03-31T15:17:00';
{<cal::local_datetime>'1999-03-31T15:17:00'}
db> select <cal::local_date>'1999-03-31';
{<cal::local_date>'1999-03-31'}
db> select <cal::local_time>'15:17:00';
{<cal::local_time>'15:17:00'}
```

EdgeQL supports a set of functions and operators on datetime types.

| --- | --- |
| Comparison operators | = != ?= ?!= < > <= >= |
| Arithmetic | dt + dt dt - dt |
| String parsing | to_datetime() cal::to_local_datetime() cal::to_local_date() cal::to_local_time() |
| Component extraction | datetime_get() cal::time_get() cal::date_get() |
| Truncation | datetime_truncate() |
| System timestamps | datetime_current() datetime_of_transaction() datetime_of_statement() |

## Durations

Gel’s type system contains three duration types.

| --- | --- |
| duration | Exact duration |
| cal::relative_duration | Duration in relative units |
| cal::date_duration | Duration in months and days only |

## Ranges

Ranges represent a range of orderable scalar values. A range comprises a lower bound, upper bound, and two boolean flags indicating whether each bound is inclusive.

Create a range literal with the range constructor function.

```edgeql-repl
db> select range(1, 10);
{range(1, 10, inc_lower := true, inc_upper := false)}
db> select range(2.2, 3.3);
{range(2.2, 3.3, inc_lower := true, inc_upper := false)}
```

Ranges can be empty, when the upper and lower bounds are equal.

```edgeql-repl
db> select range(1, 1);
{range({}, empty := true)}
```

Ranges can be unbounded. An empty set is used to indicate the lack of a particular upper or lower bound.

```edgeql-repl
db> select range(4, <int64>{});
{range(4, {})}
db> select range(<int64>{}, 4);
{range({}, 4)}
db> select range(<int64>{}, <int64>{});
{range({}, {})}
```

To compute the set of concrete values defined by a range literal, use range_unpack. An empty range will unpack to the empty set. Unbounded ranges cannot be unpacked.

```edgeql-repl
db> select range_unpack(range(0, 10));
{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
db> select range_unpack(range(1, 1));
{}
db> select range_unpack(range(0, <int64>{}));
gel error: InvalidValueError: cannot unpack an unbounded range
```

## Bytes

The bytes type represents raw binary data.

```edgeql-repl
db> select b'bina\\x01ry';
{b'bina\\x01ry'}
```

There is a special syntax for declaring “raw byte strings”. Raw byte strings treat the backslash \ as a literal character instead of an escape character.

```edgeql-repl
db> select rb'hello\nthere';
{b'hello\\nthere'}
db> select br'\';
{b'\\'}
```

## Arrays

An array is an ordered collection of values of the same type. For example:

```edgeql-repl
db> select [1, 2, 3];
{[1, 2, 3]}
db> select ['hello', 'world'];
{['hello', 'world']}
db> select [(1, 2), (100, 200)];
{[(1, 2), (100, 200)]}
```

EdgeQL provides a set of functions and operators on arrays.

| --- | --- |
| Indexing and slicing | array[i] array[from:to] array_get() |
| Concatenation | array ++ array |
| Comparison operators | = != ?= ?!= < > <= >= |
| Utilities | len() array_join() |
| Search | contains() find() |
| Conversion to/from sets | array_agg() array_unpack() |

See Standard Library > Array for a complete reference on array data types.

## Tuples

A tuple is fixed-length, ordered collection of values, each of which may have a different type. The elements of a tuple can be of any type, including scalars, arrays, other tuples, and object types.

```edgeql-repl
db> select ('Apple', 7, true);
{('Apple', 7, true)}
```

Optionally, you can assign a key to each element of a tuple. These are known as named tuples. You must assign keys to all or none of the elements; you can’t mix-and-match.

```edgeql-repl
db> select (fruit := 'Apple', quantity := 3.14, fresh := true);
{(fruit := 'Apple', quantity := 3.14, fresh := true)}
```

## JSON

The json scalar type is a stringified representation of structured data. JSON literals are declared by explicitly casting other values or passing a properly formatted JSON string into to_json(). Any type can be converted into JSON except bytes.

```edgeql-repl
db> select <json>5;
{'5'}
db> select <json>"a string";
{'"a string"'}
db> select <json>["this", "is", "an", "array"];
{'["this", "is", "an", "array"]'}
db> select <json>("unnamed tuple", 2);
{'["unnamed tuple", 2]'}
db> select <json>(name := "named tuple", count := 2);
{'{
  "name": "named tuple",
  "count": 2
}'}
db> select to_json('{"a": 2, "b": 5}');
{'{"a": 2, "b": 5}'}
```

JSON values support indexing operators. The resulting value is also of type json.

```edgeql-repl
db> select to_json('{"a": 2, "b": 5}')['a'];
{2}
db> select to_json('["a", "b", "c"]')[2];
{'"c"'}
```

EdgeQL supports a set of functions and operators on json values. Refer to the Standard Library > JSON or click an item below for detailed documentation.

| --- | --- |
| Indexing | json[i] json[from:to] json[name] json_get() |
| Merging | json ++ json |
| Comparison operators | = != ?= ?!= < > <= >= |
| Conversion to/from strings | to_json() to_str() |
| Conversion to/from sets | json_array_unpack() json_object_unpack() |
| Introspection | json_typeof() |

