# Booleans

| --- | --- |
| bool | Boolean type |
| bool or bool | Evaluates true if either boolean is true. |
| bool and bool | Evaluates true if both booleans are true. |
| not bool | Logically negates a given boolean value. |
| = != ?= ?!= < > <= >= | Comparison operators |
| all() | Returns true if none of the values in the given set are false. |
| any() | Returns true if any of the values in the given set is true. |
| assert() | Checks that the input bool is true. |

Type: type
Domain: eql
Summary: A boolean type of either true or false.
Signature: type bool


A boolean type of either true or false.

EdgeQL has case-insensitive keywords and that includes the boolean literals:

```edgeql-repl
db> select (True, true, TRUE);
{(true, true, true)}
db> select (False, false, FALSE);
{(false, false, false)}
```

These basic operators will always result in a boolean type value (although, for some of them, that value may be the empty set if an operand is the empty set):

These operators will result in a boolean type value even if the right operand is the empty set:

These operators will always result in a boolean true or false value, even if either operand is the empty set:

These operators will produce the empty set if either operand is the empty set:

If you need to use these operators and it’s possible one or both operands will be the empty set, you can ensure a bool product by coalescing. With = and !=, you can use their respective dedicated coalescing operators, ?= and ?!=. See each individual operator for an example.

Some boolean operator examples:

```edgeql-repl
db> select true and 2 < 3;
{true}
db> select '!' IN {'hello', 'world'};
{false}
```

It’s possible to get a boolean by casting a str or json value into it:

```edgeql-repl
db> select <bool>('true');
{true}
db> select <bool>to_json('false');
{false}
```

Filter clauses must always evaluate to a boolean:

```edgeql
select User
filter .name ilike 'alice';
```

Type: operator
Domain: eql
Summary: Evaluates true if either boolean is true.
Signature: operator bool or bool -> bool


Evaluates true if either boolean is true.

```edgeql-repl
db> select false or true;
{true}
```

Type: operator
Domain: eql
Summary: Evaluates true if both booleans are true.
Signature: operator bool and bool -> bool


Evaluates true if both booleans are true.

```edgeql-repl
db> select false and true;
{false}
```

Type: operator
Domain: eql
Summary: Logically negates a given boolean value.
Signature: operator not bool -> bool


Logically negates a given boolean value.

```edgeql-repl
db> select not false;
{true}
```

The and and or operators are commutative.

The truth tables are as follows:

| a | b | a and b | a or b | not a |
| --- | --- | --- | --- | --- |
| true | true | true | true | false |
| true | false | false | true | false |
| false | true | false | true | true |
| false | false | false | false | true |

The operators and/or and the functions all()/any() differ in the way they handle an empty set ({}). Both and and or operators apply to the cross-product of their operands. If either operand is an empty set, the result will also be an empty set. For example:

```edgeql-repl
db> select {true, false} and <bool>{};
{}
db> select true and <bool>{};
{}
```

Operating on an empty set with all()/any() does not return an empty set:

```edgeql-repl
db> select all(<bool>{});
{true}
db> select any(<bool>{});
{false}
```

all() returns true because the empty set contains no false values.

any() returns false because the empty set contains no true values.

The all() and any() functions are generalized to apply to sets of values, including {}. Thus they have the following truth table:

| a | b | all({a, b}) | any({a, b}) |
| --- | --- | --- | --- |
| true | true | true | true |
| true | false | false | true |
| {} | true | true | true |
| {} | false | false | false |
| false | true | false | true |
| false | false | false | false |
| true | {} | true | true |
| false | {} | false | false |
| {} | {} | true | false |

Since all() and any() apply to sets as a whole, missing values (represented by {}) are just that - missing. They don’t affect the overall result.

To understand the last line in the above truth table it’s useful to remember that all({a, b}) = all(a) and all(b) and any({a, b}) = any(a) or any(b).

For more customized handling of {}, use the ?? operator.

Type: function
Domain: eql
Summary: Checks that the input bool is true.
Signature: function std::assertbool


Checks that the input bool is true.

If the input bool is false, assert raises a QueryAssertionError. Otherwise, this function returns true.

```edgeql-repl
db> select assert(true);
{true}

db> select assert(false);
gel error: QueryAssertionError: assertion failed

db> select assert(false, message := 'value is not true');
gel error: QueryAssertionError: value is not true
```

assert can be used in triggers to create more powerful constraints. In this schema, the Person type has both friends and enemies links. You may not want a Person to be both a friend and an enemy of the same Person. assert can be used inside a trigger to easily prohibit this.

```sdl
type Person {
  required name: str;
  multi friends: Person;
  multi enemies: Person;

  trigger prohibit_frenemies after insert, update for each do (
    assert(
      not exists (__new__.friends intersect __new__.enemies),
      message := "Invalid frenemies",
    )
  )
}
```

With this trigger in place, it is impossible to link the same Person as both a friend and an enemy of any other person.

```edgeql-repl
db> insert Person {name := 'Quincey Morris'};
{default::Person {id: e4a55480-d2de-11ed-93bd-9f4224fc73af}}
db> insert Person {name := 'Dracula'};
{default::Person {id: e7f2cff0-d2de-11ed-93bd-279780478afb}}
db> update Person
... filter .name = 'Quincey Morris'
... set {
...   enemies := (
...     select detached Person filter .name = 'Dracula'
...   )
... };
{default::Person {id: e4a55480-d2de-11ed-93bd-9f4224fc73af}}
db> update Person
... filter .name = 'Quincey Morris'
... set {
...   friends := (
...     select detached Person filter .name = 'Dracula'
...   )
... };
gel error: GelError: Invalid frenemies
```

In the following examples, the size properties of the File objects are 1024, 1024, and 131,072.

```edgeql-repl
db> for obj in (select File)
... union (assert(obj.size <= 128*1024, message := 'file too big'));
{true, true, true}

db> for obj in (select File)
... union (assert(obj.size <= 64*1024, message := 'file too big'));
gel error: QueryAssertionError: file too big
```

You may call assert in the order by clause of your select statement. This will ensure it is called only on objects that pass your filter.

```edgeql-repl
db> select File { name, size }
... order by assert(.size <= 128*1024, message := "file too big");
{
  default::File {name: 'File 2', size: 1024},
  default::File {name: 'Asdf 3', size: 1024},
  default::File {name: 'File 1', size: 131072},
}

db> select File { name, size }
... order by assert(.size <= 64*1024, message := "file too big");
gel error: QueryAssertionError: file too big

db> select File { name, size }
... filter .size <= 64*1024
... order by assert(.size <= 64*1024, message := "file too big");
{
  default::File {name: 'File 2', size: 1024},
  default::File {name: 'Asdf 3', size: 1024}
}
```

