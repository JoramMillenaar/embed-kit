import type { IndexVectorRecord, SearchMetric, SearchResult, Vector } from '../../domain/types.js';
import type { VectorIndex, VectorOps } from '../../ports/interfaces.js';
import { DefaultVectorOps } from '../vector/default-vector-ops.js';

export class InMemoryVectorIndex implements VectorIndex {
  private readonly store = new Map<string, IndexVectorRecord>();

  constructor(
    private readonly vectorOps: VectorOps = new DefaultVectorOps(),
  ) {}

  async add(items: IndexVectorRecord[]): Promise<void> {
    for (const item of items) {
      this.store.set(item.id, { ...item, metadata: { ...item.metadata } });
    }
  }

  async search(query: Vector, options: { topK?: number; metric?: SearchMetric } = {}): Promise<SearchResult[]> {
    const metric = options.metric ?? 'cosine';
    const topK = options.topK ?? 5;

    return [...this.store.values()]
      .map((item) => ({ item, score: this.score(query, item.vector, metric) }))
      .sort((left, right) => right.score - left.score)
      .slice(0, topK)
      .map(({ item, score }) => ({
        id: item.id,
        chunkId: item.id,
        documentId: item.documentId,
        text: item.text,
        score,
        metric,
        metadata: { ...item.metadata },
      }));
  }

  async remove(ids: string[]): Promise<void> {
    ids.forEach((id) => this.store.delete(id));
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async size(): Promise<number> {
    return this.store.size;
  }

  private score(a: Vector, b: Vector, metric: SearchMetric): number {
    switch (metric) {
      case 'dot':
        return this.vectorOps.dot(a, b);
      case 'euclidean':
        return -this.vectorOps.euclideanDistance(a, b);
      case 'cosine':
      default:
        return this.vectorOps.cosineSimilarity(a, b);
    }
  }
}
