import c1 from './archive-chunk-1.js';
import c2 from './archive-chunk-2.js';
import c3 from './archive-chunk-3.js';
import c4 from './archive-chunk-4.js';

const encoded = c1 + c2 + c3 + c4;
const binary = atob(encoded);
const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));

export const archiveStories = JSON.parse(await new Response(stream).text());
