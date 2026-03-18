import test from 'node:test';
import assert from 'node:assert/strict';
import { FixedChunker } from '../dist/adapters/chunking/fixed-chunker.js';

test('FixedChunker creates overlapping chunks with offsets', () => {
  const chunker = new FixedChunker({ size: 5, overlap: 2 });
  const chunks = chunker.chunk({ id: 'doc-1', text: 'abcdefghij' });

  assert.equal(chunks.length, 3);
  assert.deepEqual(chunks.map((chunk) => chunk.text), ['abcde', 'defgh', 'ghij']);
  assert.deepEqual(chunks.map((chunk) => [chunk.startOffset, chunk.endOffset]), [
    [0, 5],
    [3, 8],
    [6, 10],
  ]);
});
