# Sets

| --- | --- |
| distinct set | Produces a set of all unique elements in the given set. |
| anytype in set | Checks if a given element is a member of a given set. |
| set union set | Merges two sets. |
| set intersect set | Produces a set containing the common items between the given sets. |
| set except set | Produces a set of all items in the first set which are not in the second. |
| exists set | Determines whether a set is empty or not. |
| set if bool else set | Produces one of two possible results based on a given condition. |
| optional anytype ?? set | Produces the first of its operands that is not an empty set. |
| detached | Detaches the input set reference from the current scope. |
| anytype [is type] | Filters a set based on its type. Will return back the specified type. |
| assert_distinct() | Checks that the input set contains only unique elements. |
| assert_single() | Checks that the input set contains no more than one element. |
| assert_exists() | Checks that the input set contains at least one element. |
| count() | Returns the number of elements in a set. |
| array_agg() | Returns an array made from all of the input set elements. |
| sum() | Returns the sum of the set of numbers. |
| all() | Returns true if none of the values in the given set are false. |
| any() | Returns true if any of the values in the given set is true. |
| enumerate() | Returns a set of tuples in the form of (index, element). |
| min() | Returns the smallest value in the given set. |
| max() | Returns the largest value in the given set. |
| math::mean() | Returns the arithmetic mean of the input set. |
| math::stddev() | Returns the sample standard deviation of the input set. |
| math::stddev_pop() | Returns the population standard deviation of the input set. |
| math::var() | Returns the sample variance of the input set. |
| math::var_pop() | Returns the population variance of the input set. |

Type: operator
Domain: eql
Summary: Produces a set of all unique elements in the given set.
Signature: operator distinct set of anytype -> set of anytype


Produces a set of all unique elements in the given set.

distinct is a set operator that returns a new set where no member is equal to any other member.

```edgeql-repl
db> select distinct {1, 2, 2, 3};
{1, 2, 3}
```

Type: operator
Domain: eql
Summary: Checks if a given element is a member of a given set.
Signature: operator anytype in set of anytype -> bool
Signature: operator anytype not in set of anytype -> bool


Checks if a given element is a member of a given set.

Set membership operators in and not in test whether each element of the left operand is present in the right operand. This means supplying a set as the left operand will produce a set of boolean results, one for each element in the left operand.

```edgeql-repl
db> select 1 in {1, 3, 5};
{true}

db> select 'Alice' in User.name;
{true}

db> select {1, 2} in {1, 3, 5};
{true, false}
```

This operator can also be used to implement set intersection:

```edgeql-repl
db> with
...     A := {1, 2, 3, 4},
...     B := {2, 4, 6}
... select A filter A in B;
{2, 4}
```

Type: operator
Domain: eql
Summary: Merges two sets.
Signature: operator set of anytype union set of anytype -> set of anytype


Merges two sets.

Since Gel sets are formally multisets, union is a multiset sum, so effectively it merges two multisets keeping all of their members.

For example, applying union to {1, 2, 2} and {2}, results in {1, 2, 2, 2}.

If you need a distinct union, wrap it with the distinct operator.

Type: operator
Domain: eql
Summary: Produces a set containing the common items between the given sets.
Signature: operator set of anytype intersect set of anytype                             -> set of anytype


Produces a set containing the common items between the given sets.

If you need a distinct intersection, wrap it with the distinct operator.

Type: operator
Domain: eql
Summary: Produces a set of all items in the first set which are not in the second.
Signature: operator set of anytype except set of anytype                             -> set of anytype


Produces a set of all items in the first set which are not in the second.

If you need a distinct set of exceptions, wrap it with the distinct operator.

Type: operator
Domain: eql
Summary: Produces one of two possible results based on a given condition.
Signature: operator set of anytype if bool else set of anytype                             -> set of anytype


Produces one of two possible results based on a given condition.

```edgeql-synopsis
<left_expr> if <condition> else <right_expr>
```

If the <condition> is true, the if...else expression produces the value of the <left_expr>. If the <condition> is false, however, the if...else expression produces the value of the <right_expr>.

```edgeql-repl
db> select 'real life' if 2 * 2 = 4 else 'dream';
{'real life'}
```

if..else expressions can be chained when checking multiple conditions is necessary:

```edgeql-repl
db> with color := 'yellow'
... select 'Apple' if color = 'red' else
...        'Banana' if color = 'yellow' else
...        'Orange' if color = 'orange' else
...        'Other';
{'Banana'}
```

It can be used to create, update, or delete different objects based on some condition:

```edgeql
with
  name := <str>$0,
  admin := <bool>$1
select (insert AdminUser { name := name }) if admin
  else (insert User { name := name });
```

Type: operator
Domain: eql
Summary: Produces one of two possible results based on a given condition.
Signature: operator if bool then set of anytype else set of                             anytype -> set of anytype


Produces one of two possible results based on a given condition.

