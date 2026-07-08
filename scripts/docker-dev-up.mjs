#!/usr/bin/env node
/**
 * Starts the NestJS API + Redis via Docker Compose (required dev entrypoint).
 * Host `npm run start:dev` must not run Nest directly — use this script.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: rootDir,
    shell: process.platform === 'win32',
    ...options,
  });
  if (result.error) {
    throw result.error;
  }
  return result.status ?? 1;
}

function isDockerReady() {
  const result = spawnSync('docker', ['ps'], {
    cwd: rootDir,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return result.status === 0;
}

if (!isDockerReady()) {
  const hint = spawnSync('docker', ['ps'], {
    cwd: rootDir,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  const detail = String(hint.stderr || hint.stdout || '').trim();
  console.error('\n[greenpro] Docker is required. Start Docker Desktop, then run:\n');
  console.error('  npm run start:dev\n');
  if (detail) {
    console.error(`Docker error: ${detail.split('\n')[0]}\n`);
  }
  process.exit(1);
}

const composeFiles = ['-f', 'docker-compose.yml', '-f', 'docker-compose.dev.yml'];
const detached = process.argv.includes('--detach') || process.argv.includes('-d');

const upArgs = ['compose', ...composeFiles, 'up', '--build', 'redis', 'api'];
if (detached) {
  upArgs.push('-d');
}

const code = run('docker', upArgs);
process.exit(code);
