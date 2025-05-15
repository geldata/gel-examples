# Dates and Times

| --- | --- |
| datetime | Timezone-aware point in time |
| duration | Absolute time span |
| cal::local_datetime | Date and time w/o timezone |
| cal::local_date | Date type |
| cal::local_time | Time type |
| cal::relative_duration | Relative time span |
| cal::date_duration | Relative time span in days |
| dt + dt | Adds a duration and any other datetime value. |
| dt - dt | Subtracts two compatible datetime or duration values. |
| = != ?= ?!= < > <= >= | Comparison operators |
| to_str() | Render a date/time value to a string. |
| to_datetime() | Create a datetime value. |
| cal::to_local_datetime() | Create a cal::local_datetime value. |
| cal::to_local_date() | Create a cal::local_date value. |
| cal::to_local_time() | Create a cal::local_time value. |
| to_duration() | Create a duration value. |
| cal::to_relative_duration() | Create a cal::relative_duration value. |
| cal::to_date_duration() | Create a cal::date_duration value. |
| datetime_get() | Returns the element of a date/time given a unit name. |
| cal::time_get() | Returns the element of a time value given a unit name. |
| cal::date_get() | Returns the element of a date given a unit name. |
| duration_get() | Returns the element of a duration given a unit name. |
| datetime_truncate() | Truncates the input datetime to a particular precision. |
| duration_truncate() | Truncates the input duration to a particular precision. |
| datetime_current() | Returns the server's current date and time. |
| datetime_of_transaction() | Returns the date and time of the start of the current transaction. |
| datetime_of_statement() | Returns the date and time of the start of the current statement. |
| cal::duration_normalize_hours() | Convert 24-hour chunks into days. |
| cal::duration_normalize_days() | Convert 30-day chunks into months. |

Gel offers two ways of representing date/time values:

There are also two different ways of measuring duration:

All related operators, functions, and type casts are designed to maintain a strict separation between timezone-aware and “local” date/time values.

Gel stores and outputs timezone-aware values in UTC format.

All date/time types are restricted to years between 1 and 9999, including the years 1 and 9999. Although many systems support ISO 8601 date/time formatting in theory, in practice the formatting before year 1 and after 9999 tends to be inconsistent. As such, dates outside this range are not reliably portable.

## Timezones

For timezone string literals, you may specify timezones in one of two ways:

See the relevant section from the PostgreSQL documentation for more detail about how time zones affect the behavior of date/time functionality.

The IANA timezone database is maintained by Paul Eggert for the IANA. You can find a GitHub repository with the latest timezone data here, and the list of timezone names here.

Type: type
Domain: eql
Summary: Represents a timezone-aware moment in time.
Signature: type datetime


Represents a timezone-aware moment in time.

All dates must correspond to dates that exist in the proleptic Gregorian calendar.

Casting is a simple way to obtain a datetime value in an expression:

```edgeql
select <datetime>'2018-05-07T15:01:22.306916+00';
select <datetime>'2018-05-07T15:01:22+00';
```

When casting datetime from strings, the string must follow the ISO 8601 format with a timezone included.

```edgeql-repl
db> select <datetime>'January 01 2019 UTC';
InvalidValueError: invalid input syntax for type
std::datetime: 'January 01 2019 UTC'
Hint: Please use ISO8601 format. Alternatively "to_datetime"
function provides custom formatting options.

db> select <datetime>'2019-01-01T15:01:22';
InvalidValueError: invalid input syntax for type
std::datetime: '2019-01-01T15:01:22'
Hint: Please use ISO8601 format. Alternatively "to_datetime"
function provides custom formatting options.
```

All datetime values are restricted to the range from year 1 to 9999.

For more information regarding interacting with this type, see datetime_get(), to_datetime(), and to_str().

Type: type
Domain: eql
Summary: A type for representing a date and time without a timezone.
Signature: type cal::local_datetime


A type for representing a date and time without a timezone.

Casting is a simple way to obtain a cal::local_datetime value in an expression:

```edgeql
select <cal::local_datetime>'2018-05-07T15:01:22.306916';
select <cal::local_datetime>'2018-05-07T15:01:22';
```

When casting cal::local_datetime from strings, the string must follow the ISO 8601 format without timezone:

