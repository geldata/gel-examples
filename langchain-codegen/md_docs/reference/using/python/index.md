# Python

gel-python is the official Gel driver for Python.  It provides both blocking IO and asyncio implementations.

## Installation

Install the client package from PyPI using your package manager of choice.

### pip

```bash
$ pip install gel
```

### uv

```bash
$ uv add gel
```

## Basic Usage

To start using Gel in Python, create an gel.Client instance using gel.create_client() or gel.create_async_client() for AsyncIO. This client instance manages a pool of connections to the database which it discovers automatically from either being in a gel project init directory or being provided connection details via Environment Variables. See the environment section of the connection reference for more details and options.

If you’re using Gel Cloud to host your development instance, you can use the gel cloud login command to authenticate with Gel Cloud and then use the gel project init --server-instance <instance-name> command to create a local project-linked instance that is linked to an Gel Cloud instance. For more details, see the Gel Cloud guide.

### Blocking

```python
import datetime
import gel

client = gel.create_client()

client.query("""
    INSERT User {
        name := <str>$name,
        dob := <cal::local_date>$dob
    }
""", name="Bob", dob=datetime.date(1984, 3, 1))

user_set = client.query(
    "SELECT User {name, dob} FILTER .name = <str>$name", name="Bob")
# *user_set* now contains
# Set{Object{name := 'Bob', dob := datetime.date(1984, 3, 1)}}

client.close()
```

### AsyncIO

```python
import asyncio
import datetime
import gel

client = gel.create_async_client()

async def main():
    await client.query("""
        INSERT User {
            name := <str>$name,
            dob := <cal::local_date>$dob
        }
    """, name="Bob", dob=datetime.date(1984, 3, 1))

    user_set = await client.query(
        "SELECT User {name, dob} FILTER .name = <str>$name", name="Bob")
    # *user_set* now contains
    # Set{Object{name := 'Bob', dob := datetime.date(1984, 3, 1)}}

    await client.aclose()

asyncio.run(main())
```

## Code generation

The gel-python package exposes a command-line tool to generate typesafe functions from *.edgeql files, using dataclasses for objects primarily.

*queries/get_user_by_name.edgeql*

```edgeql
with
    name := <str>$name,
select User { first_name, email, bio }
filter .name = name;
```

```bash
$ gel-py
# or
$ python -m gel.codegen
```

```python
import gel
from .queries import get_user_by_name_sync_edgeql as get_user_by_name_qry

client = gel.create_async_client()

async def main():
  result = await get_user_by_name_qry.get_user_by_name(client, name="John")
  print(result)

asyncio.run(main())
```

