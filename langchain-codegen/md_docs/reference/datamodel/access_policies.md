# Access Policies

Object types in Gel can contain security policies that restrict the set of objects that can be selected, inserted, updated, or deleted by a particular query. This is known as object-level security and is similar in function to SQL’s row-level security.

When no access policies are defined, object-level security is not activated: any properly authenticated client can carry out any operation on any object in the database. Access policies allow you to ensure that the database itself handles access control logic rather than having to implement it in every application or service that connects to your database.

Access policies can greatly simplify your backend code, centralizing access control logic in a single place. They can also be extremely useful for implementing AI agentic flows, where you want to have guardrails around your data that agents can’t break.

We’ll illustrate access policies in this document with this simple schema:

```sdl
type User {
  required email: str { constraint exclusive; }
}

type BlogPost {
  required title: str;
  required author: User;
}
```

## Global variables

Global variables are a convenient way to set up the context for your access policies.  Gel’s global variables are tightly integrated with the Gel’s data model, client APIs, EdgeQL and SQL, and the tooling around them.

Global variables in Gel are not pre-defined. Users are free to define as many globals in their schema as they want to represent the business logic of their application.

A common scenario is storing a current_user global representing the user executing queries. We’d like to have a slightly more complex example showing that you can use more than one global variable. Let’s do that:

Here is an illustration:

```sdl-diff
+   scalar type Country extending enum<Full, ReadOnly, None>;
+   global current_user: uuid;
+   required global current_country: Country {
+     default := Country.None
+   }

    type User {
      required email: str { constraint exclusive; }
    }

    type BlogPost {
      required title: str;
      required author: User;
    }
```

You can set and reset these globals in Gel client libraries, for example:

### typescript

```typescript
import createClient from 'gel';

const client = createClient();

// 'authedClient' will share the network connection with 'client',
// but will have the 'current_user' global set.
const authedClient = client.withGlobals({
  current_user: '2141a5b4-5634-4ccc-b835-437863534c51',
});

const result = await authedClient.query(
  `select global current_user;`);
console.log(result);
```

### python

```python
from gel import create_client

client = create_client().with_globals({
    'current_user': '580cc652-8ab8-4a20-8db9-4c79a4b1fd81'
})

result = client.query("""
    select global current_user;
""")
print(result)
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
use gel_protocol::{
  model::Uuid,
  value::EnumValue
};

let client = gel_tokio::create_client()
    .await
    .expect("Client should init")
    .with_globals_fn(|c| {
        c.set(
            "current_user",
            Value::Uuid(
                Uuid::parse_str("2141a5b4-5634-4ccc-b835-437863534c51")
                    .expect("Uuid should have parsed"),
            ),
        );
        c.set(
            "current_country",
            Value::Enum(EnumValue::from("Full"))
        );
    });
client
    .query_required_single::<Uuid, _>("select global current_user;", &())
    .await
    .expect("Returning value");
```

## Defining policies

A policy example for our simple blog schema might look like:

```sdl-diff
  global current_user: uuid;
  required global current_country: Country {
    default := Country.None
  }
  scalar type Country extending enum<Full, ReadOnly, None>;

  type User {
    required email: str { constraint exclusive; }
  }

  type BlogPost {
    required title: str;
    required author: User;

+   access policy author_has_full_access
+     allow all
+     using (global current_user    ?= .author.id
+       and  global current_country ?= Country.Full) {
+       errmessage := "User does not have full access";
+     }

+   access policy author_has_read_access
+     allow select
+     using (global current_user    ?= .author.id
+       and  global current_country ?= Country.ReadOnly);
  }
```

Explanation:

Let’s run some experiments in the REPL:

```edgeql-repl
db> insert User { email := "test@example.com" };
{default::User {id: be44b326-03db-11ed-b346-7f1594474966}}
db> set global current_user :=
...   <uuid>"be44b326-03db-11ed-b346-7f1594474966";
OK: SET GLOBAL
db> set global current_country := Country.Full;
OK: SET GLOBAL
db> insert BlogPost {
...    title := "My post",
...    author := (select User filter .id = global current_user)
...  };
{default::BlogPost {id: e76afeae-03db-11ed-b346-fbb81f537ca6}}
```

Because the user is in a “full access” country and the current user ID matches the author, the new blog post is permitted. When the same user sets global current_country := Country.ReadOnly;:

