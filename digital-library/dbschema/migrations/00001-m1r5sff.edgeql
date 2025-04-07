CREATE MIGRATION m1r5sfferv2tmd72xq6ydfknblmx5quwoibd2rbwtadpsiwm7zhg5a
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.7';
  CREATE EXTENSION ai VERSION '1.0';
  CREATE TYPE default::Author {
      CREATE PROPERTY country: std::str;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Book {
      CREATE REQUIRED LINK author: default::Author;
      CREATE REQUIRED PROPERTY summary: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE DEFERRED INDEX ext::ai::index(embedding_model := 'text-embedding-3-small') ON (((.title ++ ': ') ++ .summary));
  };
  ALTER TYPE default::Author {
      CREATE LINK books := (.<author[IS default::Book]);
  };
};
