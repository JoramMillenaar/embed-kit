import type { SearchMetric } from '../domain/types.js';
import type { DocumentPreprocessor, EmbeddingPipeline } from '../ports/interfaces.js';

export type EmbedKitConfig = {
  chunking?: {
    strategy?: 'fixed';
    size?: number;
    overlap?: number;
  };
  embeddings?: {
    provider?: string;
    model?: string;
    normalize?: boolean;
    batchSize?: number;
  };
  index?: {
    provider?: string;
  };
  search?: {
    metric?: SearchMetric;
    topK?: number;
  };
  pipeline?: EmbeddingPipeline;
  preprocessor?: DocumentPreprocessor;
};

export interface ResolvedEmbedKitConfig {
  chunking: {
    strategy: 'fixed';
    size: number;
    overlap: number;
  };
  embeddings: {
    provider: string;
    model: string;
    normalize: boolean;
    batchSize: number;
  };
  index: {
    provider: string;
  };
  search: {
    metric: SearchMetric;
    topK: number;
  };
  pipeline?: EmbeddingPipeline;
  preprocessor?: DocumentPreprocessor;
}
