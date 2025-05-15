# Basics

EdgeQL is a strongly-typed language, which means that it moves checks and verification of your code to compile time as much as possible instead of performing them at run time. Gel’s view is that a schema should allow you to set types, constraints, expressions, and more so that you can confidently know what sort of behavior to expect from your data. Laying a type-safe foundation means a bit more thinking up front, but saves you all kinds of headaches down the road.

It’s unlikely though that you’ll define your schema perfectly on your first try, or that you’ll build an application that never needs its schema revised. When you do eventually need to make a change, you’ll need to migrate your schema from its current state to a new state.

The basics of creating a project, modifying its schema, and migrating it in Gel are pretty easy:

If you ever feel like outright removing and creating an instance anew during this migration guide, you can use the command gel instance destroy -I <instancename> --force. And if you want to remove all existing migrations as well, you can manually delete them inside your /migrations folder (otherwise, the CLI will try to apply the migrations again when you recreate your instance with gel migration create). Once that is done, you will have a blank slate on which to start over again.

But many Gel users have needs that go beyond these basics. In addition, schema migrations are pretty interesting and teach you a lot about what Gel does behind the scenes. This guide will turn you from a casual migration user into one with a lot more tools at hand, along with a deeper understanding of the internals of Gel at the same time.

Gel’s built-in tools are what make schema migrations easy, and the way they work is through a pretty interesting interaction between Gel’s SDL (Schema Definition Language) and DDL (Data Definition Language). The first thing to understand about migrations is the difference between SDL and DDL, and how they are used.

## SDL: For humans

SDL, not DDL, is the primary way for you to create and migrate your schema in Gel. You don’t need to work with DDL to use Gel any more than you need to know how to change a tire to drive a car.

SDL is built for humans to read, which is why it is said to be declarative. The ‘clar’ inside declarative is the same word as clear, and this is exactly what declarative means: making it clear what you want the final result to be. An example of a declarative instruction in real life would be telling a friend to show up at your house at 6416 Riverside Way. You’ve declared what the final result should be, but it’s up to your friend to find how to achieve it.

Now let’s look at some real SDL and think about its role in Gel. Here is a simple example of a schema:

```sdl
module default {
  type User {
    name: str;
  }
}
```

If you have Gel installed and want to follow along, run :gelcmd:` project init` and copy the above schema into your default.gel file inside the /dbschema folder it creates. Then save the file.

While schema is usually contained inside the default.gel file, you can divide a schema over multiple files if you like. Gel will combine all .gel files inside the /dbschema folder into a single schema.

Type gel to start the Gel REPL, and, into the REPL,  type describe schema as sdl. The output will be {'module default{};'} — nothing more than the empty default module. What happened? Our type User is nowhere to be found.

This is the first thing to know about SDL. Like an address to a person’s house, it doesn’t do anything on its own. With SDL you are declaring what you want the final result to be: a schema containing a single type called User, with a property of type str called name.

In order for a migration to happen, the Gel server needs to receive DDL statements telling it what changes to make, in the exact same way that you give instructions like “turn right at the next intersection” to your friend who is trying to find your house. In Gel’s case, these commands will start with words like create and drop and alter to tell it what changes to make. Gel accomplishes these changes by knowing how to turn your declarative SDL into a schema migration file that contains the DDL statements to accomplish the necessary changes.

## DDL: For computers (mostly)

To see what a schema migration file looks like, type gel migration create. Now look inside your /dbschema/migrations folder. You should see a file called 00001.edgeql with the following, our first view into what DDL looks like.

```default
CREATE TYPE default::User {
    CREATE PROPERTY name: std::str;
};
```

The declarative schema has now been turned into imperative DDL (imperative meaning “giving orders”), specifically commands telling the database how to get from the current state to the desired state. Note that, in contrast to SDL, this code says nothing about the current schema or its final state. This command would work with the schema of any database at all that doesn’t already have a type called User.

Let’s try one more small migration, in which we decide that we don’t want the name property anymore. Once again, we are declaring the final state: a User type with nothing inside. Update your default.gel to look like this:

```sdl
module default {
  type User;
}
```

