import { createReadStream } from 'node:fs';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Unzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true }).catch(() => {});
}

async function extractZip(zipPath) {
  const readStream = createReadStream(zipPath);
  const unzip = new Unzip();
  
  readStream.pipe(unzip);
  
  let currentFile = null;
  let currentWriteStream = null;
  
  unzip.on('data', async (chunk) => {
    if (!currentFile) {
      // Extract file name from zip header
      const fileName = chunk.toString().split('\0')[0];
      if (fileName) {
        currentFile = fileName;
        await ensureDir(currentFile);
        currentWriteStream = createWriteStream(currentFile);
      }
    } else {
      currentWriteStream.write(chunk);
    }
  });
  
  unzip.on('end', () => {
    if (currentWriteStream) {
      currentWriteStream.end();
    }
  });
  
  try {
    await pipeline(readStream, unzip);
    console.log('Extraction complete');
  } catch (err) {
    console.error('Error extracting zip:', err);
  }
}

extractZip('lmssystem.zip');