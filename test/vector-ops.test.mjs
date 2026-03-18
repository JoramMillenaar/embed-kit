import test from 'node:test';
import assert from 'node:assert/strict';
import { DefaultVectorOps } from '../dist/adapters/vector/default-vector-ops.js';

test('DefaultVectorOps supports core vector math operations', () => {
  const ops = new DefaultVectorOps();

  assert.equal(ops.dot([1, 2], [3, 4]), 11);
  assert.equal(ops.norm([3, 4]), 5);
  assert.deepEqual(ops.normalize([0, 5]), [0, 1]);
  assert.equal(ops.cosineSimilarity([1, 0], [1, 0]), 1);
  assert.equal(ops.euclideanDistance([0, 0], [3, 4]), 5);
  assert.deepEqual(ops.add([1, 2], [3, 4]), [4, 6]);
  assert.deepEqual(ops.subtract([5, 5], [2, 3]), [3, 2]);
  assert.deepEqual(ops.scale([1, 2], 3), [3, 6]);
  assert.deepEqual(ops.centroid([[1, 1], [3, 3]]), [2, 2]);
  assert.deepEqual(ops.lerp([0, 0], [10, 10], 0.25), [2.5, 2.5]);
  assert.deepEqual(ops.project([3, 4], [1, 0]), { vector: [3, 0], magnitude: 3 });
});
