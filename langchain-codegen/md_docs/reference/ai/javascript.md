# JavaScript API

@gel/ai is a wrapper around the AI extension in Gel.

### npm

```bash
$ npm install @gel/ai
```

### yarn

```bash
$ yarn add @gel/ai
```

### pnpm

```bash
$ pnpm add @gel/ai
```

### bun

```bash
$ bun add @gel/ai
```

## Overview

The AI package is built on top of the regular Gel client objects.

Example:

```typescript
import { createClient } from "gel";
import { createRAGClient } from "@gel/ai";


const client = createClient();

const gpt4Ai = createRAGClient(client, {
  model: "gpt-4-turbo-preview",
});

const astronomyAi = gpt4Ai.withContext({
  query: "Astronomy"
});

console.log(
  await astronomyAi.queryRag("What color is the sky on Mars?")
);
```

## Factory functions

Type: function
Domain: js
Summary: 
Signature: createRAGClientclient: Clientoptions: Partial<RAGOptions> = {}RAGClient


Creates an instance of RAGClient with the specified client and options.

Fields:
- Arguments: client – A Gel client instance.
options.model (string) – Required. Specifies the AI model to use. This could be a version of GPT or any other model supported by Gel AI.
options.prompt – Optional. Defines the input prompt for the AI model. The prompt can be a simple string, an ID referencing a stored prompt, or a custom prompt structure that includes roles and content for more complex interactions. The default is the built-in system prompt.


## Core classes

Type: class
Domain: js
Summary: 
Signature: class RAGClient


Instances of RAGClient offer methods for client configuration and utilizing RAG.

Fields:
- Ivar client: An instance of Gel client.


