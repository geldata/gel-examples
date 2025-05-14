# HTTP API

All Gel server HTTP endpoints require authentication, such as HTTP Basic Authentication with Gel username and password.

## Embeddings

POST: https://<gel-host>:<port>/branch/<branch-name>/ai/embeddings

Generates text embeddings using the specified embeddings model.

## RAG

POST: https://<gel-host>:<port>/branch/<branch-name>/ai/rag

Performs retrieval-augmented text generation using the specified model based on the provided text query and the database content selected using similarity search.