As before, typing gel migration create will create a DDL statement to change the schema from the current state to the one we have declared. This time we aren’t starting from a blank schema, so the stakes are a bit higher. After all, dropping a property from a type will also drop all existing data under that property name. Thus, the schema planner will first ask a question to confirm the change with us. We will learn a lot more about working with these questions very soon, but in the meantime just press y to confirm the change.

```default
db> did you drop property 'name' of object type 'default::User'?
[y,n,l,c,b,s,q,?]
> y
```

Your /dbschema/migrations folder will now have a new file that contains the following:

```default
ALTER TYPE default::User {
    DROP PROPERTY name;
};
```

The difference between SDL and DDL is even clearer this time. The DDL statement alone doesn’t give us any indication what the schema looks like; all anyone could know from this migration script alone is that there is a User type inside a module called default that doesn’t have a property called name anymore.

Gel commands inside the REPL use a backslash instead of the gel command, so you can migrate your schema inside the REPL by typing \migration create , followed by \migrate. Not only are the comands shorter, but they also execute faster. This is because the database client is already connected to your database when you’re inside the REPL, which is not the case when creating and applying the migration via the CLI.

## Questions from the CLI

So far we’ve only learned how to say “yes” or “no” to the CLI’s questions when we migrate a schema, but quite a few other options are presented when the CLI asks us a question:

```default
did you create object type 'default::PlayerCharacter'? [y,n,l,c,b,s,q,?]
> y
```

The choices y and n are obviously “yes” and “no,” and you can probably guess that ? will output help for the available response options, but the others aren’t so clear. Let’s go over every option to make sure we understand them.

## Data migrations and migration hashes

Sometimes you may want to initialize a database with some default data, or add some data to a migration that you have just created before you apply it.

Gel assumes by default that a migration involves a change to your schema, so it won’t create a migration for you if it doesn’t see a schema change:

```bash
$ gel migration create
No schema changes detected.
```

So how do you create a migration with only data? To do this, just add --allow-empty to the command:

```bash
$ gel migration create --allow-empty
Created myproject/dbschema/migrations/00002.edgeql,
id: m1xseswmheqzxutr55cu66ko4oracannpddujg7gkna2zsjpqm2g3a
```

You will now see an empty migration in dbschema/migrations in which you can enter some queries. It will look something like this:

```default
CREATE MIGRATION m1xseswmheqzxutr55cu66ko4oracannpddujg7gkna2zsjpqm2g3a
    ONTO m1n5lfw7n74626cverbjwdhcafnhmbezjhwec2rbt46gh3ztoo7mqa
{
};
```

Let’s see what happens if we add some queries inside the braces. Assuming a schema with a simple User type, we could then add a bunch of queries such as the following:

```default
CREATE MIGRATION m1xseswmheqzxutr55cu66ko4oracannpddujg7gkna2zsjpqm2g3a
    ONTO m1n5lfw7n74626cverbjwdhcafnhmbezjhwec2rbt46gh3ztoo7mqa
{
    insert User { name := 'User 1'};
    insert User { name := 'User 2'};
    delete User filter .name = 'User 2';
};
```

The problem is, if you save that migration and run gel migrate, the CLI will complain that the migration hash doesn’t match what it is supposed to be. However, it helpfully provides the reason: “Migration names are computed from the hash of the migration contents.”

Fortunately, it also tells you exactly what the hash (the migration name) will need to be:

```default
Error executing command: could not read migrations in
myproject/dbschema/migrations:

could not read migration file myproject/dbschema/migrations/00002.edgeql:

Migration name should be:
m13g7j2tqu23yaffv6wkn2adp6hayp76su2qtg2lutdh3mmj5xyk6q, but
m1xseswmheqzxutr55cu66ko4oracannpddujg7gkna2zsjpqm2g3a found instead.


Migration names are computed from the hash of the migration contents.

To proceed you must fix the statement to read as:
CREATE MIGRATION m13g7j2tqu23yaffv6wkn2adp6hayp76su2qtg2lutdh3mmj5xyk6q
ONTO ...
Alternatively, revert the changes to the file.
```

If you change the statement to read in exactly the way the output suggests, the migration will now work.

That’s the manual way to do a data migration, but Gel also has an gel migration edit command that will automate the process for you. Using gel migration edit will open up the most recent migration for you to change, and update the migration hash when you close the window.

Aside from exclusive data migrations, you can also create a migration that combines schema changes and data. This is even easier, since it doesn’t even require appending --allow-empty to the command. Just do the following:

