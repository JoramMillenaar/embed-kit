import type { EmbeddingRequest, EmbeddingResponse, Vector } from '../../domain/types.js';
import type { Embedder, VectorOps } from '../../ports/interfaces.js';
import { DefaultVectorOps } from '../vector/default-vector-ops.js';

export interface MockEmbedderOptions {
  dimensions?: number;
  normalize?: boolean;
  vectorOps?: VectorOps;
  model?: string;
}

export class MockEmbedder implements Embedder {
  private readonly dimensions: number;
  private readonly normalizeByDefault: boolean;
  private readonly vectorOps: VectorOps;
  private readonly model: string;

  constructor(options: MockEmbedderOptions = {}) {
    this.dimensions = options.dimensions ?? 12;
    this.normalizeByDefault = options.normalize ?? true;
    this.vectorOps = options.vectorOps ?? new DefaultVectorOps();
    this.model = options.model ?? 'hash-embedding-v1';
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const shouldNormalize = request.normalize ?? this.normalizeByDefault;
    const vectors = request.texts.map((text) => {
      const vector = this.hashText(text);
      return shouldNormalize ? this.vectorOps.normalize(vector) : vector;
    });

    return {
      vectors,
      model: this.model,
      normalized: shouldNormalize,
    };
  }

  private hashText(text: string): Vector {
    const vector = new Array<number>(this.dimensions).fill(0);
    const normalizedText = text.toLowerCase();

    for (let index = 0; index < normalizedText.length; index += 1) {
      const code = normalizedText.charCodeAt(index);
      const bucket = code % this.dimensions;
      vector[bucket] = (vector[bucket] ?? 0) + 1;
      const nextBucket = (bucket + 1) % this.dimensions;
      vector[nextBucket] = (vector[nextBucket] ?? 0) + code / 255;
    }

    return vector;
  }
}
