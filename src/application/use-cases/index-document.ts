import type { Chunk, DocumentRecord } from '../../domain/types.js';
import type { EmbeddingPipeline } from '../../ports/interfaces.js';

export class IndexDocument {
  constructor(private readonly pipeline: EmbeddingPipeline) {}

  async execute(document: DocumentRecord): Promise<Chunk[]> {
    return this.pipeline.indexDocument(document);
  }
}