Uses then for an alternative syntax order to if..else above.

```edgeql-synopsis
if <condition> then <left_expr> else <right_expr>
```

If the <condition> is true, the if...else expression produces the value of the <left_expr>. If the <condition> is false, however, the if...else expression produces the value of the <right_expr>.

```edgeql-repl
db> select if 2 * 2 = 4 then 'real life' else 'dream';
{'real life'}
```

if..else expressions can be chained when checking multiple conditions is necessary:

```edgeql-repl
db> with color := 'yellow', select
... if color = 'red' then
...   'Apple'
... else if color = 'yellow' then
...   'Banana'
... else if color = 'orange' then
...   'Orange'
... else
...   'Other';
{'Banana'}
```

It can be used to create, update, or delete different objects based on some condition:

```edgeql
with
  name := <str>$0,
  admin := <bool>$1
select if admin then (
    insert AdminUser { name := name }
) else (
    insert User { name := name }
)
```

Type: operator
Domain: eql
Summary: Produces the first of its operands that is not an empty set.
Signature: operator optional anytype ?? set of anytype                           -> set of anytype


Produces the first of its operands that is not an empty set.

This evaluates to A for an non-empty A, otherwise evaluates to B.

A typical use case of the coalescing operator is to provide default values for optional properties:

```edgeql
# Get a set of tuples (<issue name>, <priority>)
# for all issues.
select (Issue.name, Issue.priority.name ?? 'n/a');
```

Without the coalescing operator, the above query will skip any Issue without priority.

The coalescing operator can be used to express things like “select or insert if missing”:

```edgeql
select
  (select User filter .name = 'Alice') ??
  (insert User { name := 'Alice' });
```

Type: operator
Domain: eql
Summary: Detaches the input set reference from the current scope.
Signature: operator detached set of anytype -> set of anytype


Detaches the input set reference from the current scope.

A detached expression allows referring to some set as if it were defined in the top-level with block. detached expressions ignore all current scopes in which they are nested. This makes it possible to write queries that reference the same set reference in multiple places.

```edgeql
update User
filter .name = 'Dave'
set {
    friends := (select detached User filter .name = 'Alice'),
    coworkers := (select detached User filter .name = 'Bob')
};
```

Without detached, the occurrences of User inside the set shape would be bound to the set of users named "Dave". However, in this context we want to run an unrelated query on the “unbound” User set.

```edgeql
# does not work!
update User
filter .name = 'Dave'
set {
    friends := (select User filter .name = 'Alice'),
    coworkers := (select User filter .name = 'Bob')
};
```

Instead of explicitly detaching a set, you can create a reference to it in a with block. All declarations inside a with block are implicitly detached.

```edgeql
with U1 := User,
     U2 := User
update User
filter .name = 'Dave'
set {
    friends := (select U1 filter .name = 'Alice'),
    coworkers := (select U2 filter .name = 'Bob')
};
```

Type: operator
Domain: eql
Summary: Determines whether a set is empty or not.
Signature: operator exists set of anytype -> bool


Determines whether a set is empty or not.

exists is an aggregate operator that returns a singleton set {true} if the input set is not empty, and returns {false} otherwise:

```edgeql-repl
db> select exists {1, 2};
{true}
```

Type: operator
Domain: eql
Summary: Filters a set based on its type. Will return back the specified type.
Signature: operator anytype [is type] -> anytype


Filters a set based on its type. Will return back the specified type.

The type intersection operator removes all elements from the input set that aren’t of the specified type. Additionally, since it guarantees the type of the result set, all the links and properties associated with the specified type can now be used on the resulting expression. This is especially useful in combination with backlinks.

Consider the following types:

```sdl
type User {
    required name: str;
}

abstract type Owned {
    required owner: User;
}

type Issue extending Owned {
    required title: str;
}

type Comment extending Owned {
    required body: str;
}
```

The following expression will get all Objects owned by all users (if there are any):

```edgeql
select User.<owner;
```

By default, backlinks don’t infer any type information beyond the fact that it’s an Object. To ensure that this path specifically reaches Issue, the type intersection operator must then be used:

```edgeql
select User.<owner[is Issue];

# With the use of type intersection it's possible to refer
# to a specific property of Issue now:
select User.<owner[is Issue].title;
```

Type: function
Domain: eql
Summary: Checks that the input set contains only unique elements.
Signature: function std::assert_distinctset of anytype


Checks that the input set contains only unique elements.

If the input set contains duplicate elements (i.e. it is not a proper set), assert_distinct raises a ConstraintViolationError. Otherwise, this function returns the input set.

This function is useful as a runtime distinctness assertion in queries and computed expressions that should always return proper sets, but where static multiplicity inference is not capable enough or outright impossible. An optional message named argument can be used to customize the error message:

