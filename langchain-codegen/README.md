# Gel LangChain Code Generator

An agent that generates Gel queries and schemas from natural language, made using LangChain.

## Highlights 

In order to make sure the agent has what it needs to generate valid Gel code, it's supplied with a documentation RAG (based on `GelVectorStore`) and plugged into the Gel MCP server.


```python
vectorstore = GelVectorStore.from_documents(
    documents=chunks,
    embedding=embeddings,
)
```

Take a look at `rag.py` and `agent.py` to find out the details.

## Setup

1. Install dependencies:
```bash
uv synv
```

2. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```

3. Initialize Gel
```bash
gel project init
gel migration create
gel migrate
```

4. Put the Gel docs the RAG:
```bash
uv run build-rag
```

## Usage

Run the agent with your query:

```bash
uv run agent "Write a minimal example of a schema with a computed backlink"
```

The agent will process your query and generate appropriate Gel database code, using both the vector store for documentation search and the Gel MCP for code generation.