```edgeql-repl
db> select <cal::local_datetime>'2019-01-01T15:01:22+00';
InvalidValueError: invalid input syntax for type
cal::local_datetime: '2019-01-01T15:01:22+00'
Hint: Please use ISO8601 format. Alternatively
"cal::to_local_datetime" function provides custom formatting
options.

db> select <cal::local_datetime>'January 01 2019';
InvalidValueError: invalid input syntax for type
cal::local_datetime: 'January 01 2019'
Hint: Please use ISO8601 format. Alternatively
"cal::to_local_datetime" function provides custom formatting
options.
```

All datetime values are restricted to the range from year 1 to 9999.

For more information regarding interacting with this type, see datetime_get(), cal::to_local_datetime(), and to_str().

Type: type
Domain: eql
Summary: A type for representing a date without a timezone.
Signature: type cal::local_date


A type for representing a date without a timezone.

Casting is a simple way to obtain a cal::local_date value in an expression:

```edgeql
select <cal::local_date>'2018-05-07';
```

When casting cal::local_date from strings, the string must follow the ISO 8601 date format.

For more information regarding interacting with this type, see cal::date_get(), cal::to_local_date(), and to_str().

Type: type
Domain: eql
Summary: A type for representing a time without a timezone.
Signature: type cal::local_time


A type for representing a time without a timezone.

Casting is a simple way to obtain a cal::local_time value in an expression:

```edgeql
select <cal::local_time>'15:01:22.306916';
select <cal::local_time>'15:01:22';
```

When casting cal::local_time from strings, the string must follow the ISO 8601 time format.

For more information regarding interacting with this type, see cal::time_get(), cal::to_local_time(), and to_str().

Type: type
Domain: eql
Summary: A type for representing a span of time.
Signature: type duration


A type for representing a span of time.

A duration is a fixed number of seconds and microseconds and isn’t adjusted by timezone, length of month, or anything else in datetime calculations.

When converting from a string, only units of 'microseconds', 'milliseconds', 'seconds', 'minutes', and 'hours' are valid:

```edgeql-repl
db> select <duration>'45.6 seconds';
{<duration>'0:00:45.6'}
db> select <duration>'15 milliseconds';
{<duration>'0:00:00.015'}
db> select <duration>'48 hours 45 minutes';
{<duration>'48:45:00'}
db> select <duration>'11 months';
gel error: InvalidValueError: invalid input syntax for type
std::duration: '11 months'
  Hint: Units bigger than hours cannot be used for std::duration.
```

All date/time types support the + and - arithmetic operations with durations:

```edgeql-repl
db> select <datetime>'2019-01-01T00:00:00Z' - <duration>'24 hours';
{<datetime>'2018-12-31T00:00:00+00:00'}
db> select <cal::local_time>'22:00' + <duration>'1 hour';
{<cal::local_time>'23:00:00'}
```

For more information regarding interacting with this type, see to_duration(), and to_str() and date/time operators.

Type: type
Domain: eql
Summary: A type for representing a relative span of time.
Signature: type cal::relative_duration


A type for representing a relative span of time.

Unlike std::duration, cal::relative_duration is an imprecise form of measurement. When months and days are used, the same relative duration could have a different absolute duration depending on the date you’re measuring from.

For example 2020 was a leap year and had 366 days. Notice how the number of hours in each year below is different:

```edgeql-repl
db> with
...     first_day_of_2020 := <datetime>'2020-01-01T00:00:00Z',
...     one_year := <cal::relative_duration>'1 year',
...     first_day_of_next_year := first_day_of_2020 + one_year
... select first_day_of_next_year - first_day_of_2020;
{<duration>'8784:00:00'}
db> with
...     first_day_of_2019 := <datetime>'2019-01-01T00:00:00Z',
...     one_year := <cal::relative_duration>'1 year',
...     first_day_of_next_year := first_day_of_2019 + one_year
... select first_day_of_next_year - first_day_of_2019;
{<duration>'8760:00:00'}
```

When converting from a string, only the following units are valid:

Examples of units usage:

```edgeql
select <cal::relative_duration>'45.6 seconds';
select <cal::relative_duration>'15 milliseconds';
select <cal::relative_duration>'3 weeks 45 minutes';
select <cal::relative_duration>'-7 millennia';
```

All date/time types support the + and - arithmetic operations with relative_duration:

