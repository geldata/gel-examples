# Build a Search Bot with FastAPI

In this tutorial we’re going to walk you through building a chat bot with search capabilities using Gel and FastAPI.

FastAPI is a framework designed to help you build web apps fast. Gel is a data layer designed to help you figure out storage in your application - also fast. By the end of this tutorial, you will have tried out different aspects of using those two together.

We will start by creating an app with FastAPI, adding web search capabilities, and then putting search results through a language model to get a human-friendly answer. After that, we’ll use Gel to implement chat history so that the bot remembers previous interactions with the user. We’ll finish it off with semantic search-based cross-chat memory.

## 1. Initialize the project

## 2. Get started with FastAPI

## 3. Implement web search

Now that we have our web app infrastructure in place, let’s add some substance to it by implementing web search capabilities.

## 4. Connect to the LLM

Now that we’re capable of scraping text from search results, we can forward those results to the LLM to get a nice-looking summary.

## 5. Use Gel to implement chat history

So far we’ve built an application that can take in a query, fetch some Hacker News threads for it, sift through them using an LLM, and generate a nice summary.

However, right now it’s hardly user-friendly since you have to speak in keywords and basically start over every time you want to refine the query. To enable a more organic multi-turn interaction, we need to add chat history and infer the query from the context of the entire conversation.

Now’s a good time to introduce Gel.

This command is going to put some project scaffolding inside our app, spin up a local instace of Gel, and then link the two together. From now on, all Gel-related things that happen inside our project directory are going to be automatically run on the correct database instance, no need to worry about connection incantations.

## 6. Use Gel’s advanced features to create a RAG

At this point we have a decent search bot that can refine a search query over multiple turns of a conversation.

It’s time to add the final touch: we can make the bot remember previous similar interactions with the user using retrieval-augmented generation (RAG).

To achieve this we need to implement similarity search across message history: we’re going to create a vector embedding for every message in the database using a neural network. Every time we generate a Google search query, we’re also going to use it to search for similar messages in user’s message history, and inject the corresponding chat into the prompt. That way the search bot will be able to quickly “remember” similar interactions with the user and use them to understand what they are looking for.

Gel enables us to implement such a system with only minor modifications to the schema.

## Keep going!

This tutorial is over, but this app surely could use way more features!

Basic functionality like deleting messages, a user interface or real web search, sure. But also authentication or access policies – Gel will let you set those up in minutes.

Thanks!