The Gel tutorial is a good example of a database set up with both a schema migration and a data migration. Setting up a database with schema changes in one file and default data in a second file is a nice way to separate the two operations and maintain high readability at the same time.

## Squashing migrations

Users often end up making many changes to their schema because of how effortless it is to do. (And in the next section we will learn about gel watch --migrate, which is even more effortless!) This leads to an interesting side effect: lots of .edgeql files, many of which represent trials and approaches that don’t end up making it to the final schema.

Once you are done, you might want to squash the migrations into a single file. This is especially nice if you need to frequently initialize database instances using the same schema, because all migrations are applied when an instance starts up. You can imagine that the output would be pretty long if you had dozens and dozens of migration files to work through:

```default
Initializing Gel instance...
Applying migrations...
Applied m13brvdizqpva6icpcvmsc3fee2yt5j267uba6jugy6iugcbs2djkq
(00001.edgeql)
Applied m1aildofb3gvhv3jaa5vjlre4pe26locxevqok4semmlgqwu3xayaa
(00002.edgeql)
Applied m1ixxlsdgrlinfijnrbmxdicmpfav33snidudqi7fu4yfhg4nngoza
(00003.edgeql)
Applied m1tsi4amrdbcfjypu72duyckrlvvyb46r3wybd7qnbmem4rjvnbcla
(00004.edgeql)
...and so on...
Project initialized.
```

To squash your migrations, just run gel migration create with the --squash option. Running this command will first display some helpful info to keep in mind before committing to the operation:

```default
Current database revision is:
m16ixoukn7ulqdn7tp6lvx2754hviopanufv2lm6wf4x2borgc3g6a
While squashing migrations is non-destructive,
it may lead to manual work if done incorrectly.

Items to check before using --squash:
1. Ensure that `./dbschema` dir is comitted
2. Ensure that other users of the database have the revision
above or can create database from scratch.
    To check a specific instance, run:
    gel -I <name> migration log --from-db --newest-first --limit 1
1. Merge version control branches that contain schema changes
if possible.

Proceed? [y/n]
```

Press y to squash all of your existing migrations into a single file.

## Gel Watch

Another option when quickly iterating over schema changes is gel watch --migrate. This will create a long-running process that keeps track of every time you save a .gel file inside your /migrations folder, letting you know if your changes have successfully compiled or not. The gel watch --migrate command itself will show the following input when the process starts up:

```default
Connecting to Gel instance 'anything' at localhost:10700...
Hint: --migrate will apply any changes from your schema files to the database.
When ready to commit your changes, use:
1) `gel migration create` to write those changes to a migration file,
2) `gel migrate --dev-mode` to replace all synced changes with the migration.

Monitoring /home/instancename for changes in:

  --migrate: gel migration apply --dev-mode
```

Unseen to the user, gel watch --migrate will begin creating individual migration scripts for every time you save a change to one of your files. These are stored as separate “dev mode” migrations, which are sort of like preliminary migrations that haven’t been turned into a standalone migration script yet.

We can test this out by starting with this schema:

```sdl
module default {
  type User {
    name: str;
  }
}
```

Now let’s add a single property. Keep an eye on your terminal output and hit after making a change to the following schema:

```sdl
module default {
  type User {
    name: str;
    number: int32;
  }
}
```

You will see a quick “calculating diff” show up as gel watch --migrate checks to see that the change we made was a valid one. As the change we made was to a valid schema, the “calculating diff” message will disappear pretty quickly.

However, if the schema file you save is incorrect, the output will be a lot more verbose. Let’s add some incorrect syntax to the existing schema:

```sdl
module default {
  type User {
    name: str;
    number: int32;
    wrong_property: i32; # Should say int32, not i32
  }
}
```

Once you hit save, gel watch --migrate will suddenly pipe up and inform you that the schema can’t be resolved:

```default
error: type 'default::i32' does not exist
┌─ myproject/dbschema/default.gel:5:25
│
5 │         wrong_property: i32;
│                         ^^^ error

Schema migration error:
cannot proceed until schema files are fixed
```

Once you correct the i32 type to int32, you will see a message letting you know that things are okay now.

```default
Schema is up to date.
```