```edgeql-repl
db> select <datetime>'2019-01-01T00:00:00Z' -
...        <cal::relative_duration>'3 years';
{<datetime>'2016-01-01T00:00:00+00:00'}
db> select <cal::local_time>'22:00' +
...        <cal::relative_duration>'1 hour';
{<cal::local_time>'23:00:00'}
```

If an arithmetic operation results in a day that doesn’t exist in the given month, the last day of the month will be used instead:

```edgeql-repl
db> select <cal::local_datetime>"2021-01-31T15:00:00" +
...        <cal::relative_duration>"1 month";
{<cal::local_datetime>'2021-02-28T15:00:00'}
```

For arithmetic operations involving a cal::relative_duration consisting of multiple components (units), higher-order components are applied first followed by lower-order components.

```edgeql-repl
db> select <cal::local_datetime>"2021-04-30T15:00:00" +
...        <cal::relative_duration>"1 month 1 day";
{<cal::local_datetime>'2021-05-31T15:00:00'}
```

If you add the same components split into separate durations, adding the higher-order units first followed by the lower-order units, the calculation produces the same result as in the previous example:

```edgeql-repl
db> select <cal::local_datetime>"2021-04-30T15:00:00" +
...        <cal::relative_duration>"1 month" +
...        <cal::relative_duration>"1 day";
{<cal::local_datetime>'2021-05-31T15:00:00'}
```

When the order of operations is reversed, the result may be different for some corner cases:

```edgeql-repl
db> select <cal::local_datetime>"2021-04-30T15:00:00" +
...        <cal::relative_duration>"1 day" +
...        <cal::relative_duration>"1 month";
{<cal::local_datetime>'2021-06-01T15:00:00'}
```

Due to the implementation of relative_duration logic, arithmetic operations may behave counterintuitively.

Non-associative

```edgeql-repl
db> select <cal::local_datetime>'2021-01-31T00:00:00' +
...        <cal::relative_duration>'1 month' +
...        <cal::relative_duration>'1 month';
{<cal::local_datetime>'2021-03-28T00:00:00'}
db> select <cal::local_datetime>'2021-01-31T00:00:00' +
...       (<cal::relative_duration>'1 month' +
...        <cal::relative_duration>'1 month');
{<cal::local_datetime>'2021-03-31T00:00:00'}
```

Lossy

```edgeql-repl
db> with m := <cal::relative_duration>'1 month'
... select <cal::local_date>'2021-01-31' + m
...        =
...        <cal::local_date>'2021-01-30' + m;
{true}
```

Asymmetric

```edgeql-repl
db> with m := <cal::relative_duration>'1 month'
... select <cal::local_date>'2021-01-31' + m - m;
{<cal::local_date>'2021-01-28'}
```

Non-monotonic

```edgeql-repl
db> with m := <cal::relative_duration>'1 month'
... select <cal::local_datetime>'2021-01-31T01:00:00' + m
...        <
...        <cal::local_datetime>'2021-01-30T23:00:00' + m;
{true}
db> with m := <cal::relative_duration>'2 month'
... select <cal::local_datetime>'2021-01-31T01:00:00' + m
...        <
...        <cal::local_datetime>'2021-01-30T23:00:00' + m;
{false}
```

For more information regarding interacting with this type, see cal::to_relative_duration(), and to_str() and date/time operators.

Type: type
Domain: eql
Summary: A type for representing a span of time in days.
Signature: type cal::date_duration


A type for representing a span of time in days.

This type is similar to cal::relative_duration, except it only uses 2 units: months and days. It is the result of subtracting one cal::local_date from another. The purpose of this type is to allow performing + and - operations on a cal::local_date and to produce a cal::local_date as the result:

```edgeql-repl
db> select <cal::local_date>'2022-06-30' -
...   <cal::local_date>'2022-06-25';
{<cal::date_duration>'P5D'}
db> select <cal::local_date>'2022-06-25' +
...   <cal::date_duration>'5 days';
{<cal::local_date>'2022-06-30'}
db> select <cal::local_date>'2022-06-25' -
...   <cal::date_duration>'5 days';
{<cal::local_date>'2022-06-20'}
```

When converting from a string, only the following units are valid:

```edgeql
select <cal::date_duration>'45 days';
select <cal::date_duration>'3 weeks 5 days';
select <cal::date_duration>'-7 millennia';
```

In most cases, date_duration is fully compatible with cal::relative_duration and shares the same general behavior and caveats. Gel will apply type coercion in the event it expects a cal::relative_duration and finds a cal::date_duration instead.

