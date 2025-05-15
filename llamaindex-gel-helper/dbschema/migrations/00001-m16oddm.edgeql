CREATE MIGRATION m16oddmzoqite4zqjntsx7kjgamy7skqdv577dsb2ufdtpdsgvwurq
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.7';
  CREATE SCALAR TYPE default::EmbeddingVector EXTENDING ext::pgvector::vector<1536>;
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::Record {
      CREATE PROPERTY embedding: default::EmbeddingVector;
      CREATE INDEX ext::pgvector::hnsw_cosine(m := 16, ef_construction := 128) ON (.embedding);
      CREATE REQUIRED PROPERTY collection: std::str;
      CREATE PROPERTY external_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY metadata: std::json;
      CREATE PROPERTY text: std::str;
  };
};
