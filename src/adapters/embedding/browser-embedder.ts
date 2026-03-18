import type { EmbeddingRequest, EmbeddingResponse } from '../../domain/types.js';
import type { Embedder } from '../../ports/interfaces.js';

export interface BrowserEmbeddingClient {
  embed(input: { texts: string[]; model?: string; normalize?: boolean; batchSize?: number }): Promise<{ vectors: number[][]; model?: string }>;
}

export class BrowserEmbedder implements Embedder {
  constructor(
    private readonly client: BrowserEmbeddingClient,
    private readonly options: { model?: string } = {},
  ) {}

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const response = await this.client.embed({
      texts: request.texts,
      model: this.options.model,
      normalize: request.normalize,
      batchSize: request.batchSize,
    });

    return {
      vectors: response.vectors,
      model: response.model ?? this.options.model,
      normalized: Boolean(request.normalize),
    };
  }
}
