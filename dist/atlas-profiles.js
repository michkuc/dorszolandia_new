import encoded from './atlas-profiles-data.js';

const normalized = String(encoded)
  .replace(/-/g, '+')
  .replace(/_/g, '/')
  .replace(/[^A-Za-z0-9+/=]/g, '');
const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
const binary = atob(padded);
const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
export const atlasProfiles = JSON.parse(await new Response(stream).text());
