import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {showcase} from '../vitrine/content.js';
import {quoteHref} from '../src/data/contact.js';
import {isDemoProject} from '../src/data/demoProjects.js';
import {routeId, safeUrl} from '../src/data/publicUrls.js';

test('vitrine has four services, disclosed samples and no active contact', () => {
  assert.equal(showcase.services.length, 4);
  assert.equal(showcase.projects.length, 2);
  assert.deepEqual(showcase.projects.map(project => project.id), ['pe-de-moca', 'laboratorio']);
  assert.deepEqual([...new Set(showcase.projects.map(project => project.category))], ['Web', 'Experimento']);
  assert.ok(showcase.projects.every(p => isDemoProject(p) && !p.link && !p.image && !p.gallery.length));
  assert.equal(quoteHref(showcase.profile.email), '');
  assert.equal(quoteHref('contato@example.com'), '');
});

test('public routes and headers keep navigation and network restricted', () => {
  assert.equal(routeId('#/projeto/pe-de-moca'), 'pe-de-moca');
  assert.equal(safeUrl('javascript:void(0)'), '');
  const headers = readFileSync(new URL('../vitrine/_headers', import.meta.url), 'utf8');
  for (const directive of ["connect-src 'none'", "form-action 'none'", "frame-ancestors 'none'"]) {
    assert.ok(headers.includes(directive));
  }
});
