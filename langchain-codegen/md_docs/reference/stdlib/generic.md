# Generic

| --- | --- |
| anytype = anytype | Compares two values for equality. |
| anytype != anytype | Compares two values for inequality. |
| anytype ?= anytype | Compares two (potentially empty) values for equality. |
| anytype ?!= anytype | Compares two (potentially empty) values for inequality. |
| anytype < anytype | Less than operator. |
| anytype > anytype | Greater than operator. |
| anytype <= anytype | Less or equal operator. |
| anytype >= anytype | Greater or equal operator. |
| len() | Returns the number of elements of a given value. |
| contains() | Returns true if the given sub-value exists within the given value. |
| find() | Returns the index of a given sub-value in a given value. |

In EdgeQL, any value can be compared to another as long as their types are compatible.

Type: operator
Domain: eql
Summary: Compares two values for equality.
Signature: operator anytype = anytype -> bool


Compares two values for equality.

```edgeql-repl
db> select 3 = 3.0;
{true}
db> select 3 = 3.14;
{false}
db> select [1, 2] = [1, 2];
{true}
db> select (1, 2) = (x := 1, y := 2);
{true}
db> select (x := 1, y := 2) = (a := 1, b := 2);
{true}
db> select 'hello' = 'world';
{false}
```

Type: operator
Domain: eql
Summary: Compares two values for inequality.
Signature: operator anytype != anytype -> bool


Compares two values for inequality.

```edgeql-repl
db> select 3 != 3.0;
{false}
db> select 3 != 3.14;
{true}
db> select [1, 2] != [2, 1];
{false}
db> select (1, 2) != (x := 1, y := 2);
{false}
db> select (x := 1, y := 2) != (a := 1, b := 2);
{false}
db> select 'hello' != 'world';
{true}
```

Type: operator
Domain: eql
Summary: Compares two (potentially empty) values for equality.
Signature: operator optional anytype ?= optional anytype -> bool


Compares two (potentially empty) values for equality.

This works the same as a regular = operator, but also allows comparing an empty {} set.  Two empty sets are considered equal.

```edgeql-repl
db> select {1} ?= {1.0};
{true}
db> select {1} ?= <int64>{};
{false}
db> select <int64>{} ?= <int64>{};
{true}
```

Type: operator
Domain: eql
Summary: Compares two (potentially empty) values for inequality.
Signature: operator optional anytype ?!= optional anytype -> bool


Compares two (potentially empty) values for inequality.

This works the same as a regular = operator, but also allows comparing an empty {} set.  Two empty sets are considered equal.

```edgeql-repl
db> select {2} ?!= {2};
{false}
db> select {1} ?!= <int64>{};
{true}
db> select <bool>{} ?!= <bool>{};
{false}
```

Type: operator
Domain: eql
Summary: Less than operator.
Signature: operator anytype < anytype -> bool


Less than operator.

The operator returns true if the value of the left expression is less than the value of the right expression:

```edgeql-repl
db> select 1 < 2;
{true}
db> select 2 < 2;
{false}
db> select 'hello' < 'world';
{true}
db> select (1, 'hello') < (1, 'world');
{true}
```

Type: operator
Domain: eql
Summary: Greater than operator.
Signature: operator anytype > anytype -> bool


Greater than operator.

The operator returns true if the value of the left expression is greater than the value of the right expression:

```edgeql-repl
db> select 1 > 2;
{false}
db> select 3 > 2;
{true}
db> select 'hello' > 'world';
{false}
db> select (1, 'hello') > (1, 'world');
{false}
```

Type: operator
Domain: eql
Summary: Less or equal operator.
Signature: operator anytype <= anytype -> bool


Less or equal operator.

The operator returns true if the value of the left expression is less than or equal to the value of the right expression:

