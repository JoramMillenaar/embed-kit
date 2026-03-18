import type { ProjectionResult, Vector } from '../../domain/types.js';
import type { VectorOps } from '../../ports/interfaces.js';
import { assert } from '../../utils/assert.js';
import { assertNonEmpty, assertSameLength } from '../../utils/vector.js';

export class DefaultVectorOps implements VectorOps {
  dot(a: Vector, b: Vector): number {
    assertSameLength(a, b);
    return a.reduce((sum, value, index) => sum + value * b[index]!, 0);
  }

  norm(vector: Vector): number {
    return Math.sqrt(this.dot(vector, vector));
  }

  normalize(vector: Vector): Vector {
    const magnitude = this.norm(vector);
    if (magnitude === 0) {
      return [...vector];
    }

    return vector.map((value) => value / magnitude);
  }

  cosineSimilarity(a: Vector, b: Vector): number {
    const denominator = this.norm(a) * this.norm(b);
    if (denominator === 0) {
      return 0;
    }

    return this.dot(a, b) / denominator;
  }

  euclideanDistance(a: Vector, b: Vector): number {
    assertSameLength(a, b);
    return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]!) ** 2, 0));
  }

  add(a: Vector, b: Vector): Vector {
    assertSameLength(a, b);
    return a.map((value, index) => value + b[index]!);
  }

  subtract(a: Vector, b: Vector): Vector {
    assertSameLength(a, b);
    return a.map((value, index) => value - b[index]!);
  }

  scale(vector: Vector, factor: number): Vector {
    return vector.map((value) => value * factor);
  }

  centroid(vectors: Vector[]): Vector {
    assertNonEmpty(vectors);
    const dimension = vectors[0]!.length;
    vectors.forEach((vector) => assert(vector.length === dimension, 'All vectors must share dimensionality.'));
    const sums = new Array<number>(dimension).fill(0);

    for (const vector of vectors) {
      vector.forEach((value, index) => {
        sums[index]! += value;
      });
    }

    return sums.map((value) => value / vectors.length);
  }

  lerp(a: Vector, b: Vector, t: number): Vector {
    assertSameLength(a, b);
    return a.map((value, index) => value + (b[index]! - value) * t);
  }

  project(vector: Vector, onto: Vector): ProjectionResult {
    assertSameLength(vector, onto);
    const ontoDot = this.dot(onto, onto);
    if (ontoDot === 0) {
      return { vector: new Array<number>(vector.length).fill(0), magnitude: 0 };
    }

    const scalar = this.dot(vector, onto) / ontoDot;
    const projected = this.scale(onto, scalar);
    return { vector: projected, magnitude: this.norm(projected) };
  }
}

export const defaultVectorOps = new DefaultVectorOps();
