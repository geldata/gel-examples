# Arrays

| --- | --- |
| array[i] | Accesses the array element at a given index. |
| array[from:to] | Produces a sub-array from an existing array. |
| array ++ array | Concatenates two arrays of the same type into one. |
| = != ?= ?!= < > <= >= | Comparison operators |
| len() | Returns the number of elements in the array. |
| contains() | Checks if an element is in the array. |
| find() | Finds the index of an element in the array. |
| array_join() | Renders an array to a string or byte-string. |
| array_fill() | Returns an array of the specified size, filled with the provided value. |
| array_replace() | Returns an array with all occurrences of one value replaced by another. |
| array_set() | Returns an array with an value at a specific index replaced by another. |
| array_insert() | Returns an array with an value inserted at a specific. |
| array_agg() | Returns an array made from all of the input set elements. |
| array_get() | Returns the element of a given array at the specified index. |
| array_unpack() | Returns the elements of an array as a set. |

Arrays store expressions of the same type in an ordered list.

## Constructing arrays

An array constructor is an expression that consists of a sequence of comma-separated expressions of the same type enclosed in square brackets. It produces an array value:

```edgeql-synopsis
"[" <expr> [, ...] "]"
```

For example:

```edgeql-repl
db> select [1, 2, 3];
{[1, 2, 3]}
db> select [('a', 1), ('b', 2), ('c', 3)];
{[('a', 1), ('b', 2), ('c', 3)]}
```

## Empty arrays

You can also create an empty array, but it must be done by providing the type information using type casting. Gel cannot infer the type of an empty array created otherwise. For example:

```edgeql-repl
db> select [];
QueryError: expression returns value of indeterminate type
Hint: Consider using an explicit type cast.
### select [];
###        ^

db> select <array<int64>>[];
{[]}
```

## Reference

Type: type
Domain: eql
Summary: An ordered list of values of the same type.
Signature: type array


An ordered list of values of the same type.

Array indexing starts at zero.

An array can contain any type except another array. In Gel, arrays are always one-dimensional.

An array type is created implicitly when an array constructor is used:

```edgeql-repl
db> select [1, 2];
{[1, 2]}
```

The array types themselves are denoted by array followed by their sub-type in angle brackets. These may appear in cast operations:

```edgeql-repl
db> select <array<str>>[1, 4, 7];
{['1', '4', '7']}
db> select <array<bigint>>[1, 4, 7];
{[1n, 4n, 7n]}
```

Array types may also appear in schema declarations:

```sdl
type Person {
    str_array: array<str>;
    json_array: array<json>;
}
```

See also the list of standard array functions, as well as generic functions such as len().

Type: operator
Domain: eql
Summary: Accesses the array element at a given index.
Signature: operator array<anytype> [ int64 ] -> anytype


Accesses the array element at a given index.

Example:

```edgeql-repl
db> select [1, 2, 3][0];
{1}
db> select [(x := 1, y := 1), (x := 2, y := 3.3)][1];
{(x := 2, y := 3.3)}
```

This operator also allows accessing elements from the end of the array using a negative index:

```edgeql-repl
db> select [1, 2, 3][-1];
{3}
```

Referencing a non-existent array element will result in an error:

```edgeql-repl
db> select [1, 2, 3][4];
InvalidValueError: array index 4 is out of bounds
```

Type: operator
Domain: eql
Summary: Produces a sub-array from an existing array.
Signature: operator array<anytype> [ int64 : int64 ] -> anytype


Produces a sub-array from an existing array.

Omitting the lower bound of an array slice will default to a lower bound of zero.

Omitting the upper bound will default the upper bound to the length of the array.

The lower bound of an array slice is inclusive while the upper bound is not.

Examples:

```edgeql-repl
db> select [1, 2, 3][0:2];
{[1, 2]}
db> select [1, 2, 3][2:];
{[3]}
db> select [1, 2, 3][:1];
{[1]}
db> select [1, 2, 3][:-2];
{[1]}
```

Referencing an array slice beyond the array boundaries will result in an empty array (unlike a direct reference to a specific index). Slicing with a lower bound less than the minimum index or a upper bound greater than the maximum index are functionally equivalent to not specifying those bounds for your slice:

```edgeql-repl
db> select [1, 2, 3][1:20];
{[2, 3]}
db> select [1, 2, 3][10:20];
{[]}
```

