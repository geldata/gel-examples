# Strings

| --- | --- |
| str | String |
| str[i] | String indexing. |
| str[from:to] | String slicing. |
| str ++ str | String concatenation. |
| str like pattern | Case-sensitive simple string matching. |
| str ilike pattern | Case-insensitive simple string matching. |
| = != ?= ?!= < > <= >= | Comparison operators |
| to_str() | Returns the string representation of the input value. |
| len() | Returns a string’s length. |
| contains() | Tests if a string contains a substring. |
| find() | Finds the index of a substring. |
| str_lower() | Returns a lowercase copy of the input string. |
| str_upper() | Returns an uppercase copy of the input string. |
| str_title() | Returns a titlecase copy of the input string. |
| str_pad_start() | Returns the input string padded at the start to the length n. |
| str_pad_end() | Returns the input string padded at the end to the length n. |
| str_trim() | Returns the input string with trim characters removed from both ends. |
| str_trim_start() | Returns the input string with all trim characters removed from the start. |
| str_trim_end() | Returns the input string with all trim characters removed from the end. |
| str_repeat() | Repeats the input string n times. |
| str_replace() | Replaces all occurrences of a substring with a new one. |
| str_reverse() | Reverses the order of the characters in the string. |
| str_split() | Splits a string into an array using a delimiter. |
| re_match() | Finds the first regular expression match in a string. |
| re_match_all() | Finds all regular expression matches in a string. |
| re_replace() | Replaces matching substrings in a given string. |
| re_test() | Tests if a regular expression has a match in a string. |

Type: type
Domain: eql
Summary: A unicode string of text.
Signature: type str


A unicode string of text.

Most primitive types (except bytes) can be cast to and from a string:

```edgeql-repl
db> select <str>42;
{'42'}
db> select <bool>'true';
{true}
db> select "I ❤️ Gel";
{'I ❤️ Gel'}
```

Note that when a str is cast into a json, the result is a JSON string value. The same applies for casting back from json - only a JSON string value can be cast into a str:

```edgeql-repl
db> select <json>'Hello, world';
{'"Hello, world"'}
```

There are two kinds of string literals in EdgeQL: regular and raw. Raw string literals do not evaluate \, so \n in in a raw string is two characters \ and n.

The regular string literal syntax is 'a string' or a "a string". Two raw string syntaxes are illustrated below:

```edgeql-repl
db> select r'A raw \n string';
{'A raw \\n string'}
db> select 'Not a raw \n string';
{
  'Not a raw
 string',
}
db> select $$something$$;
{'something'}
db> select $marker$something $$
... nested \!$$$marker$;
{'something $$
nested \!$$'}
```

Regular strings use \ to indicate line continuation. When a line continuation symbol is encountered, the symbol itself as well as all the whitespace characters up to the next non-whitespace character are omitted from the string:

```edgeql-repl
db> select 'Hello, \
...         world';
{'"Hello, world"'}
```

Type: operator
Domain: eql
Summary: String indexing.
Signature: operator str [ int64 ] -> str


String indexing.

Indexing starts at 0. Negative indexes are also valid and count from the end of the string.

```edgeql-repl
db> select 'some text'[1];
{'o'}
db> select 'some text'[-1];
{'t'}
```

It is an error to attempt to extract a character at an index outside the bounds of the string:

```edgeql-repl
db> select 'some text'[8];
{'t'}
db> select 'some text'[9];
InvalidValueError: string index 9 is out of bounds
```

A slice up to the next index can be used if an empty string is preferred to an error when outside the bounds of the string:

```edgeql-repl
db> select 'some text'[8:9];
{'t'}
db> select 'some text'[9:10];
{''}
```

Type: operator
Domain: eql
Summary: String slicing.
Signature: operator str [ int64 : int64 ] -> str


String slicing.

Indexing starts at 0. Negative indexes are also valid and count from the end of the string.

