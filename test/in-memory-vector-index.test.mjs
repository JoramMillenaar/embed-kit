import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryVectorIndex } from '../dist/adapters/index/in-memory-vector-index.js';

test('InMemoryVectorIndex returns nearest neighbors in ranked order', async () => {
  const index = new InMemoryVectorIndex();
  await index.add([
    { id: 'a', documentId: 'doc-a', text: 'alpha', vector: [1, 0], metadata: { label: 'alpha' } },
    { id: 'b', documentId: 'doc-b', text: 'beta', vector: [0.7, 0.7], metadata: { label: 'beta' } },
    { id: 'c', documentId: 'doc-c', text: 'gamma', vector: [0, 1], metadata: { label: 'gamma' } },
  ]);

  const results = await index.search([1, 0], { topK: 2, metric: 'cosine' });

  assert.deepEqual(results.map((result) => result.id), ['a', 'b']);
  assert.equal(results[0]?.metadata.label, 'alpha');
});