Type: operator
Domain: eql
Summary: Concatenates two arrays of the same type into one.
Signature: operator array<anytype> ++ array<anytype> -> array<anytype>


Concatenates two arrays of the same type into one.

```edgeql-repl
db> select [1, 2, 3] ++ [99, 98];
{[1, 2, 3, 99, 98]}
```

Type: function
Domain: eql
Summary: Returns an array made from all of the input set elements.
Signature: function std::array_aggarray<anytype>


Returns an array made from all of the input set elements.

The ordering of the input set will be preserved if specified:

```edgeql-repl
db> select array_agg({2, 3, 5});
{[2, 3, 5]}

db> select array_agg(User.name order by User.name);
{['Alice', 'Bob', 'Joe', 'Sam']}
```

Type: function
Domain: eql
Summary: Returns the element of a given array at the specified index.
Signature: function std::array_getoptional anytype


Returns the element of a given array at the specified index.

If the index is out of the array’s bounds, the default argument or {} (empty set) will be returned.

This works the same as the array indexing operator, except that if the index is out of bounds, an empty set of the array element’s type is returned instead of raising an exception:

```edgeql-repl
db> select array_get([2, 3, 5], 1);
{3}
db> select array_get([2, 3, 5], 100);
{}
db> select array_get([2, 3, 5], 100, default := 42);
{42}
```

Type: function
Domain: eql
Summary: Returns the elements of an array as a set.
Signature: function std::array_unpackset of anytype


Returns the elements of an array as a set.

```edgeql-repl
db> select array_unpack([2, 3, 5]);
{3, 2, 5}

db> select enumerate(array_unpack([2, 3, 5]));
{(1, 3), (0, 2), (2, 5)}
```

Type: function
Domain: eql
Summary: Renders an array to a string or byte-string.
Signature: function std::array_joinstr
Signature: function std::array_joinbytes


Renders an array to a string or byte-string.

Join a string array into a single string using a specified delimiter:

```edgeql-repl
db> select array_join(['one', 'two', 'three'], ', ');
{'one, two, three'}
```

Similarly, an array of bytes can be joined as a single value using a specified delimiter:

```edgeql-repl
db> select array_join([b'\x01', b'\x02', b'\x03'], b'\xff');
{b'\x01\xff\x02\xff\x03'}
```

Type: function
Domain: eql
Summary: Returns an array of the specified size, filled with the provided value.
Signature: function std::array_fillarray<anytype>


Returns an array of the specified size, filled with the provided value.

Create an array of size n where every element has the value val.

```edgeql-repl
db> select array_fill(0, 5);
{[0, 0, 0, 0, 0]}
db> select array_fill('n/a', 3);
{['n/a', 'n/a', 'n/a']}
```

Type: function
Domain: eql
Summary: Returns an array with all occurrences of one value replaced by another.
Signature: function std::array_replacearray<anytype>


Returns an array with all occurrences of one value replaced by another.

Return an array where every old value is replaced with new.

```edgeql-repl
db> select array_replace([1, 1, 2, 3, 5], 1, 99);
{[99, 99, 2, 3, 5]}
db> select array_replace(['h', 'e', 'l', 'l', 'o'], 'l', 'L');
{['h', 'e', 'L', 'L', 'o']}
```

Type: function
Domain: eql
Summary: Returns an array with an value at a specific index replaced by another.
Signature: function std::array_setarray<anytype>


Returns an array with an value at a specific index replaced by another.

Return an array where the value at the index indicated by idx is replaced with val.

```edgeql-repl
db> select array_set(['hello', 'world'], 0, 'goodbye');
{['goodbye', 'world']}
db> select array_set([1, 1, 2, 3], 1, 99);
{[1, 99, 2, 3]}
```

Type: function
Domain: eql
Summary: Returns an array with an value inserted at a specific.
Signature: function std::array_insertarray<anytype>


Returns an array with an value inserted at a specific.

Return an array where the value val is inserted at the index indicated by idx.

```edgeql-repl
db> select array_insert(['the', 'brown', 'fox'], 1, 'quick');
{['the', 'quick', 'brown', 'fox']}
db> select array_insert([1, 1, 2, 3], 1, 99);
{[1, 99, 1, 2, 3]}
```

