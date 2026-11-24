import { EditorState, Prec } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  dropCursor,
  drawSelection,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine
} from '@codemirror/view';
import { history, historyKeymap, defaultKeymap, indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import {
  bracketMatching,
  indentOnInput,
  indentUnit,
  HighlightStyle,
  syntaxHighlighting
} from '@codemirror/language';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  closeCompletion,
  completionKeymap
} from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { tags } from '@lezer/highlight';

const DRAFT_KEY = 'lpc.practice.drafts.v1';
const SOLVED_KEY = 'lpc.practice.solved.v1';

const practiceTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent',
    color: 'var(--course-code-fg)',
    fontSize: '0.84rem'
  },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'var(--sl-font-mono)',
    lineHeight: '1.65'
  },
  '.cm-content': {
    padding: '0.8rem 0',
    caretColor: 'var(--course-accent-2)'
  },
  '.cm-line': { padding: '0 0.9rem' },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'rgba(200, 220, 255, 0.35)',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)'
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 0.7rem 0 0.4rem'
  },
  '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.035)' },
  '.cm-activeLineGutter': { backgroundColor: 'rgba(255, 255, 255, 0.035)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--course-accent-2)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'rgba(96, 165, 250, 0.14)'
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(255, 212, 59, 0.16)',
    outline: '1px solid rgba(255, 212, 59, 0.65)'
  },
  '.cm-tooltip': {
    backgroundColor: '#0d1728',
    color: '#e8effa',
    border: '1px solid rgba(148, 180, 220, 0.25)',
    zIndex: 30
  },
  '.cm-tooltip-autocomplete > ul': {
    fontFamily: 'var(--sl-font-mono)',
    fontSize: '0.78rem',
    maxHeight: '16rem'
  },
  '.cm-tooltip-autocomplete > ul > li': {
    padding: '0.3rem 0.65rem',
    lineHeight: '1.45'
  },
  '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
    backgroundColor: 'rgba(96, 165, 250, 0.18)',
    color: '#ffffff'
  },
  '.cm-completionMatchedText': {
    color: 'var(--course-accent-2)',
    fontWeight: '700',
    textDecoration: 'none'
  },
  '.cm-completionDetail': {
    marginLeft: '0.6rem',
    color: 'rgba(200, 220, 255, 0.55)',
    fontSize: '0.72rem'
  }
});

const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#ffb86b' },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: '#e8effa' },
  { tag: [tags.function(tags.variableName), tags.labelName], color: '#7dd3fc' },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#fbbf24' },
  { tag: [tags.definition(tags.name), tags.separator], color: '#f9a8d4' },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#c4b5fd' },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link], color: '#93c5fd' },
  { tag: [tags.meta, tags.comment], color: '#64748b', fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: '700' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.link, color: '#7dd3fc', textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: '700', color: '#fbbf24' },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#fbbf24' },
  { tag: [tags.processingInstruction, tags.string, tags.inserted], color: '#a7f3d0' },
  { tag: tags.invalid, color: '#fca5a5' }
]);

