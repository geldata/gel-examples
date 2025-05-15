# Sequences

| --- | --- |
| sequence | Auto-incrementing sequence of int64. |
| sequence_next() | Increments the given sequence to its next value and returns that value. |
| sequence_reset() | Resets a sequence to initial state or a given value, returning the value. |

Type: type
Domain: eql
Summary: An auto-incrementing sequence of int64.
Signature: type sequence


An auto-incrementing sequence of int64.

This type can be used to create auto-incrementing properties:

```sdl
scalar type TicketNo extending sequence;

type Ticket {
    number: TicketNo {
        constraint exclusive;
    }
}
```

A sequence is bound to the scalar type, not to the property, so if multiple properties use the same sequence, they will share the same counter. For each distinct counter, a separate scalar type that is extending sequence should be used.

Type: function
Domain: eql
Summary: Increments the given sequence to its next value and returns that value.
Signature: function std::sequence_nextint64


Increments the given sequence to its next value and returns that value.

See the note on specifying your sequence for best practices on supplying the seq parameter.

Sequence advancement is done atomically; each concurrent session and transaction will receive a distinct sequence value.

```edgeql-repl
db> select sequence_next(introspect MySequence);
{11}
```

Type: function
Domain: eql
Summary: Resets a sequence to initial state or a given value, returning the value.
Signature: function std::sequence_resetint64
Signature: function std::sequence_resetint64


Resets a sequence to initial state or a given value, returning the value.

See the note on specifying your sequence for best practices on supplying the seq parameter.

The single-parameter form resets the sequence to its initial state, where the next sequence_next() call will return the first value in sequence. The two-parameter form allows you to set the current value of the sequence. The next sequence_next() call will return the value after the one you passed to sequence_reset().

```edgeql-repl
db> select sequence_reset(introspect MySequence);
{1}
db> select sequence_next(introspect MySequence);
{1}
db> select sequence_reset(introspect MySequence, 22);
{22}
db> select sequence_next(introspect MySequence);
{23}
```

To specify the sequence to be operated on by either sequence_next() or sequence_reset(), you must pass a schema::ScalarType object. If the sequence argument is known ahead of time and does not change, we recommend passing it by using the introspect operator: select sequence_next(introspect MySequenceType); # or select sequence_next(introspect typeof MyObj.seq_prop); This style of execution will ensure that the reference to a sequential type from a given expression is tracked properly to guarantee schema referential integrity. It doesn’t work in every use case, though. If in your use case, the sequence type must be determined at run time via a query argument, you will need to query it from the schema::ScalarType set directly: with SeqType := ( select schema::ScalarType filter .name = <str>$seq_type_name ) select sequence_next(SeqType);

