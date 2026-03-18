import type {
  Chunk,
  DocumentRecord,
  EmbeddingRequest,
  EmbeddingResponse,
  IndexVectorRecord,
  ProjectionResult,
  SearchMetric,
  SearchResult,
  Vector,
} from '../domain/types.js';

export interface TextChunker {
  chunk(document: DocumentRecord): Promise<Chunk[]> | Chunk[];
}

export interface Embedder {
  embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}

export interface VectorIndex {
  add(items: IndexVectorRecord[]): Promise<void>;
  search(query: Vector, options?: { topK?: number; metric?: SearchMetric }): Promise<SearchResult[]>;
  remove(ids: string[]): Promise<void>;
  clear(): Promise<void>;
  size(): Promise<number>;
}

export interface VectorOps {
  dot(a: Vector, b: Vector): number;
  norm(vector: Vector): number;
  normalize(vector: Vector): Vector;
  cosineSimilarity(a: Vector, b: Vector): number;
  euclideanDistance(a: Vector, b: Vector): number;
  add(a: Vector, b: Vector): Vector;
  subtract(a: Vector, b: Vector): Vector;
  scale(vector: Vector, factor: number): Vector;
  centroid(vectors: Vector[]): Vector;
  lerp(a: Vector, b: Vector, t: number): Vector;
  project(vector: Vector, onto: Vector): ProjectionResult;
}

export interface DocumentPreprocessor {
  process(document: DocumentRecord): Promise<DocumentRecord> | DocumentRecord;
}

export interface SearchPolicy {
  resolve(options?: { topK?: number; metric?: SearchMetric }): { topK: number; metric: SearchMetric };
}

export interface EmbeddingPipeline {
  indexDocument(document: DocumentRecord): Promise<Chunk[]>;
  search(text: string, options?: { topK?: number; metric?: SearchMetric }): Promise<SearchResult[]>;
  embedText(text: string): Promise<Vector>;
}
