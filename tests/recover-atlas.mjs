import fs from 'node:fs';
import zlib from 'node:zlib';

const sourcePath = 'dist/atlas-profiles-data.js';
const outDir = 'recovery-output';
fs.mkdirSync(outDir, { recursive: true });

const source = fs.readFileSync(sourcePath, 'utf8').trim();
const match = source.match(/^export\s+default\s+['"]([A-Za-z0-9+/_=-]+)['"];?$/s);
if (!match) throw new Error('Nie udało się wydobyć payloadu base64 z atlas-profiles-data.js');

const normalized = match[1]
  .replace(/-/g, '+')
  .replace(/_/g, '/')
  .replace(/[^A-Za-z0-9+/=]/g, '');
const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
const packed = Buffer.from(padded, 'base64');

const diagnostics = [];
diagnostics.push(`base64_chars=${normalized.length}`);
diagnostics.push(`packed_bytes=${packed.length}`);
diagnostics.push(`header=${packed.subarray(0, 12).toString('hex')}`);
diagnostics.push(`tail=${packed.subarray(Math.max(0, packed.length - 16)).toString('hex')}`);

function gzipDataOffset(buffer) {
  if (buffer[0] !== 0x1f || buffer[1] !== 0x8b || buffer[2] !== 8) throw new Error('Payload nie ma nagłówka gzip/deflate');
  const flags = buffer[3];
  let offset = 10;
  if (flags & 4) {
    const xlen = buffer.readUInt16LE(offset);
    offset += 2 + xlen;
  }
  if (flags & 8) while (offset < buffer.length && buffer[offset++] !== 0) {}
  if (flags & 16) while (offset < buffer.length && buffer[offset++] !== 0) {}
  if (flags & 2) offset += 2;
  return offset;
}

let text = '';
let method = '';
try {
  text = zlib.gunzipSync(packed).toString('utf8');
  method = 'gunzipSync';
} catch (error) {
  diagnostics.push(`gunzip_error=${error.code || ''}:${error.message}`);
  const start = gzipDataOffset(packed);
  const candidates = [
    ['inflateRaw_without_trailer', packed.subarray(start, Math.max(start, packed.length - 8)), {}],
    ['inflateRaw_sync_flush_without_trailer', packed.subarray(start, Math.max(start, packed.length - 8)), { finishFlush: zlib.constants.Z_SYNC_FLUSH }],
    ['inflateRaw_sync_flush_full_tail', packed.subarray(start), { finishFlush: zlib.constants.Z_SYNC_FLUSH }]
  ];
  for (const [name, data, options] of candidates) {
    try {
      const candidate = zlib.inflateRawSync(data, options).toString('utf8');
      diagnostics.push(`${name}_chars=${candidate.length}`);
      if (candidate.length > text.length) {
        text = candidate;
        method = name;
      }
      try {
        const parsed = JSON.parse(candidate);
        if (Array.isArray(parsed)) {
          text = candidate;
          method = name;
          break;
        }
      } catch {}
    } catch (inner) {
      diagnostics.push(`${name}_error=${inner.code || ''}:${inner.message}`);
    }
  }
}

fs.writeFileSync(`${outDir}/atlas-recovered.txt`, text, 'utf8');
diagnostics.push(`recovered_method=${method || 'none'}`);
diagnostics.push(`recovered_chars=${text.length}`);

let profiles;
try {
  profiles = JSON.parse(text);
} catch (error) {
  diagnostics.push(`json_error=${error.message}`);
  fs.writeFileSync(`${outDir}/diagnostics.txt`, diagnostics.join('\n') + '\n', 'utf8');
  console.log(diagnostics.join('\n'));
  process.exitCode = 2;
  throw new Error('Payload został częściowo odzyskany, ale nie tworzy kompletnego JSON');
}

if (!Array.isArray(profiles)) throw new Error('Odzyskany JSON nie jest tablicą profili');
diagnostics.push(`profile_count=${profiles.length}`);
diagnostics.push(`first=${profiles[0]?.name || ''}`);
diagnostics.push(`last=${profiles.at(-1)?.name || ''}`);

const required = ['id','name','role','place','character','talent','weakness','history','hook'];
const incomplete = profiles.map((profile, index) => ({ index, missing: required.filter(key => !profile?.[key]) })).filter(row => row.missing.length);
diagnostics.push(`incomplete_profiles=${incomplete.length}`);
if (incomplete.length) diagnostics.push(`incomplete_detail=${JSON.stringify(incomplete)}`);

const js = `export const atlasProfiles = ${JSON.stringify(profiles, null, 2)};\n\nexport const atlasProfilesById = new Map(atlasProfiles.map(profile => [profile.id, profile]));\n`;
fs.writeFileSync(`${outDir}/atlas-profiles.js`, js, 'utf8');
fs.writeFileSync(`${outDir}/diagnostics.txt`, diagnostics.join('\n') + '\n', 'utf8');
console.log(diagnostics.join('\n'));

if (profiles.length !== 59) throw new Error(`Oczekiwano 59 profili, odzyskano ${profiles.length}`);
if (profiles.at(-1)?.name !== 'Kołopłetwy Sprint') throw new Error(`Nieoczekiwany profil 59: ${profiles.at(-1)?.name || 'brak'}`);
console.log('ATLAS_RECOVERY_PASS');
