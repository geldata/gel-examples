# Data types

When producing results, the client automatically decodes Gel types to the corresponding JavaScript types. When you pass scalar values to the client as arguments, the client automatically encodes them to the corresponding Gel types.

The table below shows the correspondence between Gel and JavaScript data types.

| --- | --- |
| Gel Type | JavaScript Type |
| multi set | Array |
| array<anytype> | Array |
| anytuple | Array |
| anyenum | string |
| Object | object |
| bool | boolean |
| bytes | Uint8Array |
| str | string |
| float32,  float64, int16, int32, int64 | number |
| bigint | BigInt |
| decimal | n/a |
| json | unknown |
| uuid | string |
| datetime | Date |
| cal::local_date | LocalDate() |
| cal::local_time | LocalTime() |
| cal::local_datetime | LocalDateTime() |
| duration | Duration() |
| cal::relative_duration | RelativeDuration() |
| cal::date_duration | DateDuration() |
| range<anytype> | Range() |
| cfg::memory | ConfigMemory() |

Inexact single-precision float values may have a different representation when decoded into a JavaScript number.  This is inherent to the implementation of limited-precision floating point types.  If you need the decimal representation to match, cast the expression to float64 in your query.

Due to precision limitations the decimal type cannot be decoded to a JavaScript number. Use an explicit cast to float64 if the precision degradation is acceptable or a cast to str for an exact decimal representation.

## Arrays

Gel array  maps onto the JavaScript Array.

```javascript
await client.querySingle<number[]>("select [1, 2, 3];");
// number[]: [1, 2, 3]
```

## Objects

Object represents an object instance returned from a query. The value of an object property or a link can be accessed through a corresponding object key:

```typescript
await client.query<{
  title: string;
  characters: {
    name: string;
    "@character_name": string;
  }[];
}>(`
  select Movie {
    title,
    characters: {
      name,
      @character_name
    }
  };
`);
```

## Tuples

A regular Gel tuple becomes an Array in JavaScript. A Gel namedtuple becomes an object with properties corresponding to the tuple elements.

```typescript
await client.queryRequiredSingle<[number, string]>(`select (1, "hello");`);
// [number, string]: [1, 'hello']

await client.queryRequiredSingle<{
  foo: number;
  bar: string;
}>(`select (foo := 1, bar := "hello");`);
// { foo: number; bar: string }: { foo: 1; bar: 'hello' }
```

## Local Date

Type: class
Domain: js
Summary: 
Signature: class LocalDateyear: numbermonth: numberday: number


A JavaScript representation of a Gel local_date value. Implements a subset of the TC39 Temporal Proposal PlainDate type.

Assumes the calendar is always ISO 8601.

## Local Time

Type: class
Domain: js
Summary: 
Signature: class LocalTimehour: number = 0minute: number = 0second: number = 0millisecond: number = 0microsecond: number = 0nanosecond: number = 0


A JavaScript representation of a Gel local_time value. Implements a subset of the TC39 Temporal Proposal PlainTime type.

## Local Date and Time

Type: class
Domain: js
Summary: 
Signature: class LocalDateTimeyear: numbermonth: numberday: numberhour: number = 0minute: number = 0second: number = 0millisecond: number = 0microsecond: number = 0nanosecond: number = 0LocalDateLocalTime


A JavaScript representation of a Gel local_datetime value.  Implements a subset of the TC39 Temporal Proposal PlainDateTime type.

Inherits all properties from the LocalDate() and LocalTime() types.

## Duration

Type: class
Domain: js
Summary: 
Signature: class Durationyears: number = 0months: number = 0weeks: number = 0days: number = 0hours: number = 0minutes: number = 0seconds: number = 0milliseconds: number = 0microseconds: number = 0nanoseconds: number = 0


A JavaScript representation of a Gel duration value. This class attempts to conform to the TC39 Temporal Proposal Duration type as closely as possible.

No arguments may be infinite and all must have the same sign. Any non-integer arguments will be rounded towards zero.

## Relative Duration

Type: class
Domain: js
Summary: 
Signature: class RelativeDurationyears: number = 0months: number = 0weeks: number = 0days: number = 0hours: number = 0minutes: number = 0seconds: number = 0milliseconds: number = 0microseconds: number = 0


A JavaScript representation of a Gel cal::relative_duration value. This type represents a non-definite span of time such as “2 years 3 days”. This cannot be represented as a duration because a year has no absolute duration; for instance, leap years are longer than non-leap years.

This class attempts to conform to the TC39 Temporal Proposal Duration type as closely as possible.

Internally, a cal::relative_duration value is represented as an integer number of months, days, and seconds. During encoding, other units will be normalized to these three. Sub-second units like microseconds will be ignored.

## Date Duration

Type: class
Domain: js
Summary: 
Signature: class DateDurationyears: number = 0months: number = 0weeks: number = 0days: number = 0


A JavaScript representation of a Gel cal::date_duration value. This type represents a non-definite span of time consisting of an integer number of months and days.

This type is primarily intended to simplify logic involving cal::local_date values.

```edgeql-repl
db> select <cal::date_duration>'5 days';
{<cal::date_duration>'P5D'}
db> select <cal::local_date>'2022-06-25' + <cal::date_duration>'5 days';
{<cal::local_date>'2022-06-30'}
db> select <cal::local_date>'2022-06-30' - <cal::local_date>'2022-06-25';
{<cal::date_duration>'P5D'}
```

Internally, a cal::relative_duration value is represented as an integer number of months and days. During encoding, other units will be normalized to these two.

## Memory

Type: class
Domain: js
Summary: 
Signature: class ConfigMemorybytes: BigInt


A JavaScript representation of a Gel cfg::memory value.

## Range

Type: class
Domain: js
Summary: 
Signature: class Rangelower: T | nullupper: T | nullincLower: boolean = trueincUpper: boolean = false


A JavaScript representation of a Gel std::range value. This is a generic TypeScript class with the following type signature.

```typescript
class Range<
    T extends number | Date | LocalDate | LocalDateTime | Duration
>{
    // ...
}
```

