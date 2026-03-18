import type { SearchMetric } from '../../domain/types.js';
import type { SearchPolicy } from '../../ports/interfaces.js';

export class DefaultSearchPolicy implements SearchPolicy {
  constructor(
    private readonly defaults: { topK: number; metric: SearchMetric },
  ) {}

  resolve(options: { topK?: number; metric?: SearchMetric } = {}): { topK: number; metric: SearchMetric } {
    return {
      topK: options.topK ?? this.defaults.topK,
      metric: options.metric ?? this.defaults.metric,
    };
  }
}
