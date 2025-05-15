import AdmZip from 'adm-zip';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true }).catch(() => {});
}

async function extractZip(zipPath) {
  try {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
      if (!entry.isDirectory) {
        await ensureDir(entry.entryName);
        zip.extractEntryTo(entry, '.', false, true);
      }
    }
    
    console.log('Extraction complete');
  } catch (err) {
    console.error('Error extracting zip:', err);
  }
}

extractZip('lmssystem.zip');