```edgeql-repl
db> select 'some text'[1:3];
{'om'}
db> select 'some text'[-4:];
{'text'}
db> select 'some text'[:-5];
{'some'}
db> select 'some text'[5:-2];
{'te'}
```

It is perfectly acceptable to use indexes outside the bounds of a string in a slice:

```edgeql-repl
db> select 'some text'[-4:100];
{'text'}
db> select 'some text'[-100:-5];
{'some'}
```

Type: operator
Domain: eql
Summary: String concatenation.
Signature: operator str ++ str -> str


String concatenation.

```edgeql-repl
db> select 'some' ++ ' text';
{'some text'}
```

Type: operator
Domain: eql
Summary: Case-sensitive simple string matching.
Signature: operator str like str -> bool
Signature: operator str not like str -> bool


Case-sensitive simple string matching.

Returns true if the value (the str on the left) matches the pattern (the str on the right) and false otherwise. The operator not like is the negation of like.

The pattern matching rules are as follows:

In particular, this means that if there are no special symbols in the pattern, the operators like and not like work identical to = and !=, respectively.

```edgeql-repl
db> select 'abc' like 'abc';
{true}
db> select 'abc' like 'a%';
{true}
db> select 'abc' like '_b_';
{true}
db> select 'abc' like 'c';
{false}
db> select 'a%%c' not like r'a\%c';
{true}
```

Type: operator
Domain: eql
Summary: Case-insensitive simple string matching.
Signature: operator str ilike str -> bool
Signature: operator str not ilike str -> bool


Case-insensitive simple string matching.

The operators ilike and not ilike work the same way as like and not like, except that the pattern is matched in a case-insensitive manner.

```edgeql-repl
db> select 'Abc' ilike 'a%';
{true}
```

Type: function
Domain: eql
Summary: Returns a lowercase copy of the input string.
Signature: function std::str_lowerstr


Returns a lowercase copy of the input string.

```edgeql-repl
db> select str_lower('Some Fancy Title');
{'some fancy title'}
```

Type: function
Domain: eql
Summary: Returns an uppercase copy of the input string.
Signature: function std::str_upperstr


Returns an uppercase copy of the input string.

```edgeql-repl
db> select str_upper('Some Fancy Title');
{'SOME FANCY TITLE'}
```

Type: function
Domain: eql
Summary: Returns a titlecase copy of the input string.
Signature: function std::str_titlestr


Returns a titlecase copy of the input string.

Every word in the string will have the first letter capitalized and the rest converted to lowercase.

```edgeql-repl
db> select str_title('sOmE fAnCy TiTlE');
{'Some Fancy Title'}
```

Type: function
Domain: eql
Summary: Returns the input string padded at the start to the length n.
Signature: function std::str_pad_startstr


Returns the input string padded at the start to the length n.

If the string is longer than n, then it is truncated to the first n characters. Otherwise, the string is padded on the left up to the total length n using fill characters (space by default).

```edgeql-repl
db> select str_pad_start('short', 10);
{'     short'}
db> select str_pad_start('much too long', 10);
{'much too l'}
db> select str_pad_start('short', 10, '.:');
{'.:.:.short'}
```

Type: function
Domain: eql
Summary: Returns the input string padded at the end to the length n.
Signature: function std::str_pad_endstr


Returns the input string padded at the end to the length n.

If the string is longer than n, then it is truncated to the first n characters. Otherwise, the string is padded on the right up to the total length n using fill characters (space by default).

```edgeql-repl
db> select str_pad_end('short', 10);
{'short     '}
db> select str_pad_end('much too long', 10);
{'much too l'}
db> select str_pad_end('short', 10, '.:');
{'short.:.:.'}
```

Type: function
Domain: eql
Summary: Returns the input string with all trim characters removed from the start.
Signature: function std::str_trim_startstr


Returns the input string with all trim characters removed from the start.

If trim specifies more than one character they will be removed from the beginning of the string regardless of the order in which they appear.