The process will once again quieten down, but will continue to watch your schema and apply migrations to any changes you make to your schema.

gel watch --migrate is best run in a separate instance of your command line so that you can take care of other tasks — including officially migrating when you are satisfied with your current schema — without having to stop the process.

If you are curious what is happening as gel watch --migrate does its thing, try the following query after you have made some changes. It will return a few lists of applied migrations, grouped by the way they were generated.

```default
group schema::Migration {
    name,
    script
} by .generated_by;
```

Some migrations will contain nothing in their generated_by property, while those generated by gel watch --migrate will have a MigrationGeneratedBy.DevMode.

The final option (aside from DevMode and the empty set) for generated_by is MigrationGeneratedBy.DDLStatement, which will show up if you directly change your schema by using DDL, which is generally not recommended.

Once you are satisfied with your changes while running gel watch --migrate, just create the migration with gel migration create to record the current changes to the file system.

## Branches

Gel’s branches can be a useful part of your schema migrations, especially when you’re developing new features or prototyping experimental features. By creating a new branch, you can isolate schema changes from your other branches.

Imagine a scenario in which your main branch is main and your feature branch is called feature. This is the ideal workflow for using a Gel branch alongside a feature branch in your VCS to develop a new feature:

The workflow is outlined in detail in the branches guide in our “Get started” section.

## So, you really want to use DDL?

You might have a good reason to use a direct DDL statement or two to change your schema. How do you make that happen? Gel disables the usage of DDL by default if you have already carried out a migration through the recommended migration commands, so this attempt to use DDL will not work:

```edgeql-repl
db> create type MyType;
error: QueryError: bare DDL statements are not
allowed on this database branch
┌─ <query>:1:1
│
1 │ create type MyType;
│ ^^^^^^^^^^^^^^^^^^ Use the migration commands instead.
│
= The `allow_bare_ddl` configuration variable is set to
'NeverAllow'.  The `gel migrate` command normally sets
this to avoid accidental schema changes outside of the
migration flow.
```

This configuration can be overridden by the following command which changes the enum allow_bare_ddl from the default NeverAllow to the other option, AlwaysAllow.

```edgeql-repl
db> configure current branch set allow_bare_ddl := 'AlwaysAllow';
```

Note that the command is configure current branch and not configure instance, as allow_bare_ddl is evaluated on the branch level.

That wasn’t so bad, so why did the CLI tell us to try to “avoid accidental schema changes outside of the migration flow?” Why is DDL disabled after running a migration in the first place?

## So, you really wanted to use DDL but now regret it?

Let’s start out with a very simple schema to see what happens after DDL is used to directly modify a schema.

```sdl
module default {
  type User {
      name: str;
  }
}
```

Next, we’ll set the current branch to allow bare DDL:

```edgeql-repl
db> configure current branch set allow_bare_ddl := 'AlwaysAllow';
```

And then create a type called SomeType without any properties:

```edgeql-repl
db> create type SomeType;
OK: CREATE TYPE
```

Your schema now contains this type, as you can see by typing describe schema or describe schema as sdl:

```default
{
'module default {
    type SomeType;
    type User {
        property name: std::str;
    };
};',
}
```

Great! This type is now inside your schema and you can do whatever you like with it.

But this has also ruined the migration flow. Watch what happens when you try to apply the change:

```edgeql-repl
db> \migration create
Error executing command: Database must be updated to
the last migration on the filesystem for
`migration create`. Run:
gel migrate

db> \migrate
Error executing command: database applied migration
history is ahead of migration history in
"myproject/dbschema/migrations" by 1 revision
```

Sneakily adding SomeType into your schema to match won’t work either. The problem is that there is a migration already present, it just doesn’t exist inside your /migrations folder. You can see it with the following query:

```edgeql-repl
db> select schema::Migration {*}
...  filter
...  .generated_by = schema::MigrationGeneratedBy.DDLStatement;
{
schema::Migration {
    id: 3882894a-8bb7-11ee-b009-ad814ec6a5f5,
    name: 'm1s6oniru3zqepiaxeljt7vcgyynxuwh4ki3zdfr4hfavjozsndfua',
    internal: false,
    builtin: false,
    computed_fields: [],
    script: 'SET generated_by :=
        (schema::MigrationGeneratedBy.DDLStatement);
CREATE TYPE SomeType;',
    message: {},
    generated_by: DDLStatement,
},
}
```

