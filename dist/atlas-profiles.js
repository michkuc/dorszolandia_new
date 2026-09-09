import encoded from './atlas-profiles-data.js';
const binary = atob(encoded);
const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
export const atlasProfiles = JSON.parse(await new Response(stream).text());
