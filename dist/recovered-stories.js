import c1 from './recovered-chunk-1.js';
import c2 from './recovered-chunk-2.js';
import c3 from './recovered-chunk-3.js';
import c4 from './recovered-chunk-4.js';
import c5 from './recovered-chunk-5.js';
import c6 from './recovered-chunk-6.js';
import c7 from './recovered-chunk-7.js';
import c8 from './recovered-chunk-8.js';

const encoded = c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8;
const binary = atob(encoded);
const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));

export const recoveredStories = JSON.parse(await new Response(stream).text());
