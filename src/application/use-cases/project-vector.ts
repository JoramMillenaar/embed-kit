import type { ProjectionResult, Vector } from '../../domain/types.js';
import type { VectorOps } from '../../ports/interfaces.js';

export class ProjectVector {
  constructor(private readonly vectorOps: VectorOps) {}

  execute(vector: Vector, onto: Vector): ProjectionResult {
    return this.vectorOps.project(vector, onto);
  }
}
