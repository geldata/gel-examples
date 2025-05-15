CREATE MIGRATION m1ruypf7upepkjlstehni3un2qw6o5mf447a7guqpoh6hb6mapopca
    ONTO m16oddmzoqite4zqjntsx7kjgamy7skqdv577dsb2ufdtpdsgvwurq
{
  CREATE TYPE default::Plant {
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY how_to_care: std::str;
      CREATE PROPERTY name: std::str;
  };
};
