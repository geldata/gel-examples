# LlamaIndex Gel Helper

An agent that acts like a natural language interface to a Gel database, powered by LlamaIndex. 

## Highlights 

Converts plain English queries into EdgeQL and executes them against your Gel database.

```bash
uv run agent "What kind of plants have we got in there?"
```

The agent is supplied with a tool that does vector search across Gel documentation.
Check out `rag.py` to see the Gel vectostore integration in action.

```python
vector_store = GelVectorStore()

storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
```

## Setup

1. Install dependencies:

```bash
uv sync
```

2. Set up environment variables (.env):

```
OPENAI_API_KEY=your_openai_key
```

3. Initialize the Gel database:

```bash
gel project init 
gel migration create
gel migrate 
```

4. Load example data:

```bash
gel query -f example_inserts.edgeql
```

5. Build the RAG index for Gel documentation:

```bash
uv run build-rag
```

## Usage

Run queries directly from the command line:

```bash
uv run agent "What kinds of plants do we have in the database?"
uv run agent "Add a Calathea plant that needs indirect light and high humidity"
```
