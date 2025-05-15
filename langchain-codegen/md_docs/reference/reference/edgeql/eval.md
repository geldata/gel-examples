# Evaluation algorithm

EdgeQL is a functional language in the sense that every expression is a composition of one or more queries.

Queries can be explicit, such as a select statement, or implicit, as dictated by the semantics of a function, operator or a statement clause.

An implicit select subquery is assumed in the following situations:

A nested query is called a subquery.  Here, the phrase “apearing directly in the query” means “appearing directly in the query rather than in the subqueries”.

A query is evaluated recursively using the following procedure:

