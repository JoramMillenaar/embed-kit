import type { Chunk, DocumentRecord } from '../../domain/types.js';
import type { TextChunker } from '../../ports/interfaces.js';

export class ChunkText {
  constructor(private readonly chunker: TextChunker) {}

  async execute(document: DocumentRecord): Promise<Chunk[]> {
    return this.chunker.chunk(document);
  }
}
