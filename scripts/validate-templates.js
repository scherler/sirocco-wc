#!/usr/bin/env node

/**
 * scripts/validate-templates.js
 *
 * Regression harness for the two project templates shipped by this package
 * (`bin/template` -> "default", `bin/showcase-template` -> "showcase").
 *
 * For each template it:
 *   1. creates an isolated temp directory,
 *   2. scaffolds the template through the *local* CLI (never the published
 *      npm package), with SWC_SKIP_POSTINIT=1 so `bin/init.js` does not run its
 *      own `yarn set version` / `yarn install` / plugin-import / SDK side
 *      effects -- this harness owns install timing itself,
 *   3. rewrites the scaffolded dependency on this package to
 *      `portal:<repo root>` so the working tree is what gets exercised,
 *   4. installs, then runs `css:build`, `build` and `lint`.
 *
 * `test` is deliberately NOT run: no template ships any test files today and
 * the harness environment has no Playwright browsers installed.
 *
 * Every child process is spawned with an argv array -- never a shell string.
 *
 * Usage: node scripts/validate-templates.js [--keep] [--only=default|showcase]
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const CLI_ENTRY = path.join(REPO_ROOT, 'bin', 'main.js');
const ROOT_PKG = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), { encoding: 'utf-8' }));

// `bin/template/_variables.js` and `bin/showcase-template/_variables.js` each
// declare 11 prompt fields. A blank answer takes the declared default where
// there is one (9 of them) and resolves to an empty string for the two that
// have none (Description, Author) -- acceptable for a throwaway scaffold.
//
// The answers MUST be fed one at a time, in response to each prompt: writing
// all 11 newlines up front does not work, because `prompt`'s underlying
// `read`/`readline` pass consumes the whole buffered chunk on its first read
// and then sees EOF, so `init` silently gives up after the 2nd field.
const PROMPT_FIELD_COUNT = 11;
const PROMPT_TOKEN = 'prompt: ';
// Nudge interval for the (unexpected) case where no new prompt token appears.
const PROMPT_IDLE_NUDGE_MS = 5000;
const PROMPT_MAX_ANSWERS = PROMPT_FIELD_COUNT + 4;
const SCAFFOLD_TIMEOUT_MS = 120000;

const TEMPLATES = ['default', 'showcase'];

function parseArgs(argv) {
  const options = { keep: false, only: null };
  argv.forEach(arg => {
    if (arg === '--keep') {
      options.keep = true;
    } else if (arg.startsWith('--only=')) {
      options.only = arg.slice('--only='.length);
    }
  });
  return options;
}

function log(message) {
  process.stdout.write(`${message}\n`);
}

/**
 * Runs a child process with an argv array and captures its result.
 * Never builds a shell string.
 */
function run(name, command, args, cwd, extraEnv) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
    env: Object.assign({}, process.env, extraEnv || {}),
  });
  const ok = !result.error && result.status === 0;
  const stderr = result.error ? String(result.error.message) : String(result.stderr || '');
  return {
    name,
    ok,
    status: result.status,
    stdout: String(result.stdout || ''),
    stderr,
    durationMs: Date.now() - started,
  };
}

function scaffold(template, tmpDir) {
  const started = Date.now();
  return new Promise(resolve => {
    const child = spawn(process.execPath, [CLI_ENTRY, 'init', '-t', template], {
      cwd: tmpDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      // SWC_SKIP_POSTINIT lets this harness own install ordering.
      env: Object.assign({}, process.env, { SWC_SKIP_POSTINIT: '1' }),
    });

    let stdout = '';
    let stderr = '';
    let answered = 0;
    let promptsSeen = 0;
    let lastAnswerAt = Date.now();
    let settled = false;

    const answer = () => {
      if (answered >= PROMPT_MAX_ANSWERS || child.stdin.destroyed || !child.stdin.writable) return;
      answered += 1;
      lastAnswerAt = Date.now();
      child.stdin.write('\n');
      // `prompt` keeps stdin resumed, which holds the child's event loop open
      // long after scaffolding finishes -- close it once every field is
      // answered so the child can exit on its own.
      if (answered >= PROMPT_FIELD_COUNT) child.stdin.end();
    };

    const nudge = setInterval(() => {
      if (Date.now() - lastAnswerAt >= PROMPT_IDLE_NUDGE_MS) answer();
    }, PROMPT_IDLE_NUDGE_MS);

    const killTimer = setTimeout(() => {
      stderr += `\nvalidate-templates: init timed out after ${SCAFFOLD_TIMEOUT_MS}ms`;
      child.kill('SIGKILL');
    }, SCAFFOLD_TIMEOUT_MS);

    child.stdout.on('data', chunk => {
      const text = String(chunk);
      stdout += text;
      // One blank answer per prompt actually issued.
      const total = stdout.split(PROMPT_TOKEN).length - 1;
      while (promptsSeen < total) {
        promptsSeen += 1;
        answer();
      }
    });
    child.stderr.on('data', chunk => {
      stderr += String(chunk);
    });

    const finish = (status, error) => {
      if (settled) return;
      settled = true;
      clearInterval(nudge);
      clearTimeout(killTimer);
      resolve({
        name: 'init',
        ok: !error && status === 0 && fs.existsSync(path.join(tmpDir, 'package.json')),
        status,
        stdout,
        stderr: error ? `${stderr}\n${error.message}` : stderr,
        durationMs: Date.now() - started,
      });
    };

    child.on('error', error => finish(null, error));
    child.on('close', status => finish(status, null));
  });
}