```edgeql-repl
db> select str_trim_start('     data');
{'data'}
db> select str_trim_start('.....data', '.:');
{'data'}
db> select str_trim_start(':::::data', '.:');
{'data'}
db> select str_trim_start(':...:data', '.:');
{'data'}
db> select str_trim_start('.:.:.data', '.:');
{'data'}
```

Type: function
Domain: eql
Summary: Returns the input string with all trim characters removed from the end.
Signature: function std::str_trim_endstr


Returns the input string with all trim characters removed from the end.

If trim specifies more than one character they will be removed from the end of the string regardless of the order in which they appear.

```edgeql-repl
db> select str_trim_end('data     ');
{'data'}
db> select str_trim_end('data.....', '.:');
{'data'}
db> select str_trim_end('data:::::', '.:');
{'data'}
db> select str_trim_end('data:...:', '.:');
{'data'}
db> select str_trim_end('data.:.:.', '.:');
{'data'}
```

Type: function
Domain: eql
Summary: Returns the input string with trim characters removed from both ends.
Signature: function std::str_trimstr


Returns the input string with trim characters removed from both ends.

If trim specifies more than one character they will be removed from both ends of the string regardless of the order in which they appear. This is the same as applying str_trim_start() and str_trim_end().

```edgeql-repl
db> select str_trim('  data     ');
{'data'}
db> select str_trim('::data.....', '.:');
{'data'}
db> select str_trim('..data:::::', '.:');
{'data'}
db> select str_trim('.:data:...:', '.:');
{'data'}
db> select str_trim(':.:.data.:.', '.:');
{'data'}
```

Type: function
Domain: eql
Summary: Repeats the input string n times.
Signature: function std::str_repeatstr


Repeats the input string n times.

An empty string is returned if n is zero or negative.

```edgeql-repl
db> select str_repeat('.', 3);
{'...'}
db> select str_repeat('foo', -1);
{''}
```

Type: function
Domain: eql
Summary: Replaces all occurrences of a substring with a new one.
Signature: function std::str_replacestr


Replaces all occurrences of a substring with a new one.

Given a string s, finds all non-overlapping occurrences of the substring old and replaces them with the substring new.

```edgeql-repl
db> select str_replace('hello world', 'h', 'H');
{'Hello world'}
db> select str_replace('hello world', 'l', '[L]');
{'he[L][L]o wor[L]d'}
db> select str_replace('hello world', 'o', '😄');
{'hell😄 w😄rld'}
```

Type: function
Domain: eql
Summary: Reverses the order of the characters in the string.
Signature: function std::str_reversestr


Reverses the order of the characters in the string.

```edgeql-repl
db> select str_reverse('Hello world');
{'dlrow olleH'}
db> select str_reverse('Hello 👋 world 😄');
{'😄 dlrow 👋 olleH'}
```

Type: function
Domain: eql
Summary: Splits a string into array elements using the supplied delimiter.
Signature: function std::str_splitarray<str>


Splits a string into array elements using the supplied delimiter.

```edgeql-repl
db> select str_split('1, 2, 3', ', ');
{['1', '2', '3']}
```

```edgeql-repl
db> select str_split('123', '');
{['1', '2', '3']}
```

Type: function
Domain: eql
Summary: Finds the first regular expression match in a string.
Signature: function std::re_matcharray<str>


Finds the first regular expression match in a string.

Given an input string and a regular expression pattern, finds the first match for the regular expression within the string. Each match returned is represented by an array<str> of matched groups.

```edgeql-repl
db> select re_match(r'\w{4}ql', 'I ❤️ edgeql');
{['edgeql']}
```

Type: function
Domain: eql
Summary: Finds all regular expression matches in a string.
Signature: function std::re_match_allset of array<str>


Finds all regular expression matches in a string.

Given an input string and a regular expression pattern, repeatedly matches the regular expression within the string. Returns the set of all matches, with each match represented by an array<str> of matched groups.

```edgeql-repl
db> select re_match_all(r'a\w+', 'an abstract concept');
{['an'], ['abstract']}
```