Fortunately, the fix is not too hard: we can use the command gel migration extract. This command will retrieve the migration(s) created using DDL and assign each of them a proper file name and hash inside the /dbschema/migrations folder, effectively giving them a proper position inside the migration flow.

Note that at this point your .gel schema will still not match the database schema, so if you were to type gel migration create the CLI would then ask you if you want to drop the type that you just created - because it doesn’t exist inside there. So be sure to change your schema to match the schema inside the database that you have manually changed via DDL. If in doubt, use describe schema as sdl to compare or use gel migration create and check the output. If the CLI is asking you if you want to drop a type, that means that you forgot to add it to the schema inside your .gel file(s).

## Multiple migrations to keep data

Sometimes you may want to change your schema in a complex way that doesn’t allow you to keep existing data. For example, what if you decide that you don’t need a multi link anymore but would like to keep some of the information in the currently linked to objects as an array instead? One way to make this happen is by migrating more than once.

Let’s give this a try by starting with with a simple User type that has a friends link to other User objects. (If you’ve been following along all this time, a quick migration to this schema will be a breeze.)

```sdl
module default {
  type User {
      name: str;
      multi friends: User;
  }
}
```

First let’s insert three User objects, followed by an update to make each User friends with all of the others:

```edgeql-repl
db> insert User {
... name := 'User 1'
... };
{default::User {id: d44a19bc-8bc1-11ee-8f28-47d7ec5238fe}}
db> insert User {
... name := 'User 2'
... };
{default::User {id: d5f941c0-8bc1-11ee-8f28-b3f56009a7b0}}
db> insert User {
... name := 'User 3'
... };
{default::User {id: d79cb03e-8bc1-11ee-8f28-43fe3f68004c}}
db> update User set {
...    friends := (select detached User filter User.name != .name)
...  };
```

Now what happens if we now want to change multi friends to an array<str>? If we were simply changing a scalar property to another property it would be easy, because Gel would prompt us for a conversion expression, but a change from a link to a property is different:

```sdl
module default {
  type User {
      name: str;
      multi friends: array<str>;
  }
}
```

Doing a migration as such will just drop the friends link (along with its data) and create a new friends property - without any data at all.

To solve this problem, we can do two migrations instead of one. First we will keep the friends link, while adding a new property called friend_names:

```sdl
module default {
  type User {
    name: str;
    multi friends: User;
    friend_names: array<str>;
  }
}
```

Upon using gel migration create, the CLI will simply ask us if we created a property called friend_names. We haven’t applied the migration yet, so we might as well put the data inside the same migration. A simple update will do the job! As we learned previously, gel migration edit is the easiest way to add data to a migration. Or you can manually add the update, try to apply the migration, and change the migration hash to the output suggested by the CLI.

```default
CREATE MIGRATION m1hvciatdgpo3a74wagbmwhbunxbridda4qvdbrr3z2a34opks63rq
    ONTO m1vktopcva7l6spiinh5e5nnc4dtje4ygw2fhismbmczbyaqbws7jq
{
ALTER TYPE default::User {
    CREATE PROPERTY friend_names: array<std::str>;
};
update User set { friend_names := array_agg(.friends.name) };
};
```

Once the migration is applied, we can do a query to confirm that the data inside .friends.name when converted to an array is indeed the same as the data inside the friend_names property:

```edgeql-repl
db> select User { f:= array_agg(.friends.name), friend_names };
{
default::User {
  f: ['User 2', 'User 3'],
  friend_names: ['User 2', 'User 3']
  },
default::User {
  f: ['User 1', 'User 3'],
  friend_names: ['User 1', 'User 3']
  },
default::User {
  f: ['User 1', 'User 2'],
  friend_names: ['User 1', 'User 2']
  },
}
```

Or we could also use the all() function to confirm that this is the case.

```edgeql-repl
db> select all(array_agg(User.friends.name) = User.friend_names);
{true}
```

Looks good! And now we can simply remove multi friends: User; from our schema and do a final migration.

## Migration internals

We’ve now reached the most optional part of the migrations tutorial, but an interesting one for those curious about what goes on behind the scenes during a migration.

