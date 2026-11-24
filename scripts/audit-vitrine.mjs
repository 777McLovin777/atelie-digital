import {createHash} from 'node:crypto';
import {lstatSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sensitiveArtifacts} from './lib/file-security.mjs';

const root = fileURLToPath(new URL('../dist-vitrine/', import.meta.url));
const fixed = ['404.html', '_headers', 'assets', 'index.html'];
const permissions = /(?:default-src 'none'.*script-src 'self'.*connect-src 'none'.*form-action 'none'.*frame-ancestors 'none')/;

try {
  if (lstatSync(root).isSymbolicLink() || readdirSync(root).sort().join(',') !== fixed.join(',')) {
    throw new Error('Estrutura inesperada.');
  }
  const assets = readdirSync(join(root, 'assets'));
  if (assets.length !== 2 || assets.some(name => !/^index-[\w-]+\.(?:js|css)$/.test(name)) ||
      !assets.some(name => name.endsWith('.js')) || !assets.some(name => name.endsWith('.css'))) {
    throw new Error('Conjunto de bundles inesperado.');
  }
  const files = [...fixed.filter(name => name !== 'assets'), ...assets.map(name => `assets/${name}`)].sort();
  if (files.some(name => !lstatSync(join(root, name)).isFile()) ||
      !lstatSync(join(root, 'assets')).isDirectory() || sensitiveArtifacts(root).length) {
    throw new Error('Artefato sensível ou tipo de arquivo inesperado.');
  }
  const index = readFileSync(join(root, 'index.html'), 'utf8');
  const script = readFileSync(join(root, files.find(name => name.endsWith('.js'))), 'utf8');
  if (!permissions.test(readFileSync(join(root, '_headers'), 'utf8')) ||
      !assets.every(name => index.includes('/assets/' + name)) ||
      /supabase\.co|storage:\/\/|#\/admin|VITE_|contato@exemplo\.com|delivery-pedemoca\.pages\.dev|atelier_portfolio_v1_data|sb_(?:secret|publishable)_|doceconecta|doce conecta|doce-conecta/i.test(index + script)) {
    throw new Error('Referência privada, proteção ausente ou bundle não referenciado.');
  }
  for (const name of files) {
    console.log(createHash('sha256').update(readFileSync(join(root, name))).digest('hex'), name);
  }
} catch {
  console.error('Auditoria da vitrine reprovada. Gere dist-vitrine e confira a estrutura, os cabeçalhos e as referências. Não distribua o diretório.');
  process.exitCode = 1;
}
