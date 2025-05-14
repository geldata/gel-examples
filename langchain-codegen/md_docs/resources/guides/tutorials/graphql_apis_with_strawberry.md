# Strawberry

Gel allows you to query your database with GraphQL via the built-in GraphQL extension. It enables you to expose GraphQL-driven CRUD APIs for all object types, their properties, links, and aliases. This opens up the scope for creating backend-less applications where the users will directly communicate with the database. You can learn more about that in the GraphQL section of the docs.

However, as of now, Gel is not ready to be used as a standalone backend. You shouldn’t expose your Gel instance directly to the application’s frontend; this is insecure and will give all users full read/write access to your database. So, in this tutorial, we’ll see how you can quickly create a simple GraphQL API without using the built-in extension, which will give the users restricted access to the database schema. Also, we’ll implement HTTP basic authentication and demonstrate how you can write your own GraphQL validators and resolvers. This tutorial assumes you’re already familiar with GraphQL terms like schema, query, mutation, resolver, validator, etc, and have used GraphQL with some other technology before.

We’ll build the same movie organization system that we used in the Flask tutorial and expose the objects and relationships as a GraphQL API. Using the GraphQL interface, you’ll be able to fetch, create, update, and delete movie and actor objects in the database. Strawberry is a Python library that takes a code-first approach where you’ll write your object schema as Python classes. This allows us to focus more on how you can integrate Gel into your workflow and less on the idiosyncrasies of GraphQL itself. We’ll also use the Gel client to communicate with the database, FastAPI to build the authentication layer, and Uvicorn as the webserver.

## Prerequisites

Before we start, make sure you have installed the gel command-line tool. Here, we’ll use Python 3.10 and a few of its latest features while building the APIs. A working version of this tutorial can be found on Github.

## Schema design

The movie organization system will have two object types—movies and actors. Each movie can have links to multiple actors. The goal is to create a GraphQL API suite that’ll allow us to fetch, create, update, and delete the objects while maintaining their relationships.

Gel allows us to declaratively define the structure of the objects. The schema lives inside .gel file in the dbschema directory. It’s common to declare the entire schema in a single file dbschema/default.gel. This is how our datatypes look:

```sdl
# dbschema/default.gel

module default {
  abstract type Auditable {
    property created_at -> datetime {
      readonly := true;
      default := datetime_current();
    }
  }

  type Actor extending Auditable {
    required property name -> str {
      constraint max_len_value(50);
    }
    property age -> int16 {
      constraint min_value(0);
      constraint max_value(100);
    }
    property height -> int16 {
      constraint min_value(0);
      constraint max_value(300);
    }
  }

  type Movie extending Auditable {
    required property name -> str {
      constraint max_len_value(50);
    }
    property year -> int16{
      constraint min_value(1850);
    };
    multi link actors -> Actor;
  }
}
```

Here, we’ve defined an abstract type called Auditable to take advantage of Gel’s schema mixin system. This allows us to add a created_at property to multiple types without repeating ourselves.

The Actor type extends Auditable and inherits the created_at property as a result. This property is auto-filled via the datetime_current function. Along with the inherited type, the actor type also defines a few additional properties like called name, age, and height. The constraints on the properties make sure that actor names can’t be longer than 50 characters, age must be between 0 to 100 years, and finally, height must be between 0 to 300 centimeters.

We also define a Movie type that extends the Auditable abstract type. It also contains some additional concrete properties and links: name, year, and an optional multi-link called actors which refers to the Actor objects.

## Build the GraphQL API

The API endpoints are defined in the app directory. The directory structure looks as follows:

```default
app
├── __init__.py
├── main.py
└── schemas.py
```

The schemas.py module contains the code that defines the GraphQL schema and builds the queries and mutations for Actor and Movie objects. The main.py module then registers the GraphQL schema, adds the authentication layer, and exposes the API to the webserver.

## Conclusion

In this tutorial, you’ve seen how can use Strawberry and Gel together to quickly build a fully-featured GraphQL API. Also, you have seen how FastAPI allows you add an authentication layer and serve the API in a secure manner. One thing to keep in mind here is, ideally, you’d only use GraphQL if you’re interfacing with something that already expects a GraphQL API. Otherwise, EdgeQL is always going to be more powerful and expressive than GraphQL’s query syntax.

