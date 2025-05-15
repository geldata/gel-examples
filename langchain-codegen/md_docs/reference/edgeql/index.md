# EdgeQL

EdgeQL is a next-generation query language designed to match SQL in power and surpass it in terms of clarity, brevity, and intuitiveness. It’s used to query the database, insert/update/delete data, modify/introspect the schema, manage transactions, and more.

## Design goals

EdgeQL is a spiritual successor to SQL designed with a few core principles in mind.

Compatible with modern languages. A jaw-dropping amount of effort has been spent attempting to bridge the gap between the relational paradigm of SQL and the object-oriented nature of modern programming languages. Gel sidesteps this problem by modeling data in an object-relational way.

Strongly typed. EdgeQL is inextricably tied to Gel’s rigorous object-oriented type system. The type of all expressions is statically inferred by Gel.

Designed for programmers. EdgeQL prioritizes syntax over keywords; It uses { curly braces } to define scopes/structures and the assignment operator := to set values. The result is a query language that looks more like code and less like word soup.

Easy deep querying. Gel’s object-relational nature makes it painless to write deep, performant queries that traverse links, no JOINs required.

Composable. Unlike SQL, EdgeQL’s syntax is readily composable; queries can be cleanly nested without worrying about Cartesian explosion.

