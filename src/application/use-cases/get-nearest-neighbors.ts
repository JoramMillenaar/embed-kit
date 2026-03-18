import type { SearchMetric, SearchResult, Vector } from '../../domain/types.js';
import type { VectorIndex } from '../../ports/interfaces.js';

export class GetNearestNeighbors {
  constructor(private readonly vectorIndex: VectorIndex) {}

  async execute(query: Vector, options?: { topK?: number; metric?: SearchMetric }): Promise<SearchResult[]> {
    return this.vectorIndex.search(query, options);
  }
}
