# Globals

Schemas in Gel can contain typed global variables. These create a mechanism for specifying session-level context that can be referenced in queries, access policies, triggers, and elsewhere with the global keyword.

Here’s a very common example of a global variable representing the current user ID:

```sdl
global current_user_id: uuid;
```

### edgeql

```edgeql
select User {
  id,
  posts: { title, content }
}
filter .id = global current_user_id;
```

### python

```python
# In a non-trivial example, `global current_user_id` would
# be used indirectly in an access policy or some other context.
await client.with_globals({'user_id': user_id}).qeury('''
  select User {
    id,
    posts: { title, content }
  }
  filter .id = global current_user_id;
''')
```

### typescript

```typescript
// In a non-trivial example, `global current_user_id` would
// be used indirectly in an access policy or some other context.
await client.withGlobals({user_id}).qeury('''
  select User {
    id,
    posts: { title, content }
  }
  filter .id = global current_user_id;
''')
```

## Setting global variables

Global variables are set at session level or when initializing a client. The exact API depends on which client library you’re using, but the general behavior and principles are the same across all libraries.

### typescript

```typescript
import createClient from 'gel';

const baseClient = createClient();

// returns a new Client instance, that shares the underlying
// network connection with `baseClient` , but sends the configured
// globals along with all queries run through it:
const clientWithGlobals = baseClient.withGlobals({
  current_user_id: '2141a5b4-5634-4ccc-b835-437863534c51',
});

const result = await clientWithGlobals.query(
  `select global current_user_id;`
);
```

### python

```python
from gel import create_client

base_client = create_client()

# returns a new Client instance, that shares the underlying
# network connection with `base_client` , but sends the configured
# globals along with all queries run through it:
client = base_client.with_globals({
    'current_user_id': '580cc652-8ab8-4a20-8db9-4c79a4b1fd81'
})

result = client.query("""
    select global current_user_id;
""")
```

### go

```go
package main

import (
  "context"
  "fmt"
  "log"

  "github.com/geldata/gel-go"
)

func main() {
  ctx := context.Background()
  client, err := gel.CreateClient(ctx, gel.Options{})
  if err != nil {
    log.Fatal(err)
  }
  defer client.Close()

  id, err := gel.ParseUUID("2141a5b4-5634-4ccc-b835-437863534c51")
  if err != nil {
    log.Fatal(err)
  }

  var result gel.UUID
  err = client.
    WithGlobals(map[string]interface{}{"current_user": id}).
    QuerySingle(ctx, "SELECT global current_user;", &result)
  if err != nil {
    log.Fatal(err)
  }

  fmt.Println(result)
}
```

### rust

```rust
use uuid::Uuid;

let client = gel_tokio::create_client().await.expect("Client init");

let client_with_globals = client.with_globals_fn(|c| {
    c.set(
        "current_user_id",
        Value::Uuid(
            Uuid::parse_str("2141a5b4-5634-4ccc-b835-437863534c51")
                .expect("Uuid should have parsed"),
        ),
    )
});
let val: Uuid = client_with_globals
    .query_required_single("select global current_user_id;", &())
    .await
    .expect("Returning value");
println!("Result: {val}");
```

### edgeql

```edgeql
set global current_user_id :=
  <uuid>'2141a5b4-5634-4ccc-b835-437863534c51';
```

## Cardinality

A global variable can be declared with one of two cardinalities:

In addition, a global can be marked required or optional (the default). If marked required, a default value must be provided.

## Computed globals

Global variables can also be computed. The value of computed globals is dynamically computed when they are referenced in queries.

```sdl
required global now := datetime_of_transaction();
```

The provided expression will be computed at the start of each query in which the global is referenced. There’s no need to provide an explicit type; the type is inferred from the computed expression.

Computed globals can also be object-typed and have multi cardinality. For example:

```sdl
global current_user_id: uuid;

# object-typed global
global current_user := (
  select User filter .id = global current_user_id
);

# multi global
global current_user_friends := (global current_user).friends;
```

## Referencing globals

Unlike query parameters, globals can be referenced inside your schema declarations:

```sdl
type User {
  name: str;
  is_self := (.id = global current_user_id)
};
```

This is particularly useful when declaring access policies:

```sdl
type Person {
  required name: str;

  access policy my_policy allow all
    using (.id = global current_user_id);
}
```

Refer to Access Policies for complete documentation.

## Declaring globals

This section describes the syntax to declare a global variable in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping globals. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

