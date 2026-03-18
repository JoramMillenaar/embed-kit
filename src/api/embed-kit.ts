import { IndexDocument } from '../application/use-cases/index-document.js';
import { SearchDocuments } from '../application/use-cases/search-documents.js';
import type { Chunk, SearchMetric, SearchResult, Vector } from '../domain/types.js';
import { FixedChunker } from '../adapters/chunking/fixed-chunker.js';
import { MockEmbedder } from '../adapters/embedding/mock-embedder.js';
import { InMemoryVectorIndex } from '../adapters/index/in-memory-vector-index.js';
import { DefaultEmbeddingPipeline } from '../adapters/pipeline/default-embedding-pipeline.js';
import { DefaultSearchPolicy } from '../adapters/pipeline/default-search-policy.js';
import { DefaultVectorOps } from '../adapters/vector/default-vector-ops.js';
import { resolveConfig } from '../config/defaults.js';
import type { EmbedKitConfig } from '../config/types.js';
import type { DocumentRecord } from '../domain/types.js';
import type { EmbeddingPipeline, VectorIndex } from '../ports/interfaces.js';

export interface EmbedKitDeps {
  pipeline: EmbeddingPipeline;
  vectorIndex?: VectorIndex;
}

export class EmbedKit {
  private readonly indexDocumentUseCase: IndexDocument;
  private readonly searchDocumentsUseCase: SearchDocuments;

  constructor(private readonly deps: EmbedKitDeps) {
    this.indexDocumentUseCase = new IndexDocument(deps.pipeline);
    this.searchDocumentsUseCase = new SearchDocuments(deps.pipeline);
  }

  static async create(config: EmbedKitConfig = {}): Promise<EmbedKit> {
    const resolved = resolveConfig(config);
    if (resolved.pipeline) {
      return new EmbedKit({ pipeline: resolved.pipeline });
    }

    const vectorOps = new DefaultVectorOps();
    const chunker = new FixedChunker({
      size: resolved.chunking.size,
      overlap: resolved.chunking.overlap,
    });
    const embedder = new MockEmbedder({
      normalize: resolved.embeddings.normalize,
      model: resolved.embeddings.model,
      vectorOps,
    });
    const vectorIndex = new InMemoryVectorIndex(vectorOps);
    const searchPolicy = new DefaultSearchPolicy({
      topK: resolved.search.topK,
      metric: resolved.search.metric,
    });

    const pipeline = new DefaultEmbeddingPipeline({
      chunker,
      embedder,
      vectorIndex,
      searchPolicy,
      preprocessor: resolved.preprocessor,
      embedNormalize: resolved.embeddings.normalize,
      batchSize: resolved.embeddings.batchSize,
    });

    return new EmbedKit({ pipeline, vectorIndex });
  }

  async indexDocument(id: string, text: string, metadata?: Record<string, unknown>): Promise<Chunk[]> {
    const document: DocumentRecord = { id, text, metadata };
    return this.indexDocumentUseCase.execute(document);
  }

  async search(text: string, options?: { topK?: number; metric?: SearchMetric }): Promise<SearchResult[]> {
    return this.searchDocumentsUseCase.execute(text, options);
  }

  async embed(text: string): Promise<Vector> {
    return this.deps.pipeline.embedText(text);
  }

  async clear(): Promise<void> {
    if (!this.deps.vectorIndex) {
      return;
    }

    await this.deps.vectorIndex.clear();
  }
}
