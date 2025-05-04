from __future__ import annotations

import json

import edgedb
import strawberry

client = edgedb.create_async_client()


@strawberry.type
class Actor:
    name: str | None
    age: int | None = None
    height: int | None = None


@strawberry.type
class Movie:
    name: str | None
    year: int | None = None
    actors: list[Actor] | None = None


@strawberry.type
class Query:
    @strawberry.field
    async def get_actors(self, filter_name: str | None = None) -> list[Actor]:
        if filter_name:
            actors_json = await client.query_json(
                """
                select Actor {name, age, height}
                  filter .name=<str>$filter_name
            """,
                filter_name=filter_name,
            )
        else:
            actors_json = await client.query_json(
                """
                select Actor {name, age, height}
            """
            )
        actors = json.loads(actors_json)
        return [
            Actor(name, age, height)
            for (name, age, height) in (d.values() for d in actors)
        ]

    @strawberry.field
    async def get_movies(self, filter_name: str | None = None) -> list[Movie]:
        if filter_name:
            movies_json = await client.query_json(
                """
                select Movie {name, year, actors : {name}}
                  filter .name=<str>$filter_name
            """,
                filter_name=filter_name,
            )
        else:
            movies_json = await client.query_json(
                """
                select Movie {name, year, actors : {name}}
            """
            )

        # Deserialize.
        movies = json.loads(movies_json)
        for idx, movie in enumerate(movies):
            actors = [
                Actor(name) for d in movie.get("actors", []) for name in d.values()
            ]
            movies[idx] = Movie(movie.get("name"), movie.get("year"), actors)
        return movies


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_actor(
        self, name: str, age: int | None = None, height: int | None = None
    ) -> Actor:
        actor_json = await client.query_single_json(
            """
            select (
              insert Actor {
                name := <str>$name,
                age:=<optional int16>$age,
                height:=<optional int16>$height
              }
            ){name, age, height}
        """,
            name=name,
            age=age,
            height=height,
        )

        actor = json.loads(actor_json)
        return Actor(name=actor.get("name"), age=actor.get("age"), height=actor.get("height"))

    @strawberry.mutation
    async def update_actors(
        self,
        filter_name: str,
        name: str | None = None,
        age: int | None = None,
        height: int | None = None,
    ) -> list[Actor]:

        actors_json = await client.query_json(
            """
            with
              filter_name:=<str>$filter_name,
              name:=<optional str>$name,
              age:=<optional int16>$age,
              height:=<optional int16>$height

            select(
              update Actor filter .name=filter_name
              set {
                  name:=name ?? .name, age:=age ?? .age,
                  height:=height ?? .height}
              ){name, age, height};
            """,
            filter_name=filter_name,
            name=name,
            age=age,
            height=height,
        )

        actors = json.loads(actors_json)
        actors: list[Actor] = [
            Actor(name, age, height)
            for (name, age, height) in (d.values() for d in actors)
        ]
        return actors

    @strawberry.mutation
    async def delete_actors(self, filter_name: str) -> list[Actor]:

        actors_json = await client.query_json(
            """
            select (
              delete Actor filter .name=<str>$filter_name
            ){name, age, height};
            """,
            filter_name=filter_name,
        )

        actors = json.loads(actors_json)
        actors: list[Actor] = [
            Actor(name, age, height)
            for (name, age, height) in (d.values() for d in actors)
        ]
        return actors

    @strawberry.mutation
    async def create_movie(
        self,
        name: str,
        year: int | None = None,
        actor_names: list[str] | None = None,
    ) -> Movie:
        movie_json = await client.query_single_json(
            """
            with name:=<str>$name,
              year:=<optional int16>$year,
              actor_names:=<optional array<str>>$actor_names

            select (
              insert Movie {
                name:=name,
                year:=year,
                actors:=(
                    select detached Actor
                    filter .name in array_unpack(actor_names)
                  )
                }
            ){name, year, actors : {name}}
        """,
            name=name,
            year=year,
            actor_names=actor_names,
        )

        movie = json.loads(movie_json)
        actors = [Actor(name) for d in movie.get("actors", []) for name in d.values()]
        return Movie(name=movie.get("name"), year=movie.get("year"), actors=actors)

    @strawberry.mutation
    async def update_movies(
        self,
        filter_name: str,
        name: str | None = None,
        year: int | None = None,
        actor_names: list[str] | None = None,
    ) -> list[Movie]:

        movies_json = await client.query_json(
            """
            with
              filter_name:=<str>$filter_name,
              name:=<optional str>$name,
              year:=<optional int16>$year,
              actor_names:=<optional array<str>>$actor_names

            select (
              update Movie filter .name=filter_name
              set {
                  name:=name ?? .name, year:=year ?? .year,
                  actors:=(
                      select detached Actor
                        filter .name in array_unpack(actor_names)
                    ) ?? .actors
                  }
              ){name, year, actors : {name, age, height}};
            """,
            filter_name=filter_name,
            name=name,
            year=year,
            actor_names=actor_names,
        )

        movies = json.loads(movies_json)

        for idx, movie in enumerate(movies):
            actors = [
                Actor(d.get("name"), d.get("age"), d.get("height"))
                for d in movie.get("actors", [])
            ]
            movies[idx] = Movie(name=movie.get("name"), year=movie.get("year"), actors=actors)
        return movies

    @strawberry.mutation
    async def delete_movies(self, filter_name: str) -> list[Movie]:

        movies_json = await client.query_json(
            """
            select (
              delete Movie filter .name=<str>$filter_name
            ){name, year, actors : {name, age, height}};
            """,
            filter_name=filter_name,
        )

        movies = json.loads(movies_json)

        for idx, movie in enumerate(movies):
            actors = [
                Actor(d.get("name"), d.get("age"), d.get("height"))
                for d in movie.get("actors", [])
            ]
            movies[idx] = Movie(name=movie.get("name"), year=movie.get("year"), actors=actors)
        return movies


schema = strawberry.Schema(query=Query, mutation=Mutation)
