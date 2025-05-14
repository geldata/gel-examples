# FastAPI

Because FastAPI encourages and facilitates strong typing, it’s a natural pairing with Gel. Our Python code generation generates not only typed query functions but result types you can use to annotate your endpoint handler functions.

Gel can help you quickly build REST APIs in Python without getting into the rigmarole of using ORM libraries to handle your data effectively. Here, we’ll be using FastAPI to expose the API endpoints and Gel to store the content.

We’ll build a simple event management system where you’ll be able to fetch, create, update, and delete events and event hosts via RESTful API endpoints.

## Prerequisites

Before we start, make sure you’ve installed the gel command line tool. For this tutorial, we’ll use Python 3.10 to take advantage of the asynchronous I/O paradigm to communicate with the database more efficiently. You can use newer versions of Python if you prefer, but you may need to adjust the code accordingly. If you want to skip ahead, the completed source code for this API can be found in our examples repo. If you want to check out an example with Gel Auth, you can find that in the same repo in the fastapi-crud-auth folder.

## Schema design

The event management system will have two entities: events and users. Each event can have an optional link to a user who is that event’s host. The goal is to create API endpoints that’ll allow us to fetch, create, update, and delete the entities while maintaining their relationships.

Gel allows us to declaratively define the structure of the entities. If you’ve worked with SQLAlchemy or Django ORM, you might refer to these declarative schema definitions as models. In Gel we call them “object types”.

The schema lives inside .gel files in the dbschema directory. It’s common to declare the entire schema in a single file dbschema/default.gel. This file is created for you when you run gel project init, but you’ll need to fill it with your schema. This is what our datatypes look like:

*dbschema/default.gel*

```sdl
module default {
  abstract type Auditable {
    required created_at: datetime {
      readonly := true;
      default := datetime_current();
    }
  }

  type User extending Auditable {
    required name: str {
      constraint exclusive;
      constraint max_len_value(50);
    };
  }

  type Event extending Auditable {
    required name: str {
      constraint exclusive;
      constraint max_len_value(50);
    }
    address: str;
    schedule: datetime;
    link host: User;
  }
}
```

Here, we’ve defined an abstract type called Auditable to take advantage of Gel’s schema mixin system. This allows us to add a created_at property to multiple types without repeating ourselves. Abstract types don’t have any concrete footprints in the database, as they don’t hold any actual data. Their only job is to propagate properties, links, and constraints to the types that extend them.

The User type extends Auditable and inherits the created_at property as a result. Since created_at has a default value, it’s auto-filled with the return value of the datetime_current function. Along with the property conveyed to it by the extended type, the User type defines its own concrete required property called name. We impose two constraints on this property: names should be unique (constraint exclusive) and shorter than 50 characters (constraint max_len_value(50)).

We also define an Event type that extends the Auditable abstract type. It contains its own concrete properties and links: address, schedule, and an optional link called host that corresponds to a User.

## Run a migration

With the schema created, it’s time to lock it in. The first step is to create a migration.

```bash
$ gel migration create
```

When this step is successful, you’ll see Created dbschema/migrations/00001.edgeql.

Now run the migration we just created.

```bash
$ gel migrate
```

Once this is done, you’ll see Applied along with the migration’s ID. I like to go one step further in verifying success and see the schema applied to my database. To do that, first fire up the Gel console:

```bash
$ gel
```

In the console, type \ds (for “describe schema”). If everything worked, we should output very close to the schema we added in the default.gel file:

```default
module default {
    abstract type Auditable {
        required property created_at: std::datetime {
            default := (std::datetime_current());
            readonly := true;
        };
    };
    type Event extending default::Auditable {
        link host: default::User;
        property address: std::str;
        required property name: std::str {
            constraint std::exclusive;
            constraint std::max_len_value(50);
        };
        property schedule: std::datetime;
    };
    type User extending default::Auditable {
        required property name: std::str {
            constraint std::exclusive;
            constraint std::max_len_value(50);
        };
    };
};
```

## Build the API endpoints

With the schema established, we’re ready to start building out the app. Let’s start by creating an app directory inside our project:

```bash
$ mkdir app
```

Within this app directory, we’re going to create three modules: events.py and users.py which represent the events and users APIs respectively, and main.py that registers all the endpoints and exposes them to the uvicorn webserver. We also need an __init__.py to mark this directory as a package so we can easily import from it. Go ahead and create that file now in your editor or via the command line like this (from the project root):

```bash
$ touch app/__init__.py
```

We’ll work on the users API first since it’s the simpler of the two.

## Integrating Gel Auth

Gel Auth provides a built-in authentication solution that is deeply integrated with the Gel server. This section outlines how to enable and configure Gel Auth in your application schema, manage authentication providers, and set key configuration parameters.

## Wrapping up

Now you have a fully functioning events API in FastAPI backed by Gel. If you want to see all the source code for the completed project, you’ll find it in our examples repo. We also have a separate example that demonstrates how to integrate Gel Auth with FastAPI in the same repo. Check it out here. If you’re stuck or if you just want to show off what you’ve built, come talk to us on Discord. It’s a great community of helpful folks, all passionate about being part of the next generation of databases.

