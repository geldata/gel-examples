# Deprecated

| --- | --- |
| str_lpad() | Return the input string left-padded to the length n. |
| str_rpad() | Return the input string right-padded to the length n. |
| str_ltrim() | Return the input string with all leftmost trim characters removed. |
| str_rtrim() | Return the input string with all rightmost trim characters removed. |

Type: function
Domain: eql
Summary: Return the input string left-padded to the length n.
Signature: function std::str_lpadstr


Return the input string left-padded to the length n.

If the string is longer than n, then it is truncated to the first n characters. Otherwise, the string is padded on the left up to the total length n using fill characters (space by default).

```edgeql-repl
db> select str_lpad('short', 10);
{'     short'}
db> select str_lpad('much too long', 10);
{'much too l'}
db> select str_lpad('short', 10, '.:');
{'.:.:.short'}
```

Type: function
Domain: eql
Summary: Return the input string right-padded to the length n.
Signature: function std::str_rpadstr


Return the input string right-padded to the length n.

If the string is longer than n, then it is truncated to the first n characters. Otherwise, the string is padded on the right up to the total length n using fill characters (space by default).

```edgeql-repl
db> select str_rpad('short', 10);
{'short     '}
db> select str_rpad('much too long', 10);
{'much too l'}
db> select str_rpad('short', 10, '.:');
{'short.:.:.'}
```

Type: function
Domain: eql
Summary: Return the input string with all leftmost trim characters removed.
Signature: function std::str_ltrimstr


Return the input string with all leftmost trim characters removed.

If the trim specifies more than one character they will be removed from the beginning of the string regardless of the order in which they appear.

```edgeql-repl
db> select str_ltrim('     data');
{'data'}
db> select str_ltrim('.....data', '.:');
{'data'}
db> select str_ltrim(':::::data', '.:');
{'data'}
db> select str_ltrim(':...:data', '.:');
{'data'}
db> select str_ltrim('.:.:.data', '.:');
{'data'}
```

Type: function
Domain: eql
Summary: Return the input string with all rightmost trim characters removed.
Signature: function std::str_rtrimstr


Return the input string with all rightmost trim characters removed.

If the trim specifies more than one character they will be removed from the end of the string regardless of the order in which they appear.

```edgeql-repl
db> select str_rtrim('data     ');
{'data'}
db> select str_rtrim('data.....', '.:');
{'data'}
db> select str_rtrim('data:::::', '.:');
{'data'}
db> select str_rtrim('data:...:', '.:');
{'data'}
db> select str_rtrim('data.:.:.', '.:');
{'data'}
```

Type: type
Domain: eql
Summary: The branch-level configuration object type.
Signature: type cfg::DatabaseConfig


The branch-level configuration object type.

As of EdgeDB 5.0, this config object represents database branch and instance-level configuration.

Use the identical cfg::BranchConfig instead.