/**
 * Points the scaffolded project's dependency on this package at the working
 * tree instead of the npm registry. The dependency key is read from the root
 * package.json at runtime rather than hardcoded.
 */
function linkLocalCli(tmpDir) {
  const pkgPath = path.join(tmpDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf-8' }));
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies[ROOT_PKG.name] = `portal:${REPO_ROOT}`;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

/**
 * `bin/template` ships no `src/` directory at all, so seed a real component
 * through the portal-linked local CLI and write the top-level Parcel entry
 * that `build:bundle` actually targets (`add` only ever appends to the
 * component-type-level index). `showcase` needs neither step.
 */
function seedDefaultTemplate(tmpDir, steps) {
  steps.push(run('add-component', 'yarn', [':add', 'sample'], tmpDir));
  const entry = path.join(tmpDir, 'src', 'main', 'ts', 'index.ts');
  fs.mkdirSync(path.dirname(entry), { recursive: true });
  if (!fs.existsSync(entry)) {
    fs.writeFileSync(entry, "export * from './components';\n");
  }
}

async function validateTemplate(template, options) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sirocco-validate-'));
  const steps = [];

  log(`\n=== ${template} :: ${tmpDir}`);

  try {
    steps.push(await scaffold(template, tmpDir));
    if (!steps[steps.length - 1].ok) {
      return { template, tmpDir, steps };
    }

    linkLocalCli(tmpDir);

    // `corepack enable` is intentionally advisory: it can fail in restricted
    // CI/sandbox contexts and is a no-op on an already-Corepack-enabled
    // runner, so its result is recorded but never gates anything.
    const corepack = run('corepack-enable', 'corepack', ['enable'], tmpDir);
    corepack.advisory = true;
    steps.push(corepack);

    const installEnv = { COREPACK_ENABLE_DOWNLOAD_PROMPT: '0' };
    // `--no-immutable` (not `--immutable=false`, which Yarn 4 rejects as an
    // invalid option name) -- the scaffolded lockfile is expected to move.
    steps.push(run('install', 'yarn', ['install', '--no-immutable'], tmpDir, installEnv));
    if (!steps[steps.length - 1].ok) {
      return { template, tmpDir, steps };
    }

    if (template === 'default') {
      seedDefaultTemplate(tmpDir, steps);
    }

    steps.push(run('css:build', 'yarn', ['css:build'], tmpDir));
    steps.push(run('build', 'yarn', ['build'], tmpDir));
    steps.push(run('lint', 'yarn', ['lint'], tmpDir));
    return { template, tmpDir, steps };
  } finally {
    if (options.keep) {
      log(`  --keep: leaving ${tmpDir} in place`);
    } else {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}

function statusLabel(step) {
  if (step.ok) return 'PASS';
  if (step.advisory) return 'FAIL (advisory, non-blocking)';
  return 'FAIL';
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const templates = options.only ? TEMPLATES.filter(t => t === options.only) : TEMPLATES;

  if (!templates.length) {
    log(`No such template: ${options.only}. Known templates: ${TEMPLATES.join(', ')}`);
    process.exit(1);
  }

  const results = [];
  for (const template of templates) {
    results.push(await validateTemplate(template, options));
  }

  let hasBlockingFailure = false;

  log('\n================ validate-templates summary ================');
  results.forEach(result => {
    log(`\n${result.template}`);
    result.steps.forEach(step => {
      const seconds = (step.durationMs / 1000).toFixed(1);
      log(`  ${step.name.padEnd(16)} ${statusLabel(step).padEnd(34)} ${seconds}s`);
      if (!step.ok && !step.advisory) {
        // Yarn reports most failures on stdout, so fall back to it.
        const output = step.stderr.trim() || step.stdout.trim();
        const tail = output.split('\n').slice(-20).join('\n      ');
        if (tail) log(`      ${tail}`);
      }
    });
    result.steps.forEach(step => {
      if (!step.ok && !step.advisory) {
        hasBlockingFailure = true;
      }
    });
  });

  log(`\nOverall: ${hasBlockingFailure ? 'FAIL' : 'PASS'}`);
  process.exit(hasBlockingFailure ? 1 : 0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
