# Client Libraries

Gel implements libraries for popular languages that make it easier to work with Gel. These libraries provide a common set of functionality.

For some use cases, you may not need a client library. Gel allows you to execute queries over HTTP. This is slower than the binary protocol and lacks support for transactions and rich data types, but may be suitable if a client library isn’t available for your language of choice.

## Available libraries

To execute queries from your application code, use one of Gel’s client libraries.

## Usage

To follow along with the guide below, first create a new directory and initialize a project.

```bash
$ mydir myproject
$ cd myproject
$ gel project init
```

Configure the environment as needed for your preferred language.

### Node.js

```bash
$ npm init -y
$ tsc --init # (TypeScript only)
$ touch index.ts
```

### Deno

```bash
$ touch index.ts
```

### Python

```bash
$ python -m venv venv
$ source venv/bin/activate
$ touch main.py
```

### Rust

```bash
$ cargo init
```

### Go

```bash
$ go mod init example/quickstart
$ touch hello.go
```

### .NET

```bash
$ dotnet new console -o . -f net6.0
```

Install the Gel client library.

### Node.js

```bash
$ npm install gel    # npm
$ yarn add gel       # yarn
```

### Deno

```txt
n/a
```

### Python

```bash
$ pip install gel
```

### Rust

```toml
# Cargo.toml

[dependencies]
gel-tokio = "0.5.0"
# Additional dependency
tokio = { version = "1.28.1", features = ["macros", "rt-multi-thread"] }
```

### Go

```bash
$ go get github.com/geldata/gel-go
```

### .NET

```bash
$ dotnet add package Gel.Net.Driver
```

Copy and paste the following simple script. This script initializes a Client instance. Clients manage an internal pool of connections to your database and provide a set of methods for executing queries.

Note that we aren’t passing connection information (say, a connection URL) when creating a client. The client libraries can detect that they are inside a project directory and connect to the project-linked instance automatically. For details on configuring connections, refer to the Connection section below.

### Node.js

```typescript
import {createClient} from 'gel';

const client = createClient();

client.querySingle(`select random()`).then((result) => {
  console.log(result);
});
```

### python

```python
from gel import create_client

client = create_client()

result = client.query_single("select random()")
print(result)
```

### rust

```rust
// src/main.rs
#[tokio::main]
async fn main() {
    let conn = gel_tokio::create_client()
        .await
        .expect("Client initiation");
    let val = conn
        .query_required_single::<f64, _>("select random()", &())
        .await
        .expect("Returning value");
    println!("Result: {}", val);
}
```

### go

```go
// hello.go
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

  var result float64
  err = client.
    QuerySingle(ctx, "select random();", &result)
  if err != nil {
    log.Fatal(err)
  }

  fmt.Println(result)
}
```

### .NET

```csharp
using Gel;

var client = new GelClient();
var result = await client.QuerySingleAsync<double>("select random();");
Console.WriteLine(result);
```

### Elixir

```elixir
# lib/gel_quickstart.ex
defmodule GelQuickstart do
  def run do
    {:ok, client} = Gel.start_link()
    result = Gel.query_single!(client, "select random()")
    IO.inspect(result)
  end
end
```

Finally, execute the file.

### Node.js

```bash
$ npx tsx index.ts
```

### Deno

```bash
$ deno run --allow-all --unstable index.deno.ts
```

### Python

```bash
$ python index.py
```

### Rust

```bash
$ cargo run
```

### Go

```bash
$ go run .
```

### .NET

```bash
$ dotnet run
```

### Elixir

```bash
$ mix run -e GelQuickstart.run
```

You should see a random number get printed to the console. This number was generated inside your Gel instance using EdgeQL’s built-in random() function.

## Connection

All client libraries implement a standard protocol for determining how to connect to your database.

