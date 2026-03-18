import type { SearchMetric, SearchResult } from '../../domain/types.js';
import type { EmbeddingPipeline } from '../../ports/interfaces.js';

export class SearchDocuments {
  constructor(private readonly pipeline: EmbeddingPipeline) {}

  async execute(text: string, options?: { topK?: number; metric?: SearchMetric }): Promise<SearchResult[]> {
    return this.pipeline.search(text, options);
  }
}
