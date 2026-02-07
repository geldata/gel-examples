CREATE MIGRATION m13kbwnyi2kvt4xcnc3cistibudtfpdwtq37i22evw5dwbobmzckxa
    ONTO m1r5sfferv2tmd72xq6ydfknblmx5quwoibd2rbwtadpsiwm7zhg5a
{
  ALTER TYPE default::Book {
      DROP INDEX ext::ai::index(embedding_model := 'text-embedding-3-small') ON (((.title ++ ': ') ++ .summary));
      ALTER PROPERTY title {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Book {
      CREATE DEFERRED INDEX ext::ai::index(embedding_model := 'text-embedding-3-small', dimensions := 200) ON (((.title ++ ': ') ++ .summary));
  };
};
