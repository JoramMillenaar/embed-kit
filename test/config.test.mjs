import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveConfig } from '../dist/config/defaults.js';

test('resolveConfig applies sensible defaults and allows overrides', () => {
  const config = resolveConfig({
    chunking: { size: 128 },
    search: { topK: 9 },
  });

  assert.equal(config.chunking.strategy, 'fixed');
  assert.equal(config.chunking.size, 128);
  assert.equal(config.chunking.overlap, 50);
  assert.equal(config.search.metric, 'cosine');
  assert.equal(config.search.topK, 9);
  assert.equal(config.embeddings.provider, 'mock');
});
