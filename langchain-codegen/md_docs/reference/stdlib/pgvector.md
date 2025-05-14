# ext::pgvector

This can be used to store and efficiently retrieve text embeddings, such as those produced by OpenAI.

The Postgres that comes packaged with the Gel server includes pgvector, as does Gel Cloud. It you are using a separate Postgres backend, you will need to arrange for it to be installed.

To activate this new functionality you can use the extension mechanism:

```sdl
using extension pgvector;
```

That will give you access to the ext::pgvector module where you may find the ext::pgvector::vector type as well as the following functions:

You also get access to the following three indexes, each corresponding to one of the vector distance functions:

When defining a new type, you can now add vector properties. However, in order to be able to use indexes, the vectors in question need to be of fixed length. This can be achieved by creating a custom scalar extending the vector and specifying the desired length in angle brackets:

```sdl
scalar type v3 extending ext::pgvector::vector<3>;

type Item {
    embedding: v3
}
```

To populate your data, you can cast an array of any of the numeric types into ext::pgvector::vector or simply assign that array directly:

```edgeql-repl
gel> insert Item {embedding := <v3>[1.2, 3, 4.5]};
{default::Item {id: f119d64e-0995-11ee-8804-ff8cd739d8b7}}
gel> insert Item {embedding := [-0.1, 7, 0]};
{default::Item {id: f410c844-0995-11ee-8804-176f28167dd1}}
```

You can also cast the vectors into an array<float32>>:

```edgeql-repl
gel> select <array<float32>>Item.embedding;
{[1.2, 3, 4.5], [-0.1, 7, 0]}
```

You can query the nearest neighbour by ordering based on euclidean_distance:

```edgeql-repl
gel> select Item {*}
.... order by ext::pgvector::euclidean_distance(
....   .embedding, <v3>[3, 1, 2])
.... empty last
.... limit 1;
{
  default::Item {
    id: f119d64e-0995-11ee-8804-ff8cd739d8b7,
    embedding: [1.2, 3, 4.5],
  },
}
```

You can also just retrieve all results within a certain distance:

```edgeql-repl
gel> select Item {*}
.... filter ext::pgvector::euclidean_distance(
....   .embedding, <v3>[3, 1, 2]) < 5;
{
  default::Item {
    id: f119d64e-0995-11ee-8804-ff8cd739d8b7,
    embedding: [1.2, 3, 4.5],
  },
}
```

The functions mentioned earlier can be used to calculate various useful vector distances:

```edgeql-repl
gel> select Item {
....   id,
....   distance := ext::pgvector::euclidean_distance(
....     .embedding, <v3>[3, 1, 2]),
....   inner_product := -ext::pgvector::neg_inner_product(
....     .embedding, <v3>[3, 1, 2]),
....   cosine_similarity := 1 - ext::pgvector::cosine_distance(
....     .embedding, <v3>[3, 1, 2]),
.... };
{
  default::Item {
    id: f119d64e-0995-11ee-8804-ff8cd739d8b7,
    distance: 3.6728735110725803,
    inner_product: 15.600000143051147,
    cosine_similarity: 0.7525964057358976,
  },
  default::Item {
    id: f410c844-0995-11ee-8804-176f28167dd1,
    distance: 7.043436619202443,
    inner_product: 6.699999988079071,
    cosine_similarity: 0.2557810894509498,
  },
}
```

To speed up queries three slightly different IVFFlat indexes can be added to the type, each of them optimizing one of the distance calculating functions:

```sdl
type Item {
    embedding: v3;

  index ext::pgvector::ivfflat_euclidean(lists := 10) on (.embedding);
  index ext::pgvector::ivfflat_ip(lists := 10) on (.embedding);
  index ext::pgvector::ivfflat_cosine(lists := 10) on (.embedding);
}
```

In order to take advantage of an index, your query must:

Note that unlike normal indexes, hitting an IVFFlat index changes the query behavior: it does a (hopefully fast) approximate search instead of (usually slow) exact one.

As per the pgvector recommendations, the keys to achieving good recall are:

Use our newly introduced analyze feature to debug query performance and make sure that the indexes are being used.

The ext::pgvector::set_probes() function configures the number of probes to use in approximate index searches. It is scoped to the current transaction, so if you call it from within a transaction, it persists until the transaction is finished. The recommended way to use it, however, is to take advantage of the implicit transactions provided by multi-statement queries:

```python
result = client.query("""
    select set_probes(10);
    select Item { id, name }
    order by ext::pgvector::euclidean_distance(
      .embedding, <v3>$vector)
    empty last
    limit 1;
""", vector=vector)
```

