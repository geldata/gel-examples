# Cardinality

The number of items in a set is known as its cardinality. A set with a cardinality of zero is referred to as an empty set. A set with a cardinality of one is known as a singleton.

## Terminology

The term cardinality is used to refer to both the exact number of elements in a given set or a range of possible values. Internally, Gel tracks 5 different cardinality ranges: Empty (zero elements), One (a singleton set), AtMostOne (zero or one elements), AtLeastOne (one or more elements), and Many (any number of elements).

Gel uses this information to statically check queries for validity. For instance, when assigning to a required multi link, the value being assigned in question must have a cardinality of One or AtLeastOne (as empty sets are not permitted).

## Functions and operators

It’s often useful to think of Gel functions/operators as either element-wise or aggregate. Element-wise operations are applied to each item in a set. Aggregate operations operate on sets as a whole.

This is a simplification, but it’s a useful mental model when getting started with Gel.

