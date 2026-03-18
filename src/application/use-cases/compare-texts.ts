import type { Embedder, VectorOps } from '../../ports/interfaces.js';

export class CompareTexts {
  constructor(
    private readonly embedder: Embedder,
    private readonly vectorOps: VectorOps,
    private readonly options: { normalize?: boolean; batchSize?: number } = {},
  ) {}

  async execute(a: string, b: string): Promise<{ cosineSimilarity: number; dot: number; euclideanDistance: number }> {
    const response = await this.embedder.embed({
      texts: [a, b],
      normalize: this.options.normalize,
      batchSize: this.options.batchSize,
    });
    const [left, right] = response.vectors;

    return {
      cosineSimilarity: this.vectorOps.cosineSimilarity(left!, right!),
      dot: this.vectorOps.dot(left!, right!),
      euclideanDistance: this.vectorOps.euclideanDistance(left!, right!),
    };
  }
}