const SNIPPETS = [
  { label: 'def', detail: 'функция', apply: 'def name(args):\n    ' },
  { label: 'class', detail: 'класс', apply: 'class Name:\n    def __init__(self):\n        ' },
  { label: 'for', detail: 'цикл по коллекции', apply: 'for item in items:\n    ' },
  { label: 'range', detail: 'диапазон', apply: 'for index in range(len(items)):\n    ' },
  { label: 'if', detail: 'условие', apply: 'if condition:\n    ' },
  { label: 'try', detail: 'обработка ошибки', apply: 'try:\n    pass\nexcept ValueError:\n    pass' },
  { label: 'with', detail: 'контекстный менеджер', apply: 'with open(path, encoding="utf-8") as file:\n    ' },
  { label: 'print', detail: 'вывод', apply: 'print()' },
  { label: 'fstr', detail: 'f-строка', apply: 'f"{value}"' },
  { label: 'comp', detail: 'list comprehension', apply: '[item for item in items if condition]' },
  { label: 'dictcomp', detail: 'dict comprehension', apply: '{key: value for key, value in items}' },
  { label: 'dataclass', detail: 'dataclass', apply: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Name:\n    field: str' },
  { label: 'lambda', detail: 'анонимная функция', apply: 'lambda value: value' },
  { label: 'enumerate', detail: 'индекс и значение', apply: 'for index, item in enumerate(items):\n    ' }
];

function pythonCompletions(context) {
  const word = context.matchBefore(/[\w.]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;
  return {
    from: word.from,
    options: SNIPPETS.map((item) => ({
      label: item.label,
      type: 'keyword',
      detail: item.detail,
      apply: item.apply
    }))
  };
}

function readJson(node, fallback) {
  if (!node) return fallback;
  try {
    return JSON.parse(node.textContent || '');
  } catch {
    return fallback;
  }
}

function readStore(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

/* ---------- Pyodide worker ---------- */

const PYODIDE_VERSION = '0.27.7';
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

const PYTHON_RUNNER = `
import io, json, traceback, contextlib

def __run(code, tests_json):
    tests = json.loads(tests_json)
    namespace = {"__name__": "__main__"}
    buffer = io.StringIO()
    error = None
    try:
        with contextlib.redirect_stdout(buffer):
            exec(compile(code, "<practice>", "exec"), namespace)
    except BaseException:
        error = traceback.format_exc()
    output = buffer.getvalue()
    namespace["stdout"] = output
    namespace["__stdout__"] = output
    results = []
    if error is None:
        for test in tests:
            try:
                exec(compile(test, "<test>", "exec"), namespace)
                results.append({"ok": True, "test": test, "message": ""})
            except AssertionError as exc:
                results.append({"ok": False, "test": test, "message": str(exc) or "assert не прошёл"})
            except BaseException as exc:
                results.append({"ok": False, "test": test, "message": type(exc).__name__ + ": " + str(exc)})
    return json.dumps({"output": output, "error": error, "results": results}, ensure_ascii=False)

__run(__user_code, __tests_json)
`;

const WORKER_SOURCE = `
const INDEX_URL = ${JSON.stringify(PYODIDE_INDEX)};
const RUNNER = ${JSON.stringify(PYTHON_RUNNER)};

self.onmessage = async (event) => {
  const { id, code, tests } = event.data;
  try {
    if (!self.pyodide) {
      importScripts(INDEX_URL + 'pyodide.js');
      self.pyodide = await loadPyodide({ indexURL: INDEX_URL });
    }
    self.pyodide.globals.set('__user_code', code);
    self.pyodide.globals.set('__tests_json', JSON.stringify(tests));
    const raw = self.pyodide.runPython(RUNNER);
    self.postMessage({ id, type: 'result', payload: JSON.parse(raw) });
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      message: String((error && error.message) || error)
    });
  }
};
`;

let worker = null;
let workerUrl = null;
let sequence = 0;
let pyodideUnavailable = false;
const pending = new Map();

function getWorker() {
  if (worker) return worker;
  const blob = new Blob([WORKER_SOURCE], { type: 'text/javascript' });
  workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  worker.onmessage = (event) => {
    const { id, type, payload, message } = event.data || {};
    const job = pending.get(id);
    if (!job) return;
    pending.delete(id);
    clearTimeout(job.timer);
    if (type === 'result') job.resolve(payload);
    else job.reject(new Error(message || 'Ошибка Python-среды'));
  };
  worker.onerror = (event) => {
    const error = new Error(event.message || 'Не удалось запустить Python в браузере');
    for (const job of pending.values()) {
      clearTimeout(job.timer);
      job.reject(error);
    }
    pending.clear();
    resetWorker();
  };
  return worker;
}

function resetWorker() {
  if (worker) worker.terminate();
  if (workerUrl) URL.revokeObjectURL(workerUrl);
  worker = null;
  workerUrl = null;
}

function runPython(code, tests) {
  if (pyodideUnavailable) return Promise.reject(new Error('Pyodide недоступен'));
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {
      pending.delete(id);
      resetWorker();
      reject(new Error('Python не ответил за 60 секунд'));
    }, 60_000);
    pending.set(id, { resolve, reject, timer });
    try {
      getWorker().postMessage({ id, code, tests });
    } catch (error) {
      pending.delete(id);
      clearTimeout(timer);
      reject(error);
    }
  });
}

/* ---------- static fallback ---------- */

function normalize(code) {
  return String(code)
    .replace(/#.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function balanced(code) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  let quote = null;
  let escaped = false;
  for (const char of code) {
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '(' || char === '[' || char === '{') stack.push(char);
    if (char in pairs && stack.pop() !== pairs[char]) return false;
  }
  return !quote && stack.length === 0;
}

function similarity(a, b) {
  const left = new Set(normalize(a).split(' '));
  const right = new Set(normalize(b).split(' '));
  if (!left.size && !right.size) return 1;
  let common = 0;
  for (const token of left) if (right.has(token)) common += 1;
  return (2 * common) / (left.size + right.size);
}

function staticReview(code, solution) {
  const problems = [];
  if (!code.trim()) problems.push('Код пустой.');
  if (!balanced(code)) problems.push('Не сбалансированы скобки или кавычки.');
  if (/\bTODO\b/.test(code)) problems.push('Остался TODO.');
  if (/^\s*pass\s*$/m.test(code) && normalize(code).split(' ').length < 6) {
    problems.push('В решении остался только pass.');
  }
  if (!problems.length && similarity(code, solution) < 0.45) {
    problems.push('Код заметно отличается от эталонного решения.');
  }
  return problems;
}