```edgeql-repl
db> set global current_country := Country.ReadOnly;
OK: SET GLOBAL
db> select BlogPost;
{default::BlogPost {id: e76afeae-03db-11ed-b346-fbb81f537ca6}}
db> insert BlogPost {
...    title := "My second post",
...    author := (select User filter .id = global current_user)
...  };
gel error: AccessPolicyError: access policy violation on
insert of default::BlogPost (User does not have full access)
```

Finally, let’s unset current_user and see how many blog posts are returned when we count them.

```edgeql-repl
db> set global current_user := {};
OK: SET GLOBAL
db> select BlogPost;
{}
db> select count(BlogPost);
{0}
```

select BlogPost returns zero results in this case as well. We can only select the posts written by the user specified by current_user. When current_user has no value or has a different value from the .author.id of any existing BlogPost objects, we can’t read any posts. But thanks to Country being set to Country.Full, this user will be able to write a new blog post.

The bottom line: access policies use global variables to define a “subgraph” of data that is visible to your queries.

## Policy types

The types of policy rules map to the statement type in EdgeQL:

## Resolution order

If multiple policies apply (some are allow and some are deny), the logic is:

By default, once you define any policy on an object type, you must explicitly allow the operations you need. This is a common pitfall when you are starting out with access policies (but you will develop an intuition for this quickly). Let’s look at an example:

```sdl
global current_user_id: uuid;
global current_user := (
  select User filter .id = global current_user_id
);

type User {
  required email: str { constraint exclusive; }
  required is_admin: bool { default := false };

  access policy admin_only
    allow all
    using (global current_user.is_admin ?? false);
}

type BlogPost {
  required title: str;
  author: User;

  access policy author_has_full_access
    allow all
    using (global current_user ?= .author.id);
}
```

In the above schema only admins will see a non-empty author link when running select BlogPost { author }. Why? Because only admins can see User objects at all: admin_only policy is the only one defined on the User type!

This means that instead of making BlogPost visible to its author, all non-admin authors won’t be able to see their own posts. The above issue can be remedied by making the current user able to see their own User record.

## Interaction between policies

Policy expressions themselves do not take other policies into account (since EdgeDB 3). This makes it easier to reason about policies.

## Custom error messages

When an insert or update write violates an access policy, Gel will raise a generic AccessPolicyError:

```default
gel error: AccessPolicyError: access policy violation
on insert of <type>
```

Restricted access is represented either as an error message or an empty set, depending on the filtering order of the operation. The operations select, delete, or update read filter up front, and thus you simply won’t get the data that is being restricted. Other operations (insert and update write) will return an error message.

If multiple policies are in effect, it can be helpful to define a distinct errmessage in your policy:

```sdl-diff
  global current_user_id: uuid;
  global current_user := (
    select User filter .id = global current_user_id
  );

  type User {
    required email: str { constraint exclusive; };
    required is_admin: bool { default := false };

    access policy admin_only
      allow all
+     using (global current_user.is_admin ?? false) {
+       errmessage := 'Only admins may query Users'
+     };
  }

  type BlogPost {
    required title: str;
    author: User;

    access policy author_has_full_access
      allow all
+     using (global current_user ?= .author) {
+       errmessage := 'BlogPosts may only be queried by their authors'
+     };
  }
```

Now if you attempt, for example, a User insert as a non-admin user, you will receive this error:

```default
gel error: AccessPolicyError: access policy violation on insert of
default::User (Only admins may query Users)
```

## Disabling policies

You may disable all access policies by setting the apply_access_policies configuration parameter to false.

You may also temporarily disable access policies using the Gel UI configuration checkbox (or via gel ui), which only applies to your UI session.

## More examples

Here are some additional patterns:

## Super constraints

Access policies can act like “super constraints.” For instance, a policy on insert or update write can do a post-write validity check, rejecting the operation if a certain condition is not met.

E.g. here’s a policy that limits the number of blog posts a User can post:

```sdl-diff
  type User {
    required email: str { constraint exclusive; }
+   multi posts := .<author[is BlogPost]
  }

  type BlogPost {
    required title: str;
    required author: User;

    access policy author_has_full_access
      allow all
      using (global current_user ?= .author.id);
+   access policy max_posts_limit
+     deny insert
+     using (count(.author.posts) > 500);
  }
```

## Declaring access policies

This section describes the syntax to declare access policies in your schema.

## DDL commands

This section describes the low-level DDL commands for creating, altering, and dropping access policies. You typically don’t need to use these commands directly, but knowing about them is useful for reviewing migrations.