Migrations in Gel before the advent of the gel project flow were still automated but required more manual work if you didn’t want to accept all of the suggestions provided by the server. This process is in fact still used to migrate even today; the CLI just facilitates it by making it easy to respond to the generated suggestions.

Early Gel migrations took place inside a transaction handled by the user that essentially went like this:

```default
db> start migration to { <your schema goes here> };
```

This starts the migration, after which the quickest process was to type populate migration to accept the statements suggested by the server, and then commit migration to finish the process.

Now, there is another option besides simply typing populate migration that allows you to look at and handle the suggestions every step of the way (in the same way the CLI does today), and this is what we are going to have some fun with. You can see the original migrations RFC if you are curious.

It is very finicky compared to the CLI, resulting in a failed transaction if any step along the way is different from the expected behavior, but is an entertaining challenge to try to get right if you want to truly understand how migrations work in Gel.

This process requires looking at the server’s proposed solutions every step of the way, and these steps are best seen in JSON format. We can make this format as readable as possible with the following command:

```edgeql-repl
db> \set output-format json-pretty
```

First, let’s begin with the same same simple schema used in the previous examples, via the regular gel migration create and gel migrate commands.

```sdl
module default {
  type User {
    name: str;
  }
}
```

And, as before, we will make a somewhat ambiguous change by changing name to nam.

```sdl
module default {
  type User {
    nam: str;
  }
}
```

And now it’s time to give the older migration method a try! To move to this schema using the old method, we will need to start a migration by pasting our desired schema into a start migration to {}; block:

```edgeql-repl
db> start migration to {
...   module default {
...     type User {
...       nam: str;
...     }
...   }
... };
```

You should get the output OK: START MIGRATION, followed by a prompt that ends with [tx] to show that we are inside of a transaction. Anything we do here will have no effect on the current registered schema until we finally commit the migration.

So now what do we do? We could simply type populate migration to accept the server’s suggested changes, but let’s instead take a look at them one step at a time. To see the current described change, type describe current migration as json;. This will generate the following output:

```default
{
"parent": "m14opov4ymcbd34x7csurz3mu4u6sik3r7dosz32gist6kpayhdg4q",
"complete": false,
"proposed": {
"prompt": "did you rename property 'name' of object type 'default::User'
    to 'nam'?",
"data_safe": true,
"prompt_id": "RenameProperty PROPERTY default::__|name@default|User
    TO default::__|nam@default|User",
"confidence": 0.67,
"statements": [{"text": "ALTER TYPE default::User {\n    ALTER
    PROPERTY name {\n        RENAME TO nam;\n    };\n};"}],
"required_user_input": []
},
"confirmed": []
}
```

The server is telling us with "complete": false that this suggestion is not the final step in the migration, that it is 67% confident that its suggestion is correct, and that we should probably type the following statement:

```default
ALTER TYPE default::User { ALTER PROPERTY name { RENAME TO nam; };};
```

Don’t forget to remove the newlines (\n) from inside the original suggestion; the transaction will fail if you don’t take them out. If the migration fails at any step, you will see [tx] change to [tx:failed] and you will have to type abort migration to leave the transaction and begin the migration again.

Technically, at this point you are permitted to write any DDL statement you like and the migration tool will adapt its suggestions to reach the desired schema. Doing so though is bad practice and is more than likely to generate an error when you try to commit the migration. (Even so, give it a try if you’re curious.)

Let’s dutifully type the suggested statement above, and then use describe current migration as json again to see what the current status of the migration is. This time we see two major differences: “complete” is now true, meaning that we are at the end of the proposed migration, and “proposed” does not contain anything. We can also see our confirmed statement inside “confirmed” at the bottom.

```default
{
"parent": "m1fgpuxbvd74m6pb72rdikakjv3fv7cftrez7r56qjgonboimp5zoa",
"complete": true,
"proposed": null,
"confirmed": ["ALTER TYPE default::User {\n ALTER PROPERTY name
{\n RENAME TO nam;\n };\n};"]
}
```

With this done, you can commit the migration and the migration will be complete.

```edgeql-repl
db[tx]> commit migration;
OK: COMMIT MIGRATION
```

Since this migration was created using direct DDL statements, you will need to use gel migration extract to extract the latest migration and give it a proper .edgeql file in the same way we did above in the “So you really wanted to use DDL but now regret it?” section.