Type: function
Domain: eql
Summary: Replaces matching substrings in a given string.
Signature: function std::re_replacestr


Replaces matching substrings in a given string.

Takes an input string and a regular expression pattern, replacing matching substrings with the replacement string sub. Optional flag arguments can be used to specify additional regular expression flags.

```edgeql-repl
db> select re_replace('a', 'A', 'Alabama');
{'AlAbama'}
db> select re_replace('a', 'A', 'Alabama', flags := 'g');
{'AlAbAmA'}
db> select re_replace('A', 'A', 'Alabama', flags := 'ig');
{'AlAbAmA'}
```

Type: function
Domain: eql
Summary: Tests if a regular expression has a match in a string.
Signature: function std::re_testbool


Tests if a regular expression has a match in a string.

Given an input string and a regular expression pattern, tests whether there is a match for the regular expression within the string. Returns true if there is a match, false otherwise.

```edgeql-repl
db> select re_test(r'a', 'abc');
{true}
```

Type: function
Domain: eql
Summary: Returns the string representation of the input value.
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr
Signature: function std::to_strstr


Returns the string representation of the input value.

A versatile polymorphic function defined for different input types, to_str uses corresponding converter functions from str to specific types via the format argument fmt.

When converting bytes, datetime, cal::local_datetime, cal::local_date, cal::local_time, duration this function is the inverse of to_bytes(), to_datetime(), cal::to_local_datetime(), cal::to_local_date(), cal::to_local_time(), to_duration(), correspondingly.

For valid date and time formatting patterns see here.

```edgeql-repl
db> select to_str(<datetime>'2018-05-07 15:01:22.306916-05',
...               'FMDDth "of" FMMonth, YYYY');
{'7th of May, 2018'}
db> select to_str(<cal::local_date>'2018-05-07', 'CCth "century"');
{'21st century'}
```

When converting one of the numeric types, this function is the reverse of: to_bigint(), to_decimal(), to_int16(), to_int32(), to_int64(), to_float32(), to_float64().

For valid number formatting patterns see here.

See also to_json().

```edgeql-repl
db> select to_str(123, '999999');
{'    123'}
db> select to_str(123, '099999');
{' 000123'}
db> select to_str(123.45, 'S999.999');
{'+123.450'}
db> select to_str(123.45e-20, '9.99EEEE');
{' 1.23e-18'}
db> select to_str(-123.45n, 'S999.99');
{'-123.45'}
```

When converting json, this function can take 'pretty' as an optional fmt argument to produce a pretty-formatted JSON string.

See also to_json().

```edgeql-repl
db> select to_str(<json>2);
{'2'}

db> select to_str(<json>['hello', 'world']);
{'["hello", "world"]'}

db> select to_str(<json>(a := 2, b := 'hello'), 'pretty');
{'{
    "a": 2,
    "b": "hello"
}'}
```

When converting arrays, a delimiter argument is required:

```edgeql-repl
db> select to_str(['one', 'two', 'three'], ', ');
{'one, two, three'}
```

A bytes value can be converted to a str using UTF-8 encoding. Returns an InvalidValueError if input UTF-8 is invalid.

```edgeql-repl
db> select to_str(b'\xe3\x83\x86');
{'テ'}
db> select to_str(b'\xe3\x83');
gel error: InvalidValueError: invalid byte sequence for
encoding "UTF8": 0xe3 0x83
```

## Regular Expressions

Gel supports Regular expressions (REs), as defined in POSIX 1003.2. They come in two forms: BRE (basic RE) and ERE (extended RE). In addition, Gel supports certain common extensions to the POSIX standard commonly known as ARE (advanced RE). More details about BRE, ERE, and ARE support can be found in PostgreSQL documentation.

The table below outlines the different options accepted as the flags argument to various regular expression functions, or as embedded options in the pattern itself, e.g. '(?i)fooBAR':

## Formatting

Some of the type converter functions take an extra argument specifying formatting (either for converting to a str or parsing from one). The different formatting options are collected in this section.

