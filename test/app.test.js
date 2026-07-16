import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { app } from '../server.js';

test('organizations endpoint serves fallback data when the database is unavailable', async () => {
  const server = app.listen(0);
  await once(server, 'listening');

  try {
    const address = server.address();
    assert.ok(address && typeof address === 'object');

    const response = await fetch(`http://127.0.0.1:${address.port}/organizations`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /BrightFuture Builders/);
    assert.match(body, /GreenHarvest Growers/);
  } finally {
    server.close();
    await once(server, 'close').catch(() => {});
  }
});
