CREATE MIGRATION m13byy5at3hzvzltb6zosbqmsv3gl2x2vrm2wqniw3dibh3zwfc2nq
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.7';
  CREATE EXTENSION vectorstore VERSION '0.1';
  CREATE SCALAR TYPE default::vector_512 EXTENDING ext::pgvector::vector<512>;
  CREATE TYPE default::Image EXTENDING ext::vectorstore::BaseRecord {
      ALTER PROPERTY embedding {
          SET OWNED;
          SET TYPE default::vector_512;
      };
      CREATE INDEX ext::pgvector::hnsw_cosine(m := 16, ef_construction := 128) ON (.embedding);
  };
};