For more information regarding interacting with this type, see cal::to_date_duration() and date/time operators.

Type: operator
Domain: eql
Summary: Adds a duration and any other datetime value.
Signature: operator datetime + duration -> datetime
Signature: operator datetime + cal::relative_duration                           -> cal::relative_duration
Signature: operator duration + duration -> duration
Signature: operator duration + cal::relative_duration                           -> cal::relative_duration
Signature: operator cal::relative_duration + cal::relative_duration                           -> cal::relative_duration
Signature: operator cal::local_datetime + cal::relative_duration                           -> cal::relative_duration
Signature: operator cal::local_datetime + duration                           -> cal::local_datetime
Signature: operator cal::local_time + cal::relative_duration                           -> cal::relative_duration
Signature: operator cal::local_time + duration -> cal::local_time
Signature: operator cal::local_date + cal::date_duration                           -> cal::local_date
Signature: operator cal::date_duration + cal::date_duration                           -> cal::date_duration
Signature: operator cal::local_date + cal::relative_duration                           -> cal::local_datetime
Signature: operator cal::local_date + duration -> cal::local_datetime


Adds a duration and any other datetime value.

This operator is commutative.

```edgeql-repl
db> select <cal::local_time>'22:00' + <duration>'1 hour';
{<cal::local_time>'23:00:00'}
db> select <duration>'1 hour' + <cal::local_time>'22:00';
{<cal::local_time>'23:00:00'}
db> select <duration>'1 hour' + <duration>'2 hours';
{10800s}
```

Type: operator
Domain: eql
Summary: Subtracts two compatible datetime or duration values.
Signature: operator duration - duration -> duration
Signature: operator datetime - datetime -> duration
Signature: operator datetime - duration -> datetime
Signature: operator datetime - cal::relative_duration -> datetime
Signature: operator cal::relative_duration - cal::relative_duration                             -> cal::relative_duration
Signature: operator cal::local_datetime - cal::local_datetime                             -> cal::relative_duration
Signature: operator cal::local_datetime - cal::relative_duration                             -> cal::local_datetime
Signature: operator cal::local_datetime - duration                             -> cal::local_datetime
Signature: operator cal::local_time - cal::local_time                             -> cal::relative_duration
Signature: operator cal::local_time - cal::relative_duration                             -> cal::local_time
Signature: operator cal::local_time - duration -> cal::local_time
Signature: operator cal::date_duration - cal::date_duration                             -> cal::date_duration
Signature: operator cal::local_date - cal::local_date                             -> cal::date_duration
Signature: operator cal::local_date - cal::date_duration                             -> cal::local_date
Signature: operator cal::local_date - cal::relative_duration                             -> cal::local_datetime
Signature: operator cal::local_date - duration -> cal::local_datetime
Signature: operator duration - cal::relative_duration                             -> cal::relative_duration
Signature: operator cal::relative_duration - duration                            -> cal::relative_duration


Subtracts two compatible datetime or duration values.

```edgeql-repl
db> select <datetime>'2019-01-01T01:02:03+00' -
...   <duration>'24 hours';
{<datetime>'2018-12-31T01:02:03Z'}
db> select <datetime>'2019-01-01T01:02:03+00' -
...   <datetime>'2019-02-01T01:02:03+00';
{-2678400s}
db> select <duration>'1 hour' -
...   <duration>'2 hours';
{-3600s}
```

When subtracting a cal::local_date type from another, the result is given as a whole number of days using the cal::date_duration type:

```edgeql-repl
db> select <cal::local_date>'2022-06-25' -
...   <cal::local_date>'2019-02-01';
{<cal::date_duration>'P1240D'}
```

When subtracting a date/time object from a time interval, an exception will be raised:

```edgeql-repl
db> select <duration>'1 day' -
...   <datetime>'2019-01-01T01:02:03+00';
QueryError: operator '-' cannot be applied to operands ...
```

An exception will also be raised when trying to subtract a timezone-aware std::datetime type from cal::local_datetime or vice versa:

```edgeql-repl
db> select <datetime>'2019-01-01T01:02:03+00' -
...   <cal::local_datetime>'2019-02-01T01:02:03';
QueryError: operator '-' cannot be applied to operands...
db> select <cal::local_datetime>'2019-02-01T01:02:03' -
...   <datetime>'2019-01-01T01:02:03+00';
QueryError: operator '-' cannot be applied to operands...
```

