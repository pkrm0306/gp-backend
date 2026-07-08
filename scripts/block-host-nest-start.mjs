#!/usr/bin/env node
/**
 * Prevents running Nest on the host. API must run inside Docker (see npm run start:dev).
 */
import fs from 'node:fs';

const inDocker =
  process.env.RUNNING_IN_DOCKER === 'true' ||
  process.env.DOCKER_CONTAINER === 'true' ||
  fs.existsSync('/.dockerenv');

if (!inDocker) {
  console.error('\n[greenpro] The API must run inside Docker.\n');
  console.error('  npm run start:dev          # start API + Redis (attached logs)');
  console.error('  npm run start:dev -- -d    # start detached');
  console.error('  npm run docker:logs        # follow API logs when detached\n');
  process.exit(1);
}