```edgeql-repl
db> select 1 <= 2;
{true}
db> select 2 <= 2;
{true}
db> select 3 <= 2;
{false}
db> select 'hello' <= 'world';
{true}
db> select (1, 'hello') <= (1, 'world');
{true}
```

Type: operator
Domain: eql
Summary: Greater or equal operator.
Signature: operator anytype >= anytype -> bool


Greater or equal operator.

The operator returns true if the value of the left expression is greater than or equal to the value of the right expression:

```edgeql-repl
db> select 1 >= 2;
{false}
db> select 2 >= 2;
{true}
db> select 3 >= 2;
{true}
db> select 'hello' >= 'world';
{false}
db> select (1, 'hello') >= (1, 'world');
{false}
```

Type: function
Domain: eql
Summary: Returns the number of elements of a given value.
Signature: function std::lenint64
Signature: function std::lenint64
Signature: function std::lenint64


Returns the number of elements of a given value.

This function works with the str, bytes and array types:

```edgeql-repl
db> select len('foo');
{3}

db> select len(b'bar');
{3}

db> select len([2, 5, 7]);
{3}
```

Type: function
Domain: eql
Summary: Returns true if the given sub-value exists within the given value.
Signature: function std::containsbool
Signature: function std::containsbool
Signature: function std::containsbool
Signature: function std::containsstd::bool
Signature: function std::containsstd::bool
Signature: function std::containsstd::bool
Signature: function std::containsstd::bool
Signature: function std::containsstd::bool


Returns true if the given sub-value exists within the given value.

When haystack is a str or a bytes value, this function will return true if it contains needle as a subsequence within it or false otherwise:

```edgeql-repl
db> select contains('qwerty', 'we');
{true}

db> select contains(b'qwerty', b'42');
{false}
```

When haystack is an array, the function will return true if the array contains the element specified as needle or false otherwise:

```edgeql-repl
db> select contains([2, 5, 7, 2, 100], 2);
{true}
```

When haystack is a range, the function will return true if it contains either the specified sub-range or element. The function will return false otherwise.

```edgeql-repl
db> select contains(range(1, 10), range(2, 5));
{true}

db> select contains(range(1, 10), range(2, 15));
{false}

db> select contains(range(1, 10), 2);
{true}

db> select contains(range(1, 10), 10);
{false}
```

When haystack is a multirange, the function will return true if it contains either the specified multirange, sub-range or element. The function will return false otherwise.

```edgeql-repl
db> select contains(
...   multirange([
...     range(1, 4), range(7),
...   ]),
...   multirange([
...     range(1, 2), range(8, 10),
...   ]),
... );
{true}

db> select contains(
...   multirange([
...     range(1, 4), range(8, 10),
...   ]),
...   range(8),
... );
{false}

db> select contains(
...   multirange([
...     range(1, 4), range(8, 10),
...   ]),
...   3,
... );
{true}
```

When haystack is JSON, the function will return true if the json data contains the element specified as needle or false otherwise:

```edgeql-repl
db> with haystack := to_json('{
...   "city": "Baerlon",
...   "city": "Caemlyn"
... }'),
... needle := to_json('{
...   "city": "Caemlyn"
... }'),
... select contains(haystack, needle);
{true}
```

Type: function
Domain: eql
Summary: Returns the index of a given sub-value in a given value.
Signature: function std::findint64
Signature: function std::findint64
Signature: function std::findint64


Returns the index of a given sub-value in a given value.

When haystack is a str or a bytes value, the function will return the index of the first occurrence of needle in it.

When haystack is an array, this will return the index of the the first occurrence of the element passed as needle. For array inputs it is also possible to provide an optional from_pos argument to specify the position from which to start the search.

If the needle is not found, return -1.

```edgeql-repl
db> select find('qwerty', 'we');
{1}

db> select find(b'qwerty', b'42');
{-1}

db> select find([2, 5, 7, 2, 100], 2);
{0}

db> select find([2, 5, 7, 2, 100], 2, 1);
{3}
```

