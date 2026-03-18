import type { Chunk, DocumentRecord } from '../../domain/types.js';
import type { TextChunker } from '../../ports/interfaces.js';
import { assert } from '../../utils/assert.js';

export interface FixedChunkerOptions {
  size: number;
  overlap?: number;
}

export class FixedChunker implements TextChunker {
  private readonly size: number;
  private readonly overlap: number;

  constructor(options: FixedChunkerOptions) {
    assert(options.size > 0, 'Chunk size must be greater than 0.');
    const overlap = options.overlap ?? 0;
    assert(overlap >= 0, 'Chunk overlap cannot be negative.');
    assert(overlap < options.size, 'Chunk overlap must be smaller than chunk size.');
    this.size = options.size;
    this.overlap = overlap;
  }

  chunk(document: DocumentRecord): Chunk[] {
    const chunks: Chunk[] = [];
    const step = this.size - this.overlap;

    for (let start = 0, index = 0; start < document.text.length; start += step, index += 1) {
      const end = Math.min(start + this.size, document.text.length);
      const text = document.text.slice(start, end);

      chunks.push({
        id: `${document.id}::chunk-${index}`,
        documentId: document.id,
        text,
        index,
        startOffset: start,
        endOffset: end,
        metadata: {
          ...(document.metadata ?? {}),
          chunkingStrategy: 'fixed',
          chunkIndex: index,
          startOffset: start,
          endOffset: end,
        },
      });

      if (end === document.text.length) {
        break;
      }
    }

    return chunks;
  }
}
