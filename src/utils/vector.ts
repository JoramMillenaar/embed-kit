import type { Vector } from '../domain/types.js';
import { assert } from './assert.js';

export function assertSameLength(a: Vector, b: Vector): void {
  assert(a.length === b.length, 'Vectors must have the same dimensionality.');
}

export function assertNonEmpty(vectors: Vector[]): void {
  assert(vectors.length > 0, 'At least one vector is required.');
}
