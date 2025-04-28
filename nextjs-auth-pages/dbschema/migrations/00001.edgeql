CREATE MIGRATION m1noekpcc34xfbcdmzrcr3va73kmxrrw5iarw6yryy3dok6ifkzqaa
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY name: std::str;
  };
  CREATE GLOBAL default::currentUser := (SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  );
  CREATE TYPE default::Todo {
      CREATE REQUIRED LINK owner: default::User {
          SET default := (GLOBAL default::currentUser);
      };
      CREATE ACCESS POLICY ownerHasAccess
          ALLOW ALL USING ((GLOBAL default::currentUser ?= .owner));
      CREATE REQUIRED PROPERTY completed: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY created_on: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
