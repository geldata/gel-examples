# ext::ai

This reference documents the Gel ext::ai extension components, configuration options, and database APIs.

## Enabling the Extension

The AI extension can be enabled using the extension mechanism:

```sdl
using extension ai;
```

## Configuration

The AI extension can be configured using configure session or configure current branch:

```edgeql
configure current branch
set ext::ai::Config::indexer_naptime := <duration>'PT30S';
```

## UI

The AI section of the UI can be accessed via the sidebar after the extension has been enabled in the schema. It provides ways to manage provider configurations and RAG prompts, as well as try out different settings in the playground.

## Index

The ext::ai::index creates a deferred semantic similarity index of an expression on a type.

```sdl-diff
  module default {
    type Astronomy {
      content: str;
+     deferred index ext::ai::index(embedding_model := 'text-embedding-3-small')
+       on (.content);
    }
  };
```

Parameters:

## Functions

| --- | --- |
| ext::ai::to_context() | Returns the indexed expression value for an object with an ext::ai::index. |
| ext::ai::search() | Searches objects using their ai::index. |

Type: function
Domain: eql
Summary: Returns the indexed expression value for an object with an ext::ai::index.
Signature: function ext::ai::to_contextstr


Returns the indexed expression value for an object with an ext::ai::index.

Example:

Schema:

```sdl
module default {
  type Astronomy {
    topic: str;
    content: str;
    deferred index ext::ai::index(embedding_model := 'text-embedding-3-small')
      on (.topic ++ ' ' ++ .content);
  }
};
```

Data:

```edgeql-repl
db> insert Astronomy {
...   topic := 'Mars',
...   content := 'Skies on Mars are red.'
... }
db> insert Astronomy {
...   topic := 'Earth',
...   content := 'Skies on Earth are blue.'
... }
```

Results of calling to_context:

```edgeql-repl
db> select ext::ai::to_context(Astronomy);

{'Mars Skies on Mars are red.', 'Earth Skies on Earth are blue.'}
```

Type: function
Domain: eql
Summary: Searches objects using their ai::index.
Signature: function ext::ai::searchoptional tuple<object: anyobject, distance: float64>


Searches objects using their ai::index.

Returns tuples of (object, distance).

```edgeql-repl
db> with query := <array<float32>><json>$query
... select ext::ai::search(Knowledge, query);

{
  (
    object := default::Knowledge {id: 9af0d0e8-0880-11ef-9b6b-4335855251c4},
    distance := 0.20410746335983276
  ),
  (
    object := default::Knowledge {id: eeacf638-07f6-11ef-b9e9-57078acfce39},
    distance := 0.7843298847773637
  ),
  (
    object := default::Knowledge {id: f70863c6-07f6-11ef-b9e9-3708318e69ee},
    distance := 0.8560434728860855
  ),
}
```

## Scalar and Object Types

