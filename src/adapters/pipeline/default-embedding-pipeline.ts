import type { Chunk, DocumentRecord, SearchMetric, SearchResult, Vector } from '../../domain/types.js';
import type {
  DocumentPreprocessor,
  Embedder,
  EmbeddingPipeline,
  SearchPolicy,
  TextChunker,
  VectorIndex,
} from '../../ports/interfaces.js';

export interface DefaultEmbeddingPipelineDeps {
  chunker: TextChunker;
  embedder: Embedder;
  vectorIndex: VectorIndex;
  searchPolicy: SearchPolicy;
  preprocessor?: DocumentPreprocessor;
  embedNormalize?: boolean;
  batchSize?: number;
}

export class DefaultEmbeddingPipeline implements EmbeddingPipeline {
  constructor(private readonly deps: DefaultEmbeddingPipelineDeps) {}

  async indexDocument(document: DocumentRecord): Promise<Chunk[]> {
    const processed = this.deps.preprocessor ? await this.deps.preprocessor.process(document) : document;
    const chunks = await this.deps.chunker.chunk(processed);
    if (chunks.length === 0) {
      return [];
    }

    const embeddingResponse = await this.deps.embedder.embed({
      texts: chunks.map((chunk) => chunk.text),
      normalize: this.deps.embedNormalize,
      batchSize: this.deps.batchSize,
    });

    await this.deps.vectorIndex.add(
      chunks.map((chunk, index) => ({
        id: chunk.id,
        vector: embeddingResponse.vectors[index]!,
        documentId: chunk.documentId,
        text: chunk.text,
        metadata: { ...chunk.metadata },
      })),
    );

    return chunks;
  }

  async search(text: string, options: { topK?: number; metric?: SearchMetric } = {}): Promise<SearchResult[]> {
    const queryVector = await this.embedText(text);
    const resolved = this.deps.searchPolicy.resolve(options);
    return this.deps.vectorIndex.search(queryVector, resolved);
  }

  async embedText(text: string): Promise<Vector> {
    const response = await this.deps.embedder.embed({
      texts: [text],
      normalize: this.deps.embedNormalize,
      batchSize: this.deps.batchSize,
    });

    return response.vectors[0]!;
  }
}
