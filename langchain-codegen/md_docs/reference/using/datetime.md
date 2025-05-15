# Date/Time Handling

Gel has 6 types related to date and time handling:

Usually we try to map those types to the respective language-native types, with the following caveats:

If any of the above criteria is not met, we usually provide a custom type in the client library itself that can be converted to a type from the language’s standard library or from a popular third-party library.

## Precision

datetime, duration, cal::local_datetime and cal::relative_duration all have precision of 1 microsecond.

This means that if language-native type have a bigger precision such as nanosecond, client library has to round that timestamp when encoding it for Gel.

We use rounding to the nearest even for that operation. Here are some examples of timestamps with high precision, and how they are stored in the database:

```text
2022-02-24T05:43:03.123456789Z → 2022-02-24T05:43:03.123457Z
2022-02-24T05:43:03.000002345Z → 2022-02-24T05:43:03.000002Z
2022-02-24T05:43:03.000002500Z → 2022-02-24T05:43:03.000002Z
2022-02-24T05:43:03.000002501Z → 2022-02-24T05:43:03.000003Z
2022-02-24T05:43:03.000002499Z → 2022-02-24T05:43:03.000002Z
2022-02-24T05:43:03.000001234Z → 2022-02-24T05:43:03.000001Z
2022-02-24T05:43:03.000001500Z → 2022-02-24T05:43:03.000002Z
2022-02-24T05:43:03.000001501Z → 2022-02-24T05:43:03.000002Z
2022-02-24T05:43:03.000001499Z → 2022-02-24T05:43:03.000001Z
```

A quick refresher on rounding types: If we perform multiple operations of summing while rounding half-up or rounding half-down, the error margin of the resulting value tends to increase. If we round half-to-even instead, the expected value of summing tends to be more accurate.

Note as described in datetime protocol documentation the value is encoded as a signed microseconds delta since a fixed time. Some care must be taken when rounding negative microsecond values.

Rounding to the nearest even applies to all operations that client libraries perform, in particular:

