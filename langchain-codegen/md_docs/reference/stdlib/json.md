# JSON

| --- | --- |
| json | JSON scalar type |
| json[i] | Accesses the element of the JSON string or array at a given index. |
| json[from:to] | Produces a JSON value comprising a portion of the existing JSON value. |
| json ++ json | Concatenates two JSON arrays, objects, or strings into one. |
| json[name] | Accesses an element of a JSON object given its key. |
| = != ?= ?!= < > <= >= | Comparison operators |
| to_json() | Returns a JSON value parsed from the given string. |
| to_str() | Render JSON value to a string. |
| json_get() | Returns a value from a JSON object or array given its path. |
| json_set() | Returns an updated JSON target with a new value. |
| json_array_unpack() | Returns the elements of a JSON array as a set of json. |
| json_object_pack() | Returns the given set of key/value tuples as a JSON object. |
| json_object_unpack() | Returns the data in a JSON object as a set of key/value tuples. |
| json_typeof() | Returns the type of the outermost JSON value as a string. |

## Constructing JSON Values

JSON in Gel is a scalar type. This type doesn’t have its own literal, and instead can be obtained by either casting a value to the json type, or by using the to_json() function:

```edgeql-repl
db> select to_json('{"hello": "world"}');
{Json("{\"hello\": \"world\"}")}
db> select <json>'hello world';
{Json("\"hello world\"")}
```

Any value in Gel can be cast to a json type as well:

```edgeql-repl
db> select <json>2019;
{Json("2019")}
db> select <json>cal::to_local_date(datetime_current(), 'UTC');
{Json("\"2022-11-21\"")}
```

The json_object_pack() function provides one more way to construct JSON. It constructs a JSON object from an array of key/value tuples:

```edgeql-repl
db> select json_object_pack({("hello", <json>"world")});
{Json("{\"hello\": \"world\"}")}
```

Additionally, any Object in Gel can be cast as a json type. This produces the same JSON value as the JSON-serialized result of that said object. Furthermore, this result will be the same as the output of a select expression in JSON mode, including the shape of that type:

```edgeql-repl
db> select <json>(
...     select schema::Object {
...         name,
...         timestamp := cal::to_local_date(
...             datetime_current(), 'UTC')
...     }
...     filter .name = 'std::bool');
{Json("{\"name\": \"std::bool\", \"timestamp\": \"2022-11-21\"}")}
```

JSON values can also be cast back into scalars. Casting JSON is symmetrical meaning that, if a scalar value can be cast into JSON, a compatible JSON value can be cast into a scalar of that type. Some scalar types will have specific conditions for casting:

A named tuple is converted into a JSON object when cast as a json while a standard tuple is converted into a JSON array.

Type: type
Domain: eql
Summary: Arbitrary JSON data.
Signature: type json


Arbitrary JSON data.

Any other type can be cast to and from JSON:

```edgeql-repl
db> select <json>42;
{Json("42")}
db> select <bool>to_json('true');
{true}
```

A json value can also be cast as a str type, but only when recognized as a JSON string:

```edgeql-repl
db> select <str>to_json('"something"');
{'something'}
```

Casting a JSON array of strings (["a", "b", "c"]) to a str will result in an error:

```edgeql-repl
db> select <str>to_json('["a", "b", "c"]');
InvalidValueError: expected json string or null; got JSON array
```

Instead, use the to_str() function to dump a JSON value to a str value. Use the to_json() function to parse a JSON string to a json value:

```edgeql-repl
db> select to_json('[1, "a"]');
{Json("[1, \"a\"]")}
db> select to_str(<json>[1, 2]);
{'[1, 2]'}
```

Type: operator
Domain: eql
Summary: Accesses the element of the JSON string or array at a given index.
Signature: operator json [ int64 ] -> json


Accesses the element of the JSON string or array at a given index.

The contents of JSON arrays and strings can also be accessed via []:

```edgeql-repl
db> select <json>'hello'[1];
{Json("\"e\"")}
db> select <json>'hello'[-1];
{Json("\"o\"")}
db> select to_json('[1, "a", null]')[1];
{Json("\"a\"")}
db> select to_json('[1, "a", null]')[-1];
{Json("null")}
```

