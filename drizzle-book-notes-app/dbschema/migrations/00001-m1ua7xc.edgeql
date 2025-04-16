CREATE MIGRATION m1ua7xcsbgs6io3olw7jplo5tnxqyk6eqzkgjegu7yqp2pjewqcd6q
    ONTO initial
{
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::Book {
      CREATE PROPERTY author: std::str;
      CREATE PROPERTY genre: std::str;
      CREATE PROPERTY read_date: std::datetime;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE PROPERTY year: std::int16;
  };
  CREATE TYPE default::Note {
      CREATE REQUIRED LINK book: default::Book;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY text: std::str;
  };
  ALTER TYPE default::Book {
      CREATE MULTI LINK notes := (.<book[IS default::Note]);
  };
};