/* ---------- UI ---------- */

function setStatus(card, text, state) {
  const badge = card.querySelector('[data-practice-status]');
  if (!badge) return;
  badge.textContent = text;
  if (state) badge.dataset.state = state;
  else delete badge.dataset.state;
}

function setFeedback(card, text, state) {
  const feedback = card.querySelector('[data-practice-feedback]');
  if (!feedback) return;
  feedback.textContent = text;
  feedback.dataset.state = state || '';
}

function renderResult(card, result, tests) {
  const panel = card.querySelector('[data-practice-result]');
  if (!panel) return;
  panel.hidden = false;
  panel.replaceChildren();

  if (result.error) {
    const title = document.createElement('p');
    title.className = 'practice-result-title is-error';
    title.textContent = 'Код остановился с ошибкой';
    const pre = document.createElement('pre');
    pre.className = 'practice-traceback';
    pre.textContent = result.error.trim();
    panel.append(title, pre);
  }

  if (result.results?.length) {
    const title = document.createElement('p');
    title.className = 'practice-result-title';
    const passed = result.results.filter((item) => item.ok).length;
    title.textContent = `Проверки: ${passed} из ${result.results.length}`;
    const list = document.createElement('ul');
    list.className = 'practice-tests';
    result.results.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = item.ok ? 'is-ok' : 'is-fail';
      const icon = document.createElement('span');
      icon.className = 'practice-test-icon';
      icon.textContent = item.ok ? '✓' : '×';
      const body = document.createElement('div');
      const code = document.createElement('code');
      code.textContent = tests[index] || item.test;
      body.append(code);
      if (!item.ok && item.message) {
        const message = document.createElement('p');
        message.textContent = item.message;
        body.append(message);
      }
      li.append(icon, body);
      list.append(li);
    });
    panel.append(title, list);
  }

  if (result.output?.trim()) {
    const label = document.createElement('p');
    label.className = 'practice-output-label';
    label.textContent = 'stdout';
    const pre = document.createElement('pre');
    pre.className = 'practice-output';
    const output = result.output.trim();
    pre.textContent = output.length > 4000 ? `${output.slice(0, 4000)}\n… вывод обрезан` : output;
    panel.append(label, pre);
  }

  if (!result.error && !result.results?.length && !result.output?.trim()) {
    const empty = document.createElement('p');
    empty.className = 'practice-result-empty';
    empty.textContent = 'Код выполнился без вывода и без проверок.';
    panel.append(empty);
  }
}

function renderStatic(card, problems, solvedByShape) {
  const panel = card.querySelector('[data-practice-result]');
  if (!panel) return;
  panel.hidden = false;
  panel.replaceChildren();

  const note = document.createElement('p');
  note.className = 'practice-static';
  note.textContent =
    'Python-среда не загрузилась, поэтому проверка структурная. Она не выполняет код. ' +
    'Для настоящего запуска нужен интернет: Pyodide скачивается с CDN.';
  panel.append(note);

  if (problems.length) {
    const list = document.createElement('ul');
    list.className = 'practice-tests';
    for (const problem of problems) {
      const li = document.createElement('li');
      li.className = 'is-fail';
      const icon = document.createElement('span');
      icon.className = 'practice-test-icon';
      icon.textContent = '×';
      const code = document.createElement('code');
      code.textContent = problem;
      li.append(icon, code);
      list.append(li);
    }
    panel.append(list);
  } else if (solvedByShape) {
    const list = document.createElement('ul');
    list.className = 'practice-tests';
    const li = document.createElement('li');
    li.className = 'is-ok';
    const icon = document.createElement('span');
    icon.className = 'practice-test-icon';
    icon.textContent = '✓';
    const code = document.createElement('code');
    code.textContent = 'Структура кода похожа на решение. Запустите проверку с интернетом, чтобы выполнить тесты.';
    li.append(icon, code);
    list.append(li);
    panel.append(list);
  }
}

const editors = new WeakMap();

