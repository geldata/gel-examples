# Flask

The Gel Python client makes it easy to integrate Gel into your preferred web development stack. In this tutorial, we’ll see how you can quickly start building RESTful APIs with Flask and Gel.

We’ll build a simple movie organization system where you’ll be able to fetch, create, update, and delete movies and movie actors via RESTful API endpoints.

## Prerequisites

Before we start, make sure you’ve installed the gel command-line tool. Here, we’ll use Python 3.10 and a few of its latest features while building the APIs. A working version of this tutorial can be found on Github.

## Schema design

The movie organization system will have two object types—movies and actors. Each movie can have links to multiple actors. The goal is to create API endpoints that’ll allow us to fetch, create, update, and delete the objects while maintaining their relationships.

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

## Build the API endpoints

The API endpoints are defined in the app directory. The directory structure looks as follows:

```default
app
├── __init__.py
├── actors.py
├── main.py
└── movies.py
```

The actors.py and movies.py modules contain the code to build the Actor and Movie APIs respectively. The main.py module then registers all the endpoints and exposes them to the webserver.

## Conclusion

While building REST APIs, the Gel client allows you to leverage Gel with any microframework of your choice. Whether it’s FastAPI, Flask, AIOHTTP, Starlette, or Tornado, the core workflow is quite similar to the one demonstrated above; you’ll query and serialize data with the client and then return the payload for your framework to process.

