# Introspection

All of the schema information in Gel is stored in the schema module and is accessible via introspection queries.

All the introspection types are themselves extending BaseObject, so they are also subject to introspection as object types. The following query will give a list of all the types used in introspection:

```edgeql
select name := schema::ObjectType.name
filter name like 'schema::%';
```

There’s also a couple of ways of getting the introspection type of a particular expression. Any Object has a __type__ link to the schema::ObjectType. For scalars there’s the introspect and typeof operators that can be used to get the type of an expression.

Finally, the command describe can be used to get information about Gel types in a variety of human-readable formats.

