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
  console.error('✖ Не найден Python. Установите Python 3.11+.');
  process.exit(1);
}

const runner = `
import asyncio, io, json, contextlib, traceback, ast, inspect

solution = __SOLUTION__
tests = __TESTS__

async def __exec(code, namespace, filename):
    compiled = compile(code, filename, "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
    result = eval(compiled, namespace)
    if inspect.isawaitable(result):
        await result

async def __run():
    namespace = {"__name__": "__main__"}
    buffer = io.StringIO()
    error = None

    try:
        with contextlib.redirect_stdout(buffer):
            await __exec(solution, namespace, "<solution>")
    except BaseException:
        error = traceback.format_exc()

    stdout = buffer.getvalue()
    namespace["stdout"] = stdout
    namespace["__stdout__"] = stdout

    results = []
    if error is None:
        for index, test in enumerate(tests):
            try:
                await __exec(test, namespace, "<test>")
                results.append([index, True, ""])
            except BaseException as exc:
                results.append([index, False, type(exc).__name__ + ": " + str(exc)])

    print(json.dumps({"error": error, "output": stdout, "results": results}, ensure_ascii=False))

asyncio.run(__run())
`;

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpc-practice-'));
const failures = [];
let checkedPractices = 0;

for (const [lessonIndex, lesson] of lessons.entries()) {
  const prerequisites = Array.isArray(lesson.practice.steps) ? lesson.practice.steps : [];
  const items = [
    ...prerequisites.map((step, index) => ({
      practice: step,
      label: `шаг ${index + 1}`
    })),
    { practice: lesson.practice, label: 'основная задача' }
  ];

  for (const [practiceIndex, item] of items.entries()) {
    checkedPractices += 1;
    const practice = item.practice;
    const where = `${lesson.id} (${item.label})`;
    const script = runner
      .replace('__SOLUTION__', JSON.stringify(practice.solution ?? ''))
      .replace('__TESTS__', JSON.stringify(practice.tests ?? []));

    // Числовое имя важно: файл не должен перекрывать модуль стандартной библиотеки.
    const file = path.join(
      temp,
      `practice_${String(lessonIndex + 1).padStart(2, '0')}_${practiceIndex + 1}.py`
    );
    fs.writeFileSync(file, script, 'utf8');

    const result = spawnSync(python, ['-X', 'utf8', file], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 20_000,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PYTHONHASHSEED: '0' }
    });

    if (result.status !== 0) {
      failures.push({ lesson: where, reason: 'runner error', detail: (result.stderr || '').trim() });
      continue;
    }

    let payload;
    try {
      payload = JSON.parse(result.stdout.trim().split('\n').pop());
    } catch {
      failures.push({ lesson: where, reason: 'bad json', detail: result.stdout });
      continue;
    }

    if (payload.error) {
      failures.push({
        lesson: where,
        reason: 'solution error',
        detail: payload.error.split('\n').slice(-4).join('\n')
      });
      continue;
    }

    const failed = payload.results.filter(([, ok]) => !ok);
    if (failed.length) {
      failures.push({
        lesson: where,
        reason: `${failed.length} из ${payload.results.length} тестов`,
        detail: failed
          .map(([index, , message]) => `test ${index + 1}: ${message}\n${practice.tests[index]}`)
          .join('\n')
      });
    }
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

console.log(`✓ Практика: все ${checkedPractices} решений (уроки и шаги) проходят свои тесты.`);