```edgeql-repl
db> select assert_distinct(
...   (select User filter .groups.name = "Administrators")
...   union
...   (select User filter .groups.name = "Guests")
... )
{default::User {id: ...}}

db> select assert_distinct(
...   (select User filter .groups.name = "Users")
...   union
...   (select User filter .groups.name = "Guests")
... )
ERROR: ConstraintViolationError: assert_distinct violation: expression
       returned a set with duplicate elements.

db> select assert_distinct(
...   (select User filter .groups.name = "Users")
...   union
...   (select User filter .groups.name = "Guests"),
...   message := "duplicate users!"
... )
ERROR: ConstraintViolationError: duplicate users!
```

Type: function
Domain: eql
Summary: Checks that the input set contains no more than one element.
Signature: function std::assert_singleset of anytype


Checks that the input set contains no more than one element.

If the input set contains more than one element, assert_single raises a CardinalityViolationError. Otherwise, this function returns the input set.

This function is useful as a runtime cardinality assertion in queries and computed expressions that should always return sets with at most a single element, but where static cardinality inference is not capable enough or outright impossible. An optional message named argument can be used to customize the error message.

```edgeql-repl
db> select assert_single((select User filter .name = "Unique"))
{default::User {id: ...}}

db> select assert_single((select User))
ERROR: CardinalityViolationError: assert_single violation: more than
       one element returned by an expression

db> select assert_single((select User), message := "too many users!")
ERROR: CardinalityViolationError: too many users!
```

Type: function
Domain: eql
Summary: Checks that the input set contains at least one element.
Signature: function std::assert_existsset of anytype


Checks that the input set contains at least one element.

If the input set is empty, assert_exists raises a CardinalityViolationError.  Otherwise, this function returns the input set.

This function is useful as a runtime existence assertion in queries and computed expressions that should always return sets with at least a single element, but where static cardinality inference is not capable enough or outright impossible. An optional message named argument can be used to customize the error message.

```edgeql-repl
db> select assert_exists((select User filter .name = "Administrator"))
{default::User {id: ...}}

db> select assert_exists((select User filter .name = "Nonexistent"))
ERROR: CardinalityViolationError: assert_exists violation: expression
       returned an empty set.

db> select assert_exists(
...   (select User filter .name = "Nonexistent"),
...   message := "no users!"
... )
ERROR: CardinalityViolationError: no users!
```

Type: function
Domain: eql
Summary: Returns the number of elements in a set.
Signature: function std::countint64


Returns the number of elements in a set.

```edgeql-repl
db> select count({2, 3, 5});
{3}

db> select count(User);  # number of User objects in db
{4}
```

Type: function
Domain: eql
Summary: Returns the sum of the set of numbers.
Signature: function std::sumint64
Signature: function std::sumint64
Signature: function std::sumfloat32
Signature: function std::sumfloat64
Signature: function std::sumbigint
Signature: function std::sumdecimal


Returns the sum of the set of numbers.

The result type depends on the input set type. The general rule of thumb is that the type of the input set is preserved (as if a simple + was used) while trying to reduce the chance of an overflow (so all integers produce int64 sum).

```edgeql-repl
db> select sum({2, 3, 5});
{10}

db> select sum({0.2, 0.3, 0.5});
{1.0}
```

Type: function
Domain: eql
Summary: Returns true if none of the values in the given set are false.
Signature: function std::allbool


Returns true if none of the values in the given set are false.

The result is true if all of the values are true or the set of values is {}, with false returned otherwise.

```edgeql-repl
db> select all(<bool>{});
{true}

db> select all({1, 2, 3, 4} < 4);
{false}
```

Type: function
Domain: eql
Summary: Returns true if any of the values in the given set is true.
Signature: function std::anybool


Returns true if any of the values in the given set is true.

The result is true if any of the values are true, with false returned otherwise.

```edgeql-repl
db> select any(<bool>{});
{false}

db> select any({1, 2, 3, 4} < 4);
{true}
```

Type: function
Domain: eql
Summary: Returns a set of tuples in the form of (index, element).
Signature: function std::enumerateset of tuple<int64, anytype>


Returns a set of tuples in the form of (index, element).

The enumerate() function takes any set and produces a set of tuples containing the zero-based index number and the value for each element.

```edgeql-repl
db> select enumerate({2, 3, 5});
{(1, 3), (0, 2), (2, 5)}
```

```edgeql-repl
db> select enumerate(User.name);
{(0, 'Alice'), (1, 'Bob'), (2, 'Dave')}
```

Type: function
Domain: eql
Summary: Returns the smallest value in the given set.
Signature: function std::minoptional anytype


Returns the smallest value in the given set.

```edgeql-repl
db> select min({-1, 100});
{-1}
```

Type: function
Domain: eql
Summary: Returns the largest value in the given set.
Signature: function std::maxoptional anytype


Returns the largest value in the given set.

```edgeql-repl
db> select max({-1, 100});
{100}
```

