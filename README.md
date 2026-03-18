# EmbedKit

**EmbedKit is a configurable toolkit for using embeddings well.**

It abstracts the messy parts of embedding workflows — chunking, overlap, normalization, vector search, projections, and indexing — while still exposing the underlying pieces for deeper control.

EmbedKit is **not**:
- a full RAG framework
- an LLM orchestration platform
- a toy utility library

Instead, it is a layered toolkit/workbench for real embedding workflows.

## Why EmbedKit?

Embedding workflows usually look simple at first and then get messy fast:
- text has to be chunked sensibly
- chunk overlap affects retrieval quality
- vectors may need normalization
- similarity metrics change ranking behavior
- document metadata needs to survive indexing/search
- developers often need both a simple API and lower-level control

EmbedKit gives you:
- an easy top-level `EmbedKit` facade
- composable lower-level components
- explicit ports for chunkers, embedders, indexes, and vector math
- browser-first defaults with no Node-only assumptions in the core design

## Architecture

EmbedKit uses a **hexagonal architecture** with a **union-style composition model**.

### Layers

- **Domain**: pure types such as `Chunk`, `EmbeddedChunk`, `SearchResult`, `Vector`, and search metrics
- **Ports**: explicit interfaces for chunking, embeddings, vector math, indexing, preprocessing, pipelines, and search policy
- **Application**: use-cases that orchestrate behavior without infrastructure coupling
- **Adapters**: concrete implementations such as `FixedChunker`, `MockEmbedder`, `InMemoryVectorIndex`, `DefaultVectorOps`, and `DefaultEmbeddingPipeline`
- **API**: `EmbedKit` facade plus direct exports for advanced use

### Design principles

- keep domain logic pure
- favor explicit interfaces and dependency injection
- make easy things easy and hard things possible
- avoid giant god services
- keep extension points visible instead of hidden in helpers

## Installation

```bash
npm install embedkit
```

## Quick start

### Layer 1: simple API

```ts
import { EmbedKit } from 'embedkit';

const kit = await EmbedKit.create();
await kit.indexDocument('doc-1', text);
const results = await kit.search('italian coffee', { topK: 5 });
```

### Layer 2: configurable API

```ts
import { EmbedKit } from 'embedkit';

const kit = await EmbedKit.create({
  chunking: {
    strategy: 'fixed',
    size: 400,
    overlap: 50,
  },
  embeddings: {
    provider: 'transformers-js',
    model: 'Xenova/all-MiniLM-L6-v2',
    normalize: true,
  },
  index: {
    provider: 'memory',
  },
  search: {
    metric: 'cosine',
    topK: 10,
  },
});
```

### Layer 3: full control API

```ts
import {
  DefaultEmbeddingPipeline,
  DefaultSearchPolicy,
  DefaultVectorOps,
  EmbedKit,
  FixedChunker,
  InMemoryVectorIndex,
  MockEmbedder,
} from 'embedkit';

const vectorOps = new DefaultVectorOps();

const pipeline = new DefaultEmbeddingPipeline({
  chunker: new FixedChunker({ size: 400, overlap: 50 }),
  embedder: new MockEmbedder({ vectorOps, normalize: true }),
  vectorIndex: new InMemoryVectorIndex(vectorOps),
  searchPolicy: new DefaultSearchPolicy({ topK: 10, metric: 'cosine' }),
  embedNormalize: true,
});

const kit = new EmbedKit({ pipeline });
```

## Core capabilities

### Chunking

Current support:
- fixed chunking
- overlap handling
- chunk metadata with offsets and chunk index
- a clean `TextChunker` port for future sentence/semantic chunkers

### Embeddings

Current support:
- embed one text or many texts
- normalization as a configurable behavior
- batching in the embedder interface
- a simple `MockEmbedder` for tests/examples
- an optional browser adapter shape via `BrowserEmbedder`

### Vector math

Built-in vector utilities include:
- dot product
- norm
- normalize
- cosine similarity
- euclidean distance
- add / subtract / scale
- centroid
- interpolation (`lerp`)
- projection onto another vector

### Index/search

Current support:
- add vectors
- remove vectors
- clear index
- nearest-neighbor search with `cosine`, `dot`, and `euclidean`
- result metadata passthrough

## Public API highlights

### Top-level facade

- `EmbedKit.create(config)`
- `kit.indexDocument(id, text, metadata?)`
- `kit.search(query, options?)`
- `kit.embed(text)`
- `kit.clear()`

### Low-level exports

- adapters: `FixedChunker`, `MockEmbedder`, `BrowserEmbedder`, `InMemoryVectorIndex`, `DefaultVectorOps`, `DefaultEmbeddingPipeline`
- use-cases: `IndexDocument`, `SearchDocuments`, `EmbedText`, `ChunkText`, `CompareTexts`, `ProjectVector`, `GetNearestNeighbors`
- ports: `TextChunker`, `Embedder`, `VectorIndex`, `VectorOps`, `DocumentPreprocessor`, `EmbeddingPipeline`, `SearchPolicy`

## Config model

```ts
type EmbedKitConfig = {
  chunking?: {
    strategy?: 'fixed';
    size?: number;
    overlap?: number;
  };
  embeddings?: {
    provider?: string;
    model?: string;
    normalize?: boolean;
    batchSize?: number;
  };
  index?: {
    provider?: string;
  };
  search?: {
    metric?: 'cosine' | 'dot' | 'euclidean';
    topK?: number;
  };
};
```

Default behavior is intentionally sensible:
- fixed chunking with size `400` and overlap `50`
- normalized embeddings by default
- in-memory index by default
- cosine search with `topK = 5`

## Extension points

EmbedKit is designed so advanced users can swap parts independently.

### Swap chunking strategies
Implement `TextChunker` and provide it to a custom pipeline.

### Swap embedding backends
Implement `Embedder` for browser APIs, hosted embedding services, or WASM/local inference.

### Swap vector index implementations
Implement `VectorIndex` for memory, IndexedDB, remote vector databases, or approximate NN structures.

### Customize vector math behavior
Implement `VectorOps` if you need domain-specific scoring or alternative numerical behavior.

### Customize preprocessing
Implement `DocumentPreprocessor` to clean, normalize, or annotate documents before chunking.

### Customize retrieval policies
Implement `SearchPolicy` to centralize metric selection, defaults, and retrieval behavior.

## Example: custom preprocessing

```ts
import { DefaultEmbeddingPipeline, DefaultSearchPolicy, EmbedKit, FixedChunker, InMemoryVectorIndex, MockEmbedder } from 'embedkit';

const pipeline = new DefaultEmbeddingPipeline({
  chunker: new FixedChunker({ size: 200, overlap: 40 }),
  embedder: new MockEmbedder(),
  vectorIndex: new InMemoryVectorIndex(),
  searchPolicy: new DefaultSearchPolicy({ topK: 5, metric: 'cosine' }),
  preprocessor: {
    process(document) {
      return {
        ...document,
        text: document.text.replace(/\s+/g, ' ').trim(),
        metadata: {
          ...document.metadata,
          cleaned: true,
        },
      };
    },
  },
});

const kit = new EmbedKit({ pipeline });
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Project structure

```text
src/
  adapters/
    chunking/
    embedding/
    index/
    pipeline/
    vector/
  api/
  application/
    use-cases/
  config/
  domain/
  ports/
  utils/
examples/
  basic.ts
test/
```

## Notes

- The default embedder is a deterministic mock implementation suitable for tests, demos, and architecture validation.
- Real browser inference is intentionally kept behind a port/adaptor boundary instead of hardwired into the core.
- The package is browser-first in design, but its abstractions are portable to Node runtimes.
