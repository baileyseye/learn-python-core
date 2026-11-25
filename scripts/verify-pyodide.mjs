import { loadPyodide } from 'pyodide';
import { lessons } from '../site/src/data/course.mjs';

const RUNNER = `
import io, json, traceback, contextlib, ast, inspect, builtins

def __browser_input(prompt=""):
    raise RuntimeError(
        "input() недоступен в браузерной практике. "
        "Передайте данные аргументами функции или запустите файл локально."
    )

builtins.input = __browser_input

async def __exec(code, namespace, filename):
    compiled = compile(code, filename, "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
    result = eval(compiled, namespace)
    if inspect.isawaitable(result):
        await result

async def __run(code, tests_json):
    tests = json.loads(tests_json)
    namespace = {"__name__": "__main__"}
    buffer = io.StringIO()
    error = None
    try:
        with contextlib.redirect_stdout(buffer):
            await __exec(code, namespace, "<practice>")
    except BaseException:
        error = traceback.format_exc()
    output = buffer.getvalue()
    namespace["stdout"] = output
    namespace["__stdout__"] = output
    results = []
    if error is None:
        for test in tests:
            try:
                await __exec(test, namespace, "<test>")
                results.append({"ok": True, "test": test, "message": ""})
            except AssertionError as exc:
                results.append({"ok": False, "test": test, "message": str(exc) or "assert не прошёл"})
            except BaseException as exc:
                results.append({"ok": False, "test": test, "message": type(exc).__name__ + ": " + str(exc)})
    return json.dumps({"output": output, "error": error, "results": results}, ensure_ascii=False)

await __run(__user_code, __tests_json)
`;

const pyodide = await loadPyodide();

const needsSqlite = lessons.some((lesson) => {
  const practices = [...(lesson.practice.steps ?? []), lesson.practice];
  return practices.some(
    (practice) =>
      practice.solution?.includes('import sqlite3') ||
      practice.tests?.some((test) => test.includes('import sqlite3'))
  );
});

if (needsSqlite) {
  await pyodide.loadPackage('sqlite3');
}

const failures = [];
let checked = 0;

for (const lesson of lessons) {
  const practices = [
    ...(lesson.practice.steps ?? []).map((step, index) => ({
      practice: step,
      label: `шаг ${index + 1}`
    })),
    { practice: lesson.practice, label: 'основная задача' }
  ];

  for (const { practice, label } of practices) {
    checked += 1;
    const where = `${lesson.id} (${label})`;
    try {
      pyodide.globals.set('__user_code', practice.solution ?? '');
      pyodide.globals.set('__tests_json', JSON.stringify(practice.tests ?? []));
      const raw = await pyodide.runPythonAsync(RUNNER);
      const payload = JSON.parse(raw);
      if (payload.error) {
        failures.push({ where, reason: 'solution error', detail: payload.error.split('\n').slice(-4).join('\n') });
        continue;
      }
      const failed = payload.results.filter((item) => !item.ok);
      if (failed.length) {
        failures.push({
          where,
          reason: `${failed.length} из ${payload.results.length} тестов`,
          detail: failed.map((item) => `${item.message}\n${item.test}`).join('\n')
        });
      }
    } catch (error) {
      failures.push({ where, reason: 'pyodide error', detail: String(error) });
    }
  }
}

if (failures.length) {
  console.error(`\n✖ Pyodide: ${failures.length} проблем(ы)\n`);
  for (const failure of failures) {
    console.error(`  ${failure.where}: ${failure.reason}`);
    console.error(`    ${failure.detail.replace(/\n/g, '\n    ')}\n`);
  }
  process.exit(1);
}

console.log(`✓ Pyodide: все ${checked} решений (уроки и шаги) проходят тесты в браузерной среде.`);