Type: function
Domain: eql
Summary: Returns the server's current date and time.
Signature: function std::datetime_currentdatetime


Returns the server’s current date and time.

```edgeql-repl
db> select datetime_current();
{<datetime>'2018-05-14T20:07:11.755827Z'}
```

This function is volatile since it always returns the current time when it is called. As a result, it cannot be used in computed properties defined in schema. This does not apply to computed properties outside of schema.

Type: function
Domain: eql
Summary: Returns the date and time of the start of the current transaction.
Signature: function std::datetime_of_transactiondatetime


Returns the date and time of the start of the current transaction.

This function is non-volatile since it returns the current time when the transaction is started, not when the function is called. As a result, it can be used in computed properties defined in schema.

Type: function
Domain: eql
Summary: Returns the date and time of the start of the current statement.
Signature: function std::datetime_of_statementdatetime


Returns the date and time of the start of the current statement.

This function is non-volatile since it returns the current time when the statement is started, not when the function is called. As a result, it can be used in computed properties defined in schema.

Type: function
Domain: eql
Summary: Returns the element of a date/time given a unit name.
Signature: function std::datetime_getfloat64
Signature: function std::datetime_getfloat64


Returns the element of a date/time given a unit name.

You may pass any of these unit names for el:

```edgeql-repl
db> select datetime_get(
...     <datetime>'2018-05-07T15:01:22.306916+00',
...     'epochseconds');
{1525705282.306916}

db> select datetime_get(
...     <datetime>'2018-05-07T15:01:22.306916+00',
...     'year');
{2018}

db> select datetime_get(
...     <datetime>'2018-05-07T15:01:22.306916+00',
...     'quarter');
{2}

db> select datetime_get(
...     <datetime>'2018-05-07T15:01:22.306916+00',
...     'doy');
{127}

db> select datetime_get(
...     <datetime>'2018-05-07T15:01:22.306916+00',
...     'hour');
{15}
```

Type: function
Domain: eql
Summary: Returns the element of a time value given a unit name.
Signature: function cal::time_getfloat64


Returns the element of a time value given a unit name.

You may pass any of these unit names for el:

For full description of what these elements extract see datetime_get().

```edgeql-repl
db> select cal::time_get(
...     <cal::local_time>'15:01:22.306916', 'minutes');
{1}

db> select cal::time_get(
...     <cal::local_time>'15:01:22.306916', 'milliseconds');
{22306.916}
```

Type: function
Domain: eql
Summary: Returns the element of a date given a unit name.
Signature: function cal::date_getfloat64


Returns the element of a date given a unit name.

The cal::local_date scalar has the following elements available for extraction:

```edgeql-repl
db> select cal::date_get(
...     <cal::local_date>'2018-05-07', 'century');
{21}

db> select cal::date_get(
...     <cal::local_date>'2018-05-07', 'year');
{2018}

db> select cal::date_get(
...     <cal::local_date>'2018-05-07', 'month');
{5}

db> select cal::date_get(
...     <cal::local_date>'2018-05-07', 'doy');
{127}
```

Type: function
Domain: eql
Summary: Returns the element of a duration given a unit name.
Signature: function std::duration_getfloat64
Signature: function std::duration_getfloat64
Signature: function std::duration_getfloat64


Returns the element of a duration given a unit name.

You may pass any of these unit names as el:

Additionally, it’s possible to convert a given duration into seconds:

The duration scalar has only 'hour' and smaller units available for extraction.

The cal::relative_duration scalar has all of the units available for extraction.

The cal::date_duration scalar only has 'date' and larger units available for extraction.

```edgeql-repl
db> select duration_get(
...   <cal::relative_duration>'400 months', 'year');
{33}
db> select duration_get(
...   <cal::date_duration>'400 months', 'month');
{4}
db> select duration_get(
...   <cal::relative_duration>'1 month 20 days 30 hours',
...   'day');
{20}
db> select duration_get(
...   <cal::relative_duration>'30 hours', 'hour');
{30}
db> select duration_get(
...   <cal::relative_duration>'1 month 20 days 30 hours',
...   'hour');
{30}
db> select duration_get(<duration>'30 hours', 'hour');
{30}
db> select duration_get(
...   <cal::relative_duration>'1 month 20 days 30 hours',
...   'totalseconds');
{4428000}
db> select duration_get(
...   <duration>'30 hours', 'totalseconds');
{108000}
```

