export default [
  {
    id: 'exceptions',
    title: 'Исключения',
    summary: 'try/except/else/finally и конкретные ошибки вместо «поймать всё».',
    minutes: 10,
    goal:
      'Понять, как Python сообщает об ошибках, ловить только ожидаемые исключения и не прятать настоящие баги.',
    ideas: [
      'Исключение — объект, который поднимается вверх по стеку до первого подходящего `except`.',
      'Ловить `Exception` без причины опасно: так можно скрыть ошибку в собственной логике.',
      '`else` выполняется, если исключения не было; `finally` — всегда.',
      '`raise` без аргумента повторно поднимает текущее исключение.'
    ],
    sources: [
      {
        file: 'errors/01_exceptions.py',
        focus: [
          { function: 'safe_divide', note: 'Полная конструкция try/except/else/finally.' },
          { function: 'parse_age', note: 'Конкретное исключение и проверка значения.' },
          { function: 'read_value', note: 'EAFP: попробовать и обработать KeyError.' }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. default и TypeError',
      steps: [
        {
          label: 'Шаг 1. Просто int',
          task: 'Напиши `to_int(value)` — вернуть `int(value)`.',
          hint: '`return int(value)`.',
          starter: 'def to_int(value):\n    pass\n',
          solution: 'def to_int(value):\n    return int(value)\n',
          tests: [
            'assert to_int("42") == 42',
            'assert to_int(3.9) == 3'
          ]
        },
        {
          label: 'Шаг 2. Поймать ValueError',
          task: 'Напиши `to_int_or_zero(value)` — вернуть число или 0, если преобразование невозможно из-за `ValueError`.',
          hint: 'Оберни `int(value)` в `try`, а в `except ValueError` верни 0.',
          starter: 'def to_int_or_zero(value):\n    pass\n',
          solution: 'def to_int_or_zero(value):\n    try:\n        return int(value)\n    except ValueError:\n        return 0\n',
          tests: [
            'assert to_int_or_zero("42") == 42',
            'assert to_int_or_zero("сорок") == 0'
          ]
        }
      ],
      task:
        'Напиши `safe_int(value, default=0)`: преобразуй значение в int, а при `ValueError` или `TypeError` верни default.',
      hint: 'Лови оба типа в одном `except (ValueError, TypeError):`.',
      starter: 'def safe_int(value, default=0):\n    pass\n',
      solution:
        'def safe_int(value, default=0):\n    try:\n        return int(value)\n    except (ValueError, TypeError):\n        return default',
      tests: [
        'assert safe_int("42") == 42',
        'assert safe_int("сорок") == 0',
        'assert safe_int(None, -1) == -1',
        'assert safe_int(3.9) == 3'
      ]
    },
    quiz: [
      {
        q: 'Когда выполняется блок `finally`?',
        options: ['Только при успехе', 'Только при ошибке', 'Всегда', 'Только при return'],
        answer: 2,
        explain: '`finally` выполняется при любом выходе из try, включая исключение и return.'
      },
      {
        q: 'Почему `except Exception: pass` считается плохой практикой?',
        options: ['Он медленный', 'Он скрывает неожиданные ошибки', 'Он не работает в Python 3', 'Он ловит только ValueError'],
        answer: 1,
        explain: 'Такой блок проглотит любую ошибку, и вы потеряете информацию о настоящей причине.'
      }
    ]
  },

  {
    id: 'files',
    title: 'Файлы',
    summary: 'open, with, UTF-8 и обход строк.',
    minutes: 10,
    goal:
      'Читать и записывать текстовые файлы безопасно, не забывая закрывать их и указывать кодировку.',
    ideas: [
      '`with open(...) as file` закрывает файл даже при исключении.',
      'Кодировку лучше указывать явно: `encoding="utf-8"`.',
      'Итерация по файлу идёт по строкам и не загружает весь файл в память.',
      '`Path` из `pathlib` делает работу с путями кроссплатформенной.'
    ],
    sources: [
      {
        file: 'errors/03_files.py',
        focus: [
          { function: 'write_and_read', note: 'Запись и чтение через with.' },
          { function: 'append_line', note: 'Режим добавления a.' },
          { function: 'count_words', note: 'Потоковый подсчёт слов.' }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. Статистика файла',
      steps: [
        {
          label: 'Шаг 1. Непустые строки',
          task: 'Напиши `non_empty_lines(handle)` — список строк без `\\n`, в которых есть текст.',
          hint: 'Перебери файл через `for line in handle`, используй `line.strip()` для проверки.',
          starter: 'def non_empty_lines(handle):\n    pass\n',
          solution: 'def non_empty_lines(handle):\n    result = []\n    for line in handle:\n        text = line.rstrip("\\n")\n        if text.strip():\n            result.append(text)\n    return result\n',
          tests: [
            'import io\nassert non_empty_lines(io.StringIO("one\\n\\ntwo\\n")) == ["one", "two"]',
            'assert non_empty_lines(io.StringIO("")) == []'
          ]
        },
        {
          label: 'Шаг 2. Самая длинная',
          task: 'Напиши `longest(lines)` — самую длинную строку или пустую строку.',
          hint: '`max(lines, key=len)`; не забудь пустой список.',
          starter: 'def longest(lines):\n    pass\n',
          solution: 'def longest(lines):\n    return max(lines, key=len) if lines else ""\n',
          tests: [
            'assert longest(["one", "longer", "two"]) == "longer"',
            'assert longest([]) == ""'
          ]
        }
      ],
      task: 'Напиши `count_lines(handle)` — количество непустых строк в файловом объекте, и `longest_line(handle)` — самую длинную строку без символа перевода строки.',
      hint: 'Файловый объект можно перебирать в `for line in handle`. Для длины строки убери `"\\n"` через `rstrip`.',
      starter: 'def count_lines(handle):\n    pass\n\n\ndef longest_line(handle):\n    pass\n',
      solution: 'def count_lines(handle):\n    count = 0\n    for line in handle:\n        if line.strip():\n            count += 1\n    return count\n\n\ndef longest_line(handle):\n    lines = [line.rstrip("\\n") for line in handle]\n    return max(lines, key=len) if lines else ""\n',
      tests: [
        'import io\nassert count_lines(io.StringIO("one\\n\\ntwo\\n")) == 2',
        'assert longest_line(io.StringIO("one\\nlonger\\ntwo\\n")) == "longer"',
        'assert longest_line(io.StringIO("")) == ""'
      ]
    },
    quiz: [
      {
        q: 'Зачем использовать `with open(...)`?',
        options: ['Файл быстрее читается', 'Файл закроется автоматически', 'Появляется кодировка по умолчанию', 'Это единственный способ открыть файл'],
        answer: 1,
        explain: 'Контекстный менеджер закрывает файл даже при ошибке.'
      },
      {
        q: 'Что делает режим `"a"`?',
        options: ['Читает файл', 'Перезаписывает файл', 'Добавляет в конец', 'Удаляет файл'],
        answer: 2,
        explain: '`"a"` открывает файл для добавления, создавая его при необходимости.'
      }
    ]
  },
  {
    id: 'json-csv',
    title: 'JSON и CSV',
    summary: 'Сериализация данных и обмен с другими программами.',
    minutes: 9,
    goal:
      'Превращать структуры Python в JSON и обратно, а табличные данные читать и писать через CSV.',
    ideas: [
      '`json.dumps` превращает объект в строку, `json.loads` — обратно.',
      '`ensure_ascii=False` сохраняет кириллицу читаемой.',
      '`csv.DictWriter` пишет строки по именам колонок, `DictReader` читает их как словари.',
      'JSON поддерживает не все типы Python: даты и множества нужно преобразовывать заранее.'
    ],
    sources: [
      {
        file: 'errors/04_json_csv.py',
        focus: [
          { function: 'demonstrate_json', note: 'dumps/loads и кириллица.' },
          { function: 'demonstrate_csv', note: 'DictWriter и DictReader в памяти.' },
          { function: 'to_json_line', note: 'Формат JSON Lines.' }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. JSON и CSV',
      steps: [
        {
          label: 'Шаг 1. JSON → Python',
          task: 'Напиши `read_json(text)` — разобрать JSON-строку.',
          hint: '`json.loads(text)`.',
          starter: 'import json\n\n\ndef read_json(text):\n    pass\n',
          solution: 'import json\n\n\ndef read_json(text):\n    return json.loads(text)\n',
          tests: [
            'assert read_json("[1, 2, 3]") == [1, 2, 3]',
            'assert read_json("{\\"name\\": \\"Анна\\"}") == {"name": "Анна"}'
          ]
        },
        {
          label: 'Шаг 2. Python → JSON',
          task: 'Напиши `write_json(data)` — JSON с читаемой кириллицей.',
          hint: '`json.dumps(data, ensure_ascii=False)`.',
          starter: 'import json\n\n\ndef write_json(data):\n    pass\n',
          solution: 'import json\n\n\ndef write_json(data):\n    return json.dumps(data, ensure_ascii=False)\n',
          tests: [
            'assert "Анна" in write_json({"name": "Анна"})',
            'assert json.loads(write_json({"x": 1})) == {"x": 1}'
          ]
        }
      ],
      task:
        'Напиши `to_json(data)` с читаемой кириллицей, `from_json(text)` и `parse_csv(text)` — список словарей из CSV с заголовком.',
      hint: 'Для JSON используй `json.dumps(..., ensure_ascii=False)` и `json.loads`. Для CSV — `csv.DictReader(io.StringIO(text))`.',
      starter: 'import csv\nimport io\nimport json\n\n\ndef to_json(data):\n    pass\n\n\ndef from_json(text):\n    pass\n\n\ndef parse_csv(text):\n    pass\n',
      solution: 'import csv\nimport io\nimport json\n\n\ndef to_json(data):\n    return json.dumps(data, ensure_ascii=False)\n\n\ndef from_json(text):\n    return json.loads(text)\n\n\ndef parse_csv(text):\n    return list(csv.DictReader(io.StringIO(text)))\n',
      tests: [
        'assert from_json(to_json({"name": "Анна"})) == {"name": "Анна"}',
        'assert "Анна" in to_json({"name": "Анна"})',
        'assert parse_csv("name,age\\nАнна,27\\n") == [{"name": "Анна", "age": "27"}]',
        'assert parse_csv("") == []'
      ]
    },
    quiz: [
      {
        q: 'Что делает `ensure_ascii=False`?',
        options: ['Ломает JSON', 'Оставляет кириллицу как есть', 'Сжимает строку', 'Сортирует ключи'],
        answer: 1,
        explain: 'Без этой опции не-ASCII символы экранируются последовательностями `\\uXXXX`.'
      },
      {
        q: 'Какой формат удобен для построчной обработки больших логов?',
        options: ['Один большой JSON-массив', 'JSON Lines: один объект на строку', 'CSV без заголовка', 'YAML'],
        answer: 1,
        explain: 'JSON Lines позволяет читать и писать по одной записи, не загружая всё в память.'
      }
    ]
  }

];