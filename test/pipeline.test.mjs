import test from 'node:test';
import assert from 'node:assert/strict';
import { FixedChunker } from '../dist/adapters/chunking/fixed-chunker.js';
import { MockEmbedder } from '../dist/adapters/embedding/mock-embedder.js';
import { InMemoryVectorIndex } from '../dist/adapters/index/in-memory-vector-index.js';
import { DefaultEmbeddingPipeline } from '../dist/adapters/pipeline/default-embedding-pipeline.js';
import { DefaultSearchPolicy } from '../dist/adapters/pipeline/default-search-policy.js';

test('DefaultEmbeddingPipeline indexes documents and searches with raw query text', async () => {
  const pipeline = new DefaultEmbeddingPipeline({
    chunker: new FixedChunker({ size: 60, overlap: 10 }),
    embedder: new MockEmbedder({ dimensions: 16 }),
    vectorIndex: new InMemoryVectorIndex(),
    searchPolicy: new DefaultSearchPolicy({ topK: 3, metric: 'cosine' }),
    embedNormalize: true,
    batchSize: 16,
  });

  await pipeline.indexDocument({
    id: 'doc-1',
    text: 'Espresso drinks include cappuccino and latte. Tea is a different beverage.',
    metadata: { category: 'beverages' },
  });

  const results = await pipeline.search('cappuccino coffee', { topK: 1 });

  assert.equal(results.length, 1);
  assert.equal(results[0]?.documentId, 'doc-1');
  assert.equal(results[0]?.metadata.category, 'beverages');
});