async function initCard(card) {
  if (card.dataset.ready === 'true' || card.dataset.initializing === 'true') return;
  card.dataset.initializing = 'true';

  const lessonId = card.dataset.lessonId;
  const starter = readJson(card.querySelector('[data-practice-starter]'), '');
  const tests = readJson(card.querySelector('[data-practice-tests]'), []);
  const solution = readJson(card.querySelector('[data-practice-solution]'), '');
  const drafts = readStore(DRAFT_KEY);
  const solved = readStore(SOLVED_KEY);
  const initial = drafts[lessonId] ?? starter;

  if (solved[lessonId]) setStatus(card, 'решено', 'solved');

  const mount = card.querySelector('[data-practice-codemirror]');
  if (!mount) return;

  // CodeMirror измеряет ширину символов и высоту строк по фактическому шрифту.
  // Без ожидания загрузки JetBrains Mono каретка и клики уезжают.
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* работаем со шрифтом по умолчанию */
    }
  }

  card.dataset.ready = 'true';

  const save = (value) => {
    const store = readStore(DRAFT_KEY);
    store[lessonId] = value;
    writeStore(DRAFT_KEY, store);
  };

  const view = new EditorView({
    parent: mount,
    state: EditorState.create({
      doc: initial,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        EditorState.tabSize.of(4),
        indentOnInput(),
        indentUnit.of('    '),
        syntaxHighlighting(highlightStyle),
        bracketMatching(),
        closeBrackets(),
        autocompletion({ override: [pythonCompletions] }),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        python(),
        EditorView.lineWrapping,
        practiceTheme,
        // Клик по коду должен сразу начинать выделение, а не попадать
        // в открытый попап автодополнения.
        EditorView.domEventHandlers({
          mousedown: (event, view) => {
            closeCompletion(view);
            return false;
          }
        }),
        EditorView.contentAttributes.of({ 'aria-label': 'Твой код' }),
        Prec.highest(
          keymap.of([
            {
              key: 'Ctrl-Enter',
              mac: 'Cmd-Enter',
              run: () => {
                check(card);
                return true;
              }
            },
            {
              key: 'Mod-Enter',
              run: () => {
                check(card);
                return true;
              }
            }
          ])
        ),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...completionKeymap,
          indentWithTab
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) save(update.state.doc.toString());
        })
      ]
    })
  });

  editors.set(card, view);

  // После вставки в DOM и подгрузки шрифта пересчитываем координаты строк.
  view.requestMeasure();
  window.addEventListener('load', () => view.requestMeasure(), { once: true });
  document.fonts?.ready.then(() => view.requestMeasure()).catch(() => {});

  card.querySelector('[data-practice-check]')?.addEventListener('click', () => check(card));
  card.querySelector('[data-practice-reset]')?.addEventListener('click', () => {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: starter } });
    save(starter);
    const panel = card.querySelector('[data-practice-result]');
    if (panel) {
      panel.hidden = true;
      panel.replaceChildren();
    }
    const solvedNow = readStore(SOLVED_KEY)[lessonId];
    setFeedback(card, 'Черновик сброшен.', '');
    setStatus(card, solvedNow ? 'решено' : 'черновик', solvedNow ? 'solved' : '');
  });

  async function runCheck() {
    const code = view.state.doc.toString();
    const panel = card.querySelector('[data-practice-result]');
    const button = card.querySelector('[data-practice-check]');
    if (panel) {
      panel.hidden = false;
      panel.replaceChildren();
      const loading = document.createElement('p');
      loading.className = 'practice-loading';
      loading.textContent = 'Загружаем Python-среду и выполняем код… Первый запуск занимает несколько секунд.';
      panel.append(loading);
    }
    if (button) {
      button.disabled = true;
      button.dataset.loading = 'true';
    }
    setStatus(card, 'выполняется', 'running');
    setFeedback(card, 'Код отправлен в браузерную среду Python.', '');

    try {
      const result = await runPython(code, tests);
      renderResult(card, result, tests);
      const passed = result.results?.filter((item) => item.ok).length ?? 0;
      const total = result.results?.length ?? 0;
      if (result.error) {
        setStatus(card, 'ошибка', 'error');
        setFeedback(card, 'Исправьте ошибку и запустите снова.', 'error');
      } else if (total && passed === total) {
        const store = readStore(SOLVED_KEY);
        store[lessonId] = true;
        writeStore(SOLVED_KEY, store);
        setStatus(card, 'решено', 'solved');
        setFeedback(card, `Все проверки пройдены: ${passed}/${total}.`, 'success');
      } else if (total) {
        setStatus(card, 'есть ошибки', 'error');
        setFeedback(card, `Пройдено ${passed} из ${total}. Посмотрите сообщения под тестами.`, 'error');
      } else {
        setStatus(card, 'выполнено', 'solved');
        setFeedback(card, 'Код выполнился. Проверьте вывод.', 'success');
      }
    } catch (error) {
      pyodideUnavailable = true;
      const problems = staticReview(code, solution);
      renderStatic(card, problems, problems.length === 0);
      setStatus(card, 'статическая проверка', 'static');
      setFeedback(
        card,
        'Python-среда недоступна. Проверена только структура кода — тесты не выполнялись.',
        'error'
      );
    } finally {
      if (button) {
        button.disabled = false;
        delete button.dataset.loading;
      }
    }
  }

  card.__check = runCheck;
}

function check(card) {
  if (typeof card.__check === 'function') card.__check();
}

function initAll() {
  document.querySelectorAll('[data-practice]').forEach(initCard);
}

document.addEventListener('DOMContentLoaded', initAll);
document.addEventListener('astro:page-load', initAll);
initAll();
