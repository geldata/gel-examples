# Working with booleans

Boolean expressions can be tricky sometimes, so here are a handful of tips and gotchas.

There’s a fundamental difference in how {} is treated by and and or vs all() and any(). The operators and and or require both operands to produce a result, which means that an {} as one of the inputs necessarily produces an {} as the output:

```edgeql-repl
db> select false and <bool>{};
{}
db> select true or <bool>{};
{}
```

The functions all() and any(), however, produce a result for all possible input sets, regardless of the number of elements:

```edgeql-repl
db> select all({false, {}});
{false}
db> select any({true, {}});
{true}
```

Note that expressions like {false, {}} are equivalent to {false} and so the above are just generalizations of boolean operators and and or to a set of 1 element. So the result for 1 element is fairly intuitive. However, the results produced by these functions for {} may be surprising (even though they are mathematically consistent):

```edgeql-repl
db> select all(<bool>{});
{true}
db> select any(<bool>{});
{false}
```

There’s no direct analogue to the boolean operator “short-circuiting” that’s implemented in many other languages because in EdgeQL the order of evaluation of subexpressions is generally not defined. However, there are expressions that achieve the same end goal for which “short-circuiting” is used.

The most basic filtering doesn’t even require any “short-circuiting” guards because these are already implied by EdgeQL. For example, “get all accounts that completed 5 steps of the process”:

```edgeql
select Account filter .steps = 5;
```

When there’s a need to express that a field is initialized, but not equal to some particular value “short-circuiting” is often used to discard non-initialized values (e.g. acc.steps is not None and acc.steps != 5). This is another case where EdgeQL doesn’t require any additional guards. For example “get all initialized accounts that have not completed 5 steps of the process”:

```edgeql
select Account filter .steps != 5;
```

If the task boils down to annotating every element as opposed to selecting specific ones, the use of ?= instead of the plain = helps to deal with optional properties. For example, “get all accounts and annotate them with their completeness status”:

```edgeql
select Account {
    completed := .steps ?= 5
};
```

Sometimes the condition that needs to be evaluated is not a simple equality comparison. The ?? can help out in these cases. For example, “get all accounts and annotate them on whether or not they are half-way completed”:

```edgeql
select Account {
    completed := (.steps > 2) ?? false
};
```

The above trick can also be useful for filtering based on some boolean condition that’s not just a plain equality. For example, “get only the accounts that are less than half-way completed”:

```edgeql
select Account {
    too_few_steps := (.steps <= 2) ?? true
} filter .too_few_steps;
```

The above will end up including the computed flag too_few_steps in the output, but this is sometimes undesirable. In order to avoid including it, the query can be refactored like this:

```edgeql
select Account {
    name,
    email,
    # whatever other relevant data is needed
} filter (.steps <= 2) ?? true;
```

When using ?=, ?=, or ?? it is important to keep in mind how they interact with path expressions that can sometimes be {}. Basically, these operators don’t actually affect the path expression, they only act on the results of the path expression. Consider the following two queries:

```edgeql
select Account {
    too_few_steps := (.steps <= 2) ?? true
}.too_few_steps;

select (Account.steps <= 2) ?? true;
```

The first query is going to output true or false for every account, based on the specified criteria. It’s important to note that the number of the results is going to be exactly the same as the number of the accounts in the system. The second query may look like a more compact version of the first query, but it behaves completely differently. If all of the account are “uninitialized” (steps := {}) or there are no accounts at all, it will produce a single result true. That’s because the expression Account.steps <= 2 produces an empty set in this case and so the ?? returns the second operand. On the other hand, if there are any accounts with some concrete number of steps, then the expression Account.steps <= 2 will produce a result for those accounts only. The ?? won’t change that result because the result is already non-empty and so no coalescing will take place.

Computeds in shapes get evaluated for each object, whereas path expressions only produce as many values as are reachable by the path. So when all objects must be considered, computed links and properties in shapes are a good way to handle complex expressions or filters. When only objects with specific properties are relevant, path expressions are a good compact way of handling this.

There’s also another way to evaluate something on a per-object basis and that’s by using a for query. For example, let’s rewrite the query that outputs true or false for every account, based on the number of completed steps:

```edgeql
for A in Account
union (A.steps <= 2) ?? true;
```

Expressions specified in shapes, for, or filter clauses are all evaluated on a per-item basis. The gotchas in these cases can arise from using longer path expressions combined with ??, ?=, or ?!=. For example, let’s say that in addition to accounts and steps we also have different “projects” with a multi-link of accounts marking progress in them. So keeping that in mind, let’s try writing a query to “get all projects that have linked accounts which made little progress (fewer than 3 ``steps``)”:

```edgeql
select Project
filter .accounts.steps < 3;
```

Well, that’s not right. Projects that have accounts without any steps of progress are not reported by the above query. So maybe adding a ?? will help?

```edgeql
select Project
filter (.accounts.steps < 3) ?? true;
```

This is better as the results now include projects where none of the accounts made any progress. However, any project that has a mix of accounts that made more than 2 steps of progress and accounts that haven’t even started is still missing from the results. So we can either use the trick we used before with shapes or we can add another for subquery:

```edgeql
select Project
filter (
    for A in .accounts
    union (A.steps < 3) ?? true
);
```

Note that the filter clause behaves as an implicit any(). This means that the following are semantically equivalent:

```edgeql
select User
filter .friends.name = 'Alice';

select User
filter any(.friends.name = 'Alice');
```