This function will provide you with a calculated total for the unit passed as el, but only within the given “size class” of the unit. These size classes exist because they are logical breakpoints that we can’t reliably convert values across. A month might be 30 days long, or it might be 28 or 29 or 31. A day is generally 24 hours, but with daylight savings, it might be longer or shorter.

As a result, it’s impossible to convert across these lines in a way that works in every situation. For some use cases, assuming a 30 day month works fine. For others, it might not. The size classes are as follows:

For example, if you specify 'day' as your el argument, the function will return only the number of days expressed as N days in your duration. It will not add another day to the returned count for every 24 hours (defined as 24 hours) in the duration, nor will it consider the months’ constituent day counts in the returned value. Specifying 'decade' for el will total up all decades represented in units 'month' and larger, but it will not add a decade’s worth of days to the returned value as an additional decade.

In this example, the duration represents more than a day’s time, but since 'day' and 'hour' are in different size classes, the extra day stemming from the duration’s hours is not added.

```edgeql-repl
db> select duration_get(
...   <cal::relative_duration>'1 day 36 hours', 'day');
{1}
```

In this counter example, both the decades and months are pooled together since they are in the same size class. The return value is 5: the 2 'decades' and the 3 decades in '400 months'.

```edgeql-repl
db> select duration_get(
...   <cal::relative_duration>'2 decades 400 months', 'decade');
{5}
```

If a unit from a smaller size class would contribute to your desired unit’s total, it is not added.

```edgeql-repl
db> select duration_get(
...   <cal::relative_duration>'1 year 400 days', 'year');
{1}
```

When you request a unit in the smallest size class, it will be pooled with other durations in the same size class.

```edgeql-repl
db> select duration_get(
...   <cal::relative_duration>'20 hours 3600 seconds', 'hour');
{21}
```

Seconds and smaller units always return remaining time in that unit after accounting for the next larger unit.

```edgeql-repl
db> select duration_get(
...   <cal::relative_duration>'20 hours 3600 seconds', 'seconds');
{0}
db> select duration_get(
...   <cal::relative_duration>'20 hours 3630 seconds', 'seconds');
{30}
```

Normalization and truncation may help you deal with this. If your use case allows for making assumptions about the duration of a month or a day, you can make those conversions for yourself using the cal::duration_normalize_hours() or cal::duration_normalize_days() functions. If you got back a duration as a result of a datetime calculation and don’t need the level of granularity you have, you can truncate the value with duration_truncate().

Type: function
Domain: eql
Summary: Truncates the input datetime to a particular precision.
Signature: function std::datetime_truncatedatetime


Truncates the input datetime to a particular precision.

The valid units in order or decreasing precision are:

```edgeql-repl
db> select datetime_truncate(
...   <datetime>'2018-05-07T15:01:22.306916+00', 'years');
{<datetime>'2018-01-01T00:00:00Z'}

db> select datetime_truncate(
...   <datetime>'2018-05-07T15:01:22.306916+00', 'quarters');
{<datetime>'2018-04-01T00:00:00Z'}

db> select datetime_truncate(
...   <datetime>'2018-05-07T15:01:22.306916+00', 'days');
{<datetime>'2018-05-07T00:00:00Z'}

db> select datetime_truncate(
...   <datetime>'2018-05-07T15:01:22.306916+00', 'hours');
{<datetime>'2018-05-07T15:00:00Z'}
```

Type: function
Domain: eql
Summary: Truncates the input duration to a particular precision.
Signature: function std::duration_truncateduration
Signature: function std::duration_truncatecal::relative_duration


Truncates the input duration to a particular precision.

The valid units for duration are:

In addition to the above the following are also valid for cal::relative_duration:

```edgeql-repl
db> select duration_truncate(
...   <duration>'15:01:22', 'hours');
{<duration>'15:00:00'}
db> select duration_truncate(
...   <duration>'15:01:22.306916', 'minutes');
{<duration>'15:01:00'}
db> select duration_truncate(
...   <cal::relative_duration>'400 months', 'years');
{<cal::relative_duration>'P33Y'}
db> select duration_truncate(
...   <cal::relative_duration>'400 months', 'decades');
{<cal::relative_duration>'P30Y'}
```

Type: function
Domain: eql
Summary: Create a datetime value.
Signature: function std::to_datetimedatetime
Signature: function std::to_datetimedatetime
Signature: function std::to_datetimedatetime
Signature: function std::to_datetimedatetime
Signature: function std::to_datetimedatetime
Signature: function std::to_datetimedatetime


Create a datetime value.

The datetime value can be parsed from the input str s. By default, the input is expected to conform to ISO 8601 format. However, the optional argument fmt can be used to override the input format to other forms.

```edgeql-repl
db> select to_datetime('2018-05-07T15:01:22.306916+00');
{<datetime>'2018-05-07T15:01:22.306916Z'}
db> select to_datetime('2018-05-07T15:01:22+00');
{<datetime>'2018-05-07T15:01:22Z'}
db> select to_datetime('May 7th, 2018 15:01:22 +00',
...                    'Mon DDth, YYYY HH24:MI:SS TZH');
{<datetime>'2018-05-07T15:01:22Z'}
```

Alternatively, the datetime value can be constructed from a cal::local_datetime value:

```edgeql-repl
db> select to_datetime(
...   <cal::local_datetime>'2019-01-01T01:02:03', 'HKT');
{<datetime>'2018-12-31T17:02:03Z'}
```

Another way to construct a the datetime value is to specify it in terms of its component parts: year, month, day, hour, min, sec, and zone.

```edgeql-repl
db> select to_datetime(
...     2018, 5, 7, 15, 1, 22.306916, 'UTC');
{<datetime>'2018-05-07T15:01:22.306916000Z'}
```

Finally, it is also possible to convert a Unix timestamp to a datetime

```edgeql-repl
db> select to_datetime(1590595184.584);
{<datetime>'2020-05-27T15:59:44.584000000Z'}
```

Type: function
Domain: eql
Summary: Create a cal::local_datetime value.
Signature: function cal::to_local_datetimelocal_datetime
Signature: function cal::to_local_datetimelocal_datetime
Signature: function cal::to_local_datetimelocal_datetime


Create a cal::local_datetime value.

Similar to to_datetime(), the cal::local_datetime value can be parsed from the input str s with an optional fmt argument or it can be given in terms of its component parts: year, month, day, hour, min, sec.

For more details on formatting see here.

```edgeql-repl
db> select cal::to_local_datetime('2018-05-07T15:01:22.306916');
{<cal::local_datetime>'2018-05-07T15:01:22.306916'}
db> select cal::to_local_datetime('May 7th, 2018 15:01:22',
...                          'Mon DDth, YYYY HH24:MI:SS');
{<cal::local_datetime>'2018-05-07T15:01:22'}
db> select cal::to_local_datetime(
...     2018, 5, 7, 15, 1, 22.306916);
{<cal::local_datetime>'2018-05-07T15:01:22.306916'}
```

A timezone-aware datetime type can be converted to local datetime in the specified timezone:

```edgeql-repl
db> select cal::to_local_datetime(
...   <datetime>'2018-12-31T22:00:00+08',
...   'America/Chicago');
{<cal::local_datetime>'2018-12-31T08:00:00'}
db> select cal::to_local_datetime(
...   <datetime>'2018-12-31T22:00:00+08',
...   'CST');
{<cal::local_datetime>'2018-12-31T08:00:00'}
```

Type: function
Domain: eql
Summary: Create a cal::local_date value.
Signature: function cal::to_local_datecal::local_date
Signature: function cal::to_local_datecal::local_date
Signature: function cal::to_local_datecal::local_date


Create a cal::local_date value.

Similar to to_datetime(), the cal::local_date value can be parsed from the input str s with an optional fmt argument or it can be given in terms of its component parts: year, month, day.

For more details on formatting see here.

```edgeql-repl
db> select cal::to_local_date('2018-05-07');
{<cal::local_date>'2018-05-07'}
db> select cal::to_local_date('May 7th, 2018', 'Mon DDth, YYYY');
{<cal::local_date>'2018-05-07'}
db> select cal::to_local_date(2018, 5, 7);
{<cal::local_date>'2018-05-07'}
```

A timezone-aware datetime type can be converted to local date in the specified timezone:

```edgeql-repl
db> select cal::to_local_date(
...   <datetime>'2018-12-31T22:00:00+08',
...   'America/Chicago');
{<cal::local_date>'2019-01-01'}
```

