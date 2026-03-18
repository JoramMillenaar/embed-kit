import type { ResolvedEmbedKitConfig, EmbedKitConfig } from './types.js';

export const defaultConfig: ResolvedEmbedKitConfig = {
  chunking: {
    strategy: 'fixed',
    size: 400,
    overlap: 50,
  },
  embeddings: {
    provider: 'mock',
    model: 'hash-embedding-v1',
    normalize: true,
    batchSize: 32,
  },
  index: {
    provider: 'memory',
  },
  search: {
    metric: 'cosine',
    topK: 5,
  },
  pipeline: undefined,
  preprocessor: undefined,
};

export function resolveConfig(config: EmbedKitConfig = {}): ResolvedEmbedKitConfig {
  return {
    chunking: { ...defaultConfig.chunking, ...config.chunking },
    embeddings: { ...defaultConfig.embeddings, ...config.embeddings },
    index: { ...defaultConfig.index, ...config.index },
    search: { ...defaultConfig.search, ...config.search },
    pipeline: config.pipeline,
    preprocessor: config.preprocessor,
  };
}