This will raise an exception if the specified index is not valid for the base JSON value. To access an index that is potentially out of bounds, use json_get().

Type: operator
Domain: eql
Summary: Produces a JSON value comprising a portion of the existing JSON value.
Signature: operator json [ int64 : int64 ] -> json


Produces a JSON value comprising a portion of the existing JSON value.

JSON arrays and strings can be sliced in the same way as regular arrays, producing a new JSON array or string:

```edgeql-repl
db> select <json>'hello'[0:2];
{Json("\"he\"")}
db> select <json>'hello'[2:];
{Json("\"llo\"")}
db> select to_json('[1, 2, 3]')[0:2];
{Json("[1, 2]")}
db> select to_json('[1, 2, 3]')[2:];
{Json("[3]")}
db> select to_json('[1, 2, 3]')[:1];
{Json("[1]")}
db> select to_json('[1, 2, 3]')[:-2];
{Json("[1]")}
```

Type: operator
Domain: eql
Summary: Concatenates two JSON arrays, objects, or strings into one.
Signature: operator json ++ json -> json


Concatenates two JSON arrays, objects, or strings into one.

JSON arrays, objects and strings can be concatenated with JSON values of the same type into a new JSON value.

If you concatenate two JSON objects, you get a new object whose keys will be a union of the keys of the input objects. If a key is present in both objects, the value from the second object is taken.

```edgeql-repl
db> select to_json('[1, 2]') ++ to_json('[3]');
{Json("[1, 2, 3]")}
db> select to_json('{"a": 1}') ++ to_json('{"b": 2}');
{Json("{\"a\": 1, \"b\": 2}")}
db> select to_json('{"a": 1, "b": 2}') ++ to_json('{"b": 3}');
{Json("{\"a\": 1, \"b\": 3}")}
db> select to_json('"123"') ++ to_json('"456"');
{Json("\"123456\"")}
```

Type: operator
Domain: eql
Summary: Accesses an element of a JSON object given its key.
Signature: operator json [ str ] -> json


Accesses an element of a JSON object given its key.

The fields of JSON objects can also be accessed via []:

```edgeql-repl
db> select to_json('{"a": 2, "b": 5}')['b'];
{Json("5")}
db> select j := <json>(schema::Type {
...     name,
...     timestamp := cal::to_local_date(datetime_current(), 'UTC')
... })
... filter j['name'] = <json>'std::bool';
{Json("{\"name\": \"std::bool\", \"timestamp\": \"2022-11-21\"}")}
```

This will raise an exception if the specified field does not exist for the base JSON value. To access an index that is potentially out of bounds, use json_get().

Type: function
Domain: eql
Summary: Returns a JSON value parsed from the given string.
Signature: function std::to_jsonjson


Returns a JSON value parsed from the given string.

```edgeql-repl
db> select to_json('[1, "hello", null]');
{Json("[1, \"hello\", null]")}
db> select to_json('{"hello": "world"}');
{Json("{\"hello\": \"world\"}")}
```

Type: function
Domain: eql
Summary: Returns the elements of a JSON array as a set of json.
Signature: function std::json_array_unpackset of json


Returns the elements of a JSON array as a set of json.

Calling this function on anything other than a JSON array will result in a runtime error.

This function should be used only if the ordering of elements is not important, or when the ordering of the set is preserved (such as an immediate input to an aggregate function).

```edgeql-repl
db> select json_array_unpack(to_json('[1, "a"]'));
{Json("1"), Json("\"a\"")}
```

Type: function
Domain: eql
Summary: Returns a value from a JSON object or array given its path.
Signature: function std::json_getoptional json


Returns a value from a JSON object or array given its path.

This function provides “safe” navigation of a JSON value. If the input path is a valid path for the input JSON object/array, the JSON value at the end of that path is returned:

```edgeql-repl
db> select json_get(to_json('{
...     "q": 1,
...     "w": [2, "foo"],
...     "e": true
... }'), 'w', '1');
{Json("\"foo\"")}
```

