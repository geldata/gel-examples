using extension auth;

module default {
  type User {
    required identity: ext::auth::Identity {
      constraint exclusive;
    };
    name: str;
  };

  global currentUser := (
    select User filter .identity = global ext::auth::ClientTokenIdentity
  );

  type Todo {
    required owner: User {
      default := global currentUser;
    };
    required content: str;
    required created_on: datetime {
      default := datetime_current();
    };
    required completed: bool {
      default := false;
    };

    access policy ownerHasAccess
      allow all
      using (global currentUser ?= .owner);
  };
}
