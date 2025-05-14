# Data types

gel-python automatically converts Gel types to the corresponding Python types and vice versa.

The table below shows the correspondence between Gel and Python types.

| Gel Type | Python Type |
| --- | --- |
| Set | gel.Set |
| array<anytype> | gel.Array |
| anytuple | gel.Tuple or gel.NamedTuple |
| anyenum | gel.EnumValue |
| Object | gel.Object |
| bool | bool |
| bytes | bytes |
| str | str |
| cal::local_date | datetime.date |
| cal::local_time | offset-naive datetime.time |
| cal::local_datetime | offset-naive datetime.datetime |
| cal::relative_duration | gel.RelativeDuration |
| cal::date_duration | gel.DateDuration |
| datetime | offset-aware datetime.datetime |
| duration | datetime.timedelta |
| float32, float64 | float |
| int16, int32, int64, bigint | int |
| decimal | Decimal |
| json | str |
| uuid | uuid.UUID |

Inexact single-precision float values may have a different representation when decoded into a Python float.  This is inherent to the implementation of limited-precision floating point types.  If you need the decimal representation to match, cast the expression to float64 or decimal in your query.

## Sets

Type: class
Domain: py
Summary: 
Signature: class gel.Set


This is list since version 1.0.

## Objects

Type: class
Domain: py
Summary: 
Signature: class gel.Object


An immutable representation of an object instance returned from a query.

The value of an object property or a link can be accessed through a corresponding attribute:

```pycon
>>> import gel
>>> client = gel.create_client()
>>> r = client.query_single('''
...     SELECT schema::ObjectType {name}
...     FILTER .name = 'std::Object'
...     LIMIT 1''')
>>> r
Object{name := 'std::Object'}
>>> r.name
'std::Object'
```

## Links

Type: class
Domain: py
Summary: 
Signature: class gel.Link


An immutable representation of an object link.

Links are created when gel.Object is accessed via a [] operator.  Using Link objects explicitly is useful for accessing link properties.

Type: class
Domain: py
Summary: 
Signature: class gel.LinkSet


An immutable representation of a set of Links.

LinkSets are created when a multi link on gel.Object is accessed via a [] operator.

## Tuples

Type: class
Domain: py
Summary: 
Signature: class gel.Tuple


This is tuple since version 1.0.

## Named Tuples

Type: class
Domain: py
Summary: 
Signature: class gel.NamedTuple


An immutable value representing a Gel named tuple value.

Instances of gel.NamedTuple generally behave similarly to namedtuple:

```pycon
>>> import gel
>>> client = gel.create_client()
>>> r = client.query_single('''SELECT (a := 1, b := 'a', c := [3])''')
>>> r
(a := 1, b := 'a', c := [3])
>>> r.b
'a'
>>> r[0]
1
>>> r == (1, 'a', [3])
True
>>> r._fields
('a', 'b', 'c')
```

## Arrays

Type: class
Domain: py
Summary: 
Signature: class gel.Array


This is list since version 1.0.

## RelativeDuration

Type: class
Domain: py
Summary: 
Signature: class gel.RelativeDuration


An immutable value representing a Gel cal::relative_duration value.

```pycon
>>> import gel
>>> client = gel.create_client()
>>> r = client.query_single('''SELECT <cal::relative_duration>"1 year 2 days 3 seconds"''')
>>> r
<gel.RelativeDuration "P1Y2DT3S">
>>> r.months
12
>>> r.days
2
>>> r.microseconds
3000000
```

## DateDuration

Type: class
Domain: py
Summary: 
Signature: class gel.DateDuration


An immutable value representing a Gel cal::date_duration value.

```pycon
>>> import gel
>>> client = gel.create_client()
>>> r = client.query_single('''SELECT <cal::date_duration>"1 year 2 days"''')
>>> r
<gel.DateDuration "P1Y2D">
>>> r.months
12
>>> r.days
2
```

## EnumValue

Type: class
Domain: py
Summary: 
Signature: class gel.EnumValue


An immutable value representing a Gel enum value.

```pycon
>>> import gel
>>> client = gel.create_client()
>>> r = client.query_single("""SELECT <Color>'red'""")
>>> r
<gel.EnumValue 'red'>
>>> str(r)
'red'
>>> r.value  # added in 1.0
'red'
>>> r.name  # added in 1.0, simply str.upper() of r.value
'RED'
```