Type: function
Domain: eql
Summary: Create a cal::local_time value.
Signature: function cal::to_local_timelocal_time
Signature: function cal::to_local_timelocal_time
Signature: function cal::to_local_timelocal_time


Create a cal::local_time value.

Similar to to_datetime(), the cal::local_time value can be parsed from the input str s with an optional fmt argument or it can be given in terms of its component parts: hour, min, sec.

For more details on formatting see here.

```edgeql-repl
db> select cal::to_local_time('15:01:22.306916');
{<cal::local_time>'15:01:22.306916'}
db> select cal::to_local_time('03:01:22pm', 'HH:MI:SSam');
{<cal::local_time>'15:01:22'}
db> select cal::to_local_time(15, 1, 22.306916);
{<cal::local_time>'15:01:22.306916'}
```

A timezone-aware datetime type can be converted to local date in the specified timezone:

```edgeql-repl
db> select cal::to_local_time(
...   <datetime>'2018-12-31T22:00:00+08',
...   'America/Los_Angeles');
{<cal::local_time>'06:00:00'}
```

Type: function
Domain: eql
Summary: Create a duration value.
Signature: function std::to_durationduration


Create a duration value.

This function uses named only arguments to create a duration value. The available duration fields are: hours, minutes, seconds, microseconds.

```edgeql-repl
db> select to_duration(hours := 1,
...                    minutes := 20,
...                    seconds := 45);
{4845s}
db> select to_duration(seconds := 4845);
{4845s}
```

Type: function
Domain: eql
Summary: Return duration as total number of seconds in interval.
Signature: function std::duration_to_secondsdecimal


Return duration as total number of seconds in interval.

```edgeql-repl
db> select duration_to_seconds(<duration>'1 hour');
{3600.000000n}
db> select duration_to_seconds(<duration>'10 second 123 ms');
{10.123000n}
```

Type: function
Domain: eql
Summary: Create a cal::relative_duration value.
Signature: function cal::to_relative_durationcal::relative_duration


Create a cal::relative_duration value.

This function uses named only arguments to create a cal::relative_duration value. The available duration fields are: years, months, days, hours, minutes, seconds, microseconds.

```edgeql-repl
db> select cal::to_relative_duration(years := 5, minutes := 1);
{<cal::relative_duration>'P5YT1S'}
db> select cal::to_relative_duration(months := 3, days := 27);
{<cal::relative_duration>'P3M27D'}
```

Type: function
Domain: eql
Summary: Create a cal::date_duration value.
Signature: function cal::to_date_durationcal::date_duration


Create a cal::date_duration value.

This function uses named only arguments to create a cal::date_duration value. The available duration fields are: years, months, days.

```edgeql-repl
db> select cal::to_date_duration(years := 1, days := 3);
{<cal::date_duration>'P1Y3D'}
db> select cal::to_date_duration(days := 12);
{<cal::date_duration>'P12D'}
```

Type: function
Domain: eql
Summary: Convert 24-hour chunks into days.
Signature: function cal::duration_normalize_hourscal::relative_duration


Convert 24-hour chunks into days.

This function converts all 24-hour chunks into day units. The resulting cal::relative_duration is guaranteed to have less than 24 hours in total in the units smaler than days.

```edgeql-repl
db> select cal::duration_normalize_hours(
...   <cal::relative_duration>'1312 hours');
{<cal::relative_duration>'P54DT16H'}
```

This is a lossless operation because 24 hours are always equal to 1 day in cal::relative_duration units.

This is sometimes used together with cal::duration_normalize_days().

Type: function
Domain: eql
Summary: Convert 30-day chunks into months.
Signature: function cal::duration_normalize_dayscal::relative_duration
Signature: function cal::duration_normalize_dayscal::date_duration


Convert 30-day chunks into months.

This function converts all 30-day chunks into month units. The resulting cal::relative_duration or cal::date_duration is guaranteed to have less than 30 day units.

```edgeql-repl
db> select cal::duration_normalize_days(
...   <cal::relative_duration>'1312 days');
{<cal::relative_duration>'P3Y7M22D'}

db> select cal::duration_normalize_days(
...   <cal::date_duration>'1312 days');
{<cal::date_duration>'P3Y7M22D'}
```

This function is a form of approximation and does not preserve the exact duration.

This is often used together with cal::duration_normalize_hours().

