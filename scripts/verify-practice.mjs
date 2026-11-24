import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COURSE = path.join(ROOT, 'site', 'src', 'data', 'course.mjs');

const { lessons } = await import(pathToFileURL(COURSE).href);

function findPython() {
  const candidates = process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3', 'python'];
  for (const command of candidates) {
    const result = spawnSync(command, ['--version'], { encoding: 'utf8' });
    if (result.status === 0) return command;
  }
  return null;
}

const python = findPython();
if (!python) {
  console.error('✖ Не найден Python. Установите Python 3.10+.');
  process.exit(1);
}

const runner = `
import io, json, contextlib, traceback

solution = __SOLUTION__
tests = __TESTS__
namespace = {"__name__": "__main__"}
buffer = io.StringIO()
error = None

try:
    with contextlib.redirect_stdout(buffer):
        exec(compile(solution, "<solution>", "exec"), namespace)
except BaseException:
    error = traceback.format_exc()

stdout = buffer.getvalue()
namespace["stdout"] = stdout
namespace["__stdout__"] = stdout

results = []
if error is None:
    for index, test in enumerate(tests):
        try:
            exec(compile(test, "<test>", "exec"), namespace)
            results.append([index, True, ""])
        except BaseException as exc:
            results.append([index, False, type(exc).__name__ + ": " + str(exc)])

print(json.dumps({"error": error, "output": stdout, "results": results}, ensure_ascii=False))
`;

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpc-practice-'));
const failures = [];

for (const [lessonIndex, lesson] of lessons.entries()) {
  const practice = lesson.practice;
  const script = runner
    .replace('__SOLUTION__', JSON.stringify(practice.solution ?? ''))
    .replace('__TESTS__', JSON.stringify(practice.tests ?? []));

  // Числовое имя важно: файл не должен перекрывать модуль стандартной библиотеки.
  const file = path.join(temp, `practice_${String(lessonIndex + 1).padStart(2, '0')}.py`);
  fs.writeFileSync(file, script, 'utf8');

  const result = spawnSync(python, ['-X', 'utf8', file], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 20_000,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PYTHONHASHSEED: '0' }
  });

  if (result.status !== 0) {
    failures.push({ lesson: lesson.id, reason: 'runner error', detail: (result.stderr || '').trim() });
    continue;
  }

  let payload;
  try {
    payload = JSON.parse(result.stdout.trim().split('\n').pop());
  } catch {
    failures.push({ lesson: lesson.id, reason: 'bad json', detail: result.stdout });
    continue;
  }

  if (payload.error) {
    failures.push({ lesson: lesson.id, reason: 'solution error', detail: payload.error.split('\n').slice(-4).join('\n') });
    continue;
  }

  const failed = payload.results.filter(([, ok]) => !ok);
  if (failed.length) {
    failures.push({
      lesson: lesson.id,
      reason: `${failed.length} из ${payload.results.length} тестов`,
      detail: failed.map(([index, , message]) => `test ${index + 1}: ${message}\n${practice.tests[index]}`).join('\n')
    });
  }
}

fs.rmSync(temp, { recursive: true, force: true });

if (failures.length) {
  console.error(`\n✖ Практика: ${failures.length} проблем(ы)\n`);
  for (const failure of failures) {
    console.error(`  ${failure.lesson}: ${failure.reason}`);
    console.error(`    ${failure.detail.replace(/\n/g, '\n    ')}\n`);
  }
  process.exit(1);
}

console.log(`✓ Практика: все ${lessons.length} эталонных решений проходят свои тесты.`);