This is useful when certain structure of JSON data is assumed, but cannot be reliably guaranteed. If the path cannot be followed for any reason, the empty set is returned:

```edgeql-repl
db> select json_get(to_json('{
...     "q": 1,
...     "w": [2, "foo"],
...     "e": true
... }'), 'w', '2');
{}
```

If you want to supply your own default for the case where the path cannot be followed, you can do so using the coalesce operator:

```edgeql-repl
db> select json_get(to_json('{
...     "q": 1,
...     "w": [2, "foo"],
...     "e": true
... }'), 'w', '2') ?? <json>'mydefault';
{Json("\"mydefault\"")}
```

Type: function
Domain: eql
Summary: Returns an updated JSON target with a new value.
Signature: function std::json_setoptional json


Returns an updated JSON target with a new value.

```edgeql-repl
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'a',
...   value := <json>true,
... );
{Json("{\"a\": true, \"b\": 20}")}
db> select json_set(
...   to_json('{"a": {"b": {}}}'),
...   'a', 'b', 'c',
...   value := <json>42,
... );
{Json("{\"a\": {\"b\": {\"c\": 42}}}")}
```

If create_if_missing is set to false, a new path for the value won’t be created:

```edgeql-repl
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'с',
...   value := <json>42,
... );
{Json("{\"a\": 10, \"b\": 20, \"с\": 42}")}
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'с',
...   value := <json>42,
...   create_if_missing := false,
... );
{Json("{\"a\": 10, \"b\": 20}")}
```

The empty_treatment parameter defines the behavior of the function if an empty set is passed as new_value. This parameter can take these values:

```edgeql-repl
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'a',
...   value := <json>{}
... );
{}
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'a',
...   value := <json>{},
...   empty_treatment := JsonEmpty.ReturnTarget,
... );
{Json("{\"a\": 10, \"b\": 20}")}
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'a',
...   value := <json>{},
...   empty_treatment := JsonEmpty.Error,
... );
InvalidValueError: invalid empty JSON value
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'a',
...   value := <json>{},
...   empty_treatment := JsonEmpty.UseNull,
... );
{Json("{\"a\": null, \"b\": 20}")}
db> select json_set(
...   to_json('{"a": 10, "b": 20}'),
...   'a',
...   value := <json>{},
...   empty_treatment := JsonEmpty.DeleteKey,
... );
{Json("{\"b\": 20}")}
```

Type: function
Domain: eql
Summary: Returns the given set of key/value tuples as a JSON object.
Signature: function std::json_object_packjson


Returns the given set of key/value tuples as a JSON object.

```edgeql-repl
db> select json_object_pack({
...     ("foo", to_json("1")),
...     ("bar", to_json("null")),
...     ("baz", to_json("[]"))
... });
{Json("{\"bar\": null, \"baz\": [], \"foo\": 1}")}
```

If the key/value tuples being packed have common keys, the last value for each key will make the final object.

```edgeql-repl
db> select json_object_pack({
...     ("hello", <json>"world"),
...     ("hello", <json>true)
... });
{Json("{\"hello\": true}")}
```

Type: function
Domain: eql
Summary: Returns the data in a JSON object as a set of key/value tuples.
Signature: function std::json_object_unpackset of tuple<str, json>


Returns the data in a JSON object as a set of key/value tuples.

Calling this function on anything other than a JSON object will result in a runtime error.

```edgeql-repl
db> select json_object_unpack(to_json('{
...     "q": 1,
...     "w": [2, "foo"],
...     "e": true
... }'));
{('e', Json("true")), ('q', Json("1")), ('w', Json("[2, \"foo\"]"))}
```

Type: function
Domain: eql
Summary: Returns the type of the outermost JSON value as a string.
Signature: function std::json_typeofstr


Returns the type of the outermost JSON value as a string.

Possible return values are: 'object', 'array', 'string', 'number', 'boolean', or 'null':

```edgeql-repl
db> select json_typeof(<json>2);
{'number'}
db> select json_typeof(to_json('null'));
{'null'}
db> select json_typeof(to_json('{"a": 2}'));
{'object'}
```

