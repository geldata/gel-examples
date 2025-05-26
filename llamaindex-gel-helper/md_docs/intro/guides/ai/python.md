# Gel AI in Python

Gel AI brings vector search capabilities and retrieval-augmented generation directly into the database. It’s integrated into the Gel Python binding via the gel.ai module.

```bash
$ pip install 'gel[ai]'
```

## Enable and configure the extension

Now our Gel application can take advantage of OpenAI’s API to implement AI capabilities.

Gel AI comes with its own UI that can be used to configure providers, set up prompts and test them in a sandbox.

Most API providers require you to set up and account and charge money for model use.

## Add vectors

That’s it! Gel will make necessary API requests in the background and create an index that will enable us to perform efficient similarity search.

## Perform similarity search in Python

## Use the built-in RAG

One more feature Gel AI offers is built-in retrieval-augmented generation, also known as RAG.

## Keep going!

You are now sufficiently equipped to use Gel AI in your applications.

If you’d like to build something on your own, make sure to check out the Reference manual for the AI extension in order to learn the details about using different APIs and models, configuring prompts or using the UI. Make sure to take a look at the Python binding reference, too.

And if you would like more guidance for how Gel AI can be fit into an application, take a look at the FastAPI Gel AI Tutorial, where we’re building a search bot using features you learned about above.

