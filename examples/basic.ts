import { EmbedKit } from '../src';

async function main(): Promise<void> {
  const kit = await EmbedKit.create({
    chunking: { size: 80, overlap: 20 },
  });

  await kit.indexDocument(
    'doc-1',
    'Espresso is concentrated coffee brewed by forcing hot water through finely-ground beans. Cappuccino combines espresso with steamed milk and foam.',
    { source: 'example' },
  );

  const results = await kit.search('italian coffee', { topK: 3 });
  console.log(results);
}

void main();
