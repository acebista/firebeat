/**
 * Chunk Generator (V2)
 * Splits smart_sync.sql into even smaller chunks (20 DO blocks each)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQL_PATH = path.join(__dirname, '..', 'smart_sync.sql');

function generateChunks() {
    const content = fs.readFileSync(SQL_PATH, 'utf-8');
    const sections = content.split('DO $$');
    const preamble = sections[0];
    const rest = sections.slice(1).map(s => 'DO $$' + s);

    // Clean up old chunks
    const files = fs.readdirSync(path.join(__dirname, '..'));
    files.filter(f => f.startsWith('chunk_') && f.endsWith('.sql')).forEach(f => {
        fs.unlinkSync(path.join(__dirname, '..', f));
    });

    const CHUNK_SIZE = 20;
    for (let i = 0; i < rest.length; i += CHUNK_SIZE) {
        const chunk = rest.slice(i, i + CHUNK_SIZE).join('\n');
        fs.writeFileSync(path.join(__dirname, '..', `chunk_${Math.floor(i / CHUNK_SIZE)}.sql`), (i === 0 ? preamble : '') + chunk);
    }
    console.log(`✅ Generated ${Math.ceil(rest.length / CHUNK_SIZE)} chunks.`);
}
generateChunks();
