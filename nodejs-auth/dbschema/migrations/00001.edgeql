CREATE MIGRATION m13bcrrwlp5jdlmorad6tuv3uubb5jkbgd5f6dbhehhsbrw7jardvq
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity;
      CREATE PROPERTY name: std::str;
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE TYPE default::Post {
      CREATE REQUIRED LINK author: default::User;
      CREATE ACCESS POLICY author_full_access
          ALLOW ALL USING ((.author ?= GLOBAL default::current_user));
      CREATE ACCESS POLICY others_read_only
          ALLOW SELECT ;
      CREATE REQUIRED PROPERTY content: std::str;
  };
};
