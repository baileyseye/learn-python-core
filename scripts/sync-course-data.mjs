import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'python');
const OUT = path.join(ROOT, 'site', 'src', 'data', 'generated.json');
const COURSE = path.join(ROOT, 'site', 'src', 'data', 'course.mjs');
const CHECK = process.argv.includes('--check');

const { lessons } = await import(pathToFileURL(COURSE).href);

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function findPython() {
  const candidates =
    process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3', 'python'];
  for (const command of candidates) {
    const result = spawnSync(command, ['--version'], { encoding: 'utf8' });
    if (result.status === 0) return command;
  }
  return null;
}

const python = findPython();
if (!python) fail('Не найден Python. Установите Python 3.11+ и добавьте его в PATH.');

function runPython(args, options = {}) {
  return spawnSync(python, args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: options.timeout ?? 30_000,
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONDONTWRITEBYTECODE: '1',
      PYTHONUTF8: '1',
      PYTHONHASHSEED: '0'
    }
  });
}

/* ---------- структура файлов ---------- */

const extractor = path.join(__dirname, 'extract-sources.py');
const extracted = runPython(['-X', 'utf8', extractor, SRC], { timeout: 60_000 });

if (extracted.status !== 0) {
  fail(`Не удалось разобрать Python-файлы:\n${extracted.stderr || extracted.stdout}`);
}

let files;
try {
  files = JSON.parse(extracted.stdout);
} catch (error) {
  fail(`extract-sources.py вернул не JSON: ${error.message}`);
}

/* ---------- запуск примеров ---------- */

let previous = null;
if (fs.existsSync(OUT)) {
  try {
    previous = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  } catch {
    previous = null;
  }
}

for (const [file, entry] of Object.entries(files)) {
  const absolute = path.join(SRC, file);
  const run = runPython(['-X', 'utf8', absolute]);

  if (run.status === 0) {
    entry.output = (run.stdout ?? '').replace(/\r\n/g, '\n').replace(/\s+$/, '');
    entry.ok = true;
    entry.error = '';
  } else {
    const fallback = previous?.files?.[file];
    if (fallback?.ok && fallback.output) {
      entry.output = fallback.output;
      entry.ok = true;
      entry.error = `Запуск не удался, использован предыдущий вывод: ${(run.stderr || '').slice(0, 400)}`;
    } else {
      entry.output = '';
      entry.ok = false;
      entry.error = (run.stderr || run.stdout || 'неизвестная ошибка').slice(0, 2000);
    }
  }
}

/* ---------- проверка ссылок уроков ---------- */

const usedFiles = new Set();
let focusCount = 0;

for (const lesson of lessons) {
  for (const source of lesson.sources) {
    const entry = files[source.file];
    if (!entry) fail(`Урок ${lesson.id}: файл src/python/${source.file} не найден`);
    usedFiles.add(source.file);

    for (const focus of source.focus ?? []) {
      focusCount += 1;
      if (focus.full) continue;
      if (focus.lines) {
        const [start, end] = focus.lines;
        if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > entry.lines) {
          fail(`Урок ${lesson.id}: неверный диапазон строк ${start}-${end} в ${source.file}`);
        }
        continue;
      }
      if (focus.function) {
        const found = entry.methods.find((method) => method.name === focus.function);
        if (!found) {
          fail(
            `Урок ${lesson.id}: функция ${focus.function} не найдена в ${source.file}. ` +
              `Доступно: ${entry.methods.map((method) => method.name).join(', ')}`
          );
        }
        continue;
      }
      fail(`Урок ${lesson.id}: focus в ${source.file} не содержит function, lines или full`);
    }
  }
}

/* ---------- запись ---------- */

const sortedFiles = Object.fromEntries(
  Object.entries(files).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
);

const payload = {
  stats: {
    files: Object.keys(sortedFiles).length,
    lines: Object.values(sortedFiles).reduce((sum, file) => sum + file.lines, 0),
    methods: Object.values(sortedFiles).reduce((sum, file) => sum + file.methods.length, 0),
    classes: Object.values(sortedFiles).reduce((sum, file) => sum + file.classes.length, 0),
    outputs: Object.values(sortedFiles).filter((file) => file.ok).length,
    lessons: lessons.length,
    usedFiles: usedFiles.size
  },
  files: sortedFiles
};

const json = `${JSON.stringify(payload, null, 2)}\n`;

if (CHECK) {
  if (!fs.existsSync(OUT)) fail(`Нет ${path.relative(ROOT, OUT)}. Запустите npm run sync.`);
  const current = fs.readFileSync(OUT, 'utf8');

  // Вывод программ зависит от версии Python и окружения (например, урок про venv).
  // Проверяем структуру, код и успешность запуска, но не сравниваем сам stdout.
  const withoutOutputs = (value) => ({
    ...value,
    files: Object.fromEntries(
      Object.entries(value.files ?? {}).map(([file, entry]) => {
        const { output, error, ...rest } = entry;
        return [file, rest];
      })
    )
  });

  let parsed;
  try {
    parsed = JSON.parse(current);
  } catch {
    fail(`${path.relative(ROOT, OUT)} содержит некорректный JSON. Запустите npm run sync.`);
  }

  if (JSON.stringify(withoutOutputs(parsed)) !== JSON.stringify(withoutOutputs(payload))) {
    fail(
      `Данные курса устарели: ${path.relative(ROOT, OUT)} отличается от исходников. ` +
        'Запустите npm run sync и закоммитьте изменения.'
    );
  }
  console.log(`✓ generated.json актуален (${payload.stats.files} файлов, ${payload.stats.lessons} уроков)`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, json, 'utf8');

console.log(`✓ ${path.relative(ROOT, OUT)}`);
console.log(
  `  файлов: ${payload.stats.files}, строк: ${payload.stats.lines}, функций/методов: ${payload.stats.methods}, ` +
    `классов: ${payload.stats.classes}, уроков: ${payload.stats.lessons}, выводов: ${payload.stats.outputs}`
);
console.log(`  проверено focus-ссылок: ${focusCount}`);

const broken = Object.entries(sortedFiles).filter(([, file]) => !file.ok);
if (broken.length) {
  console.warn('\n⚠ Не все примеры запустились:');
  for (const [file, entry] of broken) {
    console.warn(`  ${file}: ${entry.error.split('\n').slice(-1)[0]}`);
  }
}
