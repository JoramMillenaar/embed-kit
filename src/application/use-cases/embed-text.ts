import type { Vector } from '../../domain/types.js';
import type { Embedder } from '../../ports/interfaces.js';

export class EmbedText {
  constructor(
    private readonly embedder: Embedder,
    private readonly options: { normalize?: boolean; batchSize?: number } = {},
  ) {}

  async execute(text: string): Promise<Vector> {
    const response = await this.embedder.embed({
      texts: [text],
      normalize: this.options.normalize,
      batchSize: this.options.batchSize,
    });

    return response.vectors[0]!;
  }
}
