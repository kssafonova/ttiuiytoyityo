import { mkdir, access, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const fonts = [
  ['manrope-cyrillic-ext.woff2', 'https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggqxSvfedN62Zw.woff2'],
  ['manrope-cyrillic.woff2', 'https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggOxSvfedN62Zw.woff2'],
  ['manrope-latin.woff2', 'https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSvfedN4.woff2'],
];

const targetDir = resolve('src/assets/fonts');
await mkdir(targetDir, { recursive: true });

for (const [name, url] of fonts) {
  const target = resolve(targetDir, name);
  try {
    await access(target, constants.F_OK);
    continue;
  } catch {}

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${name}: ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  await writeFile(target, data);
  console.log(`Downloaded ${name} (${data.length} bytes)`);
}
