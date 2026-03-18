export type Vector = number[];

export type SearchMetric = 'cosine' | 'dot' | 'euclidean';

export type ChunkingStrategy = 'fixed';

export interface DocumentRecord {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface Chunk {
  id: string;
  documentId: string;
  text: string;
  index: number;
  startOffset: number;
  endOffset: number;
  metadata: Record<string, unknown>;
}

export interface EmbeddedChunk extends Chunk {
  vector: Vector;
}

export interface SearchResult {
  id: string;
  documentId: string;
  chunkId: string;
  text: string;
  score: number;
  metric: SearchMetric;
  metadata: Record<string, unknown>;
}

export interface EmbeddingRequest {
  texts: string[];
  normalize?: boolean;
  batchSize?: number;
}

export interface EmbeddingResponse {
  vectors: Vector[];
  model?: string;
  normalized: boolean;
}

export interface IndexVectorRecord {
  id: string;
  vector: Vector;
  documentId: string;
  text: string;
  metadata: Record<string, unknown>;
}

export interface SearchQuery {
  text: string;
  topK?: number;
  metric?: SearchMetric;
}

export interface ProjectionResult {
  vector: Vector;
  magnitude: number;
}
