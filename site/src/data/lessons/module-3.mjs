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
    id: 'custom-exceptions',
    title: 'Свои исключения',
    summary: 'Иерархия ошибок приложения и цепочки причин.',
    minutes: 8,
    goal:
      'Создавать собственные исключения, чтобы вызывающий код мог различать ошибки домена, а не разбирать текст сообщения.',
    ideas: [
      'Своё исключение — обычный класс, унаследованный от `Exception`.',
      'Базовый класс приложения позволяет ловить все свои ошибки одним `except`.',
      '`raise ... from error` сохраняет первопричину в `__cause__`.',
      'Сообщение должно объяснять, что произошло, а не просто повторять имя класса.'
    ],
    sources: [
      {
        file: 'errors/02_custom_exceptions.py',
        focus: [
          { function: 'validate_username', note: 'Доменная проверка через ValidationError.' },
          { function: 'find_user', note: 'Своё исключение и цепочка from.' },
          { function: 'UserNotFoundError', note: 'Исключение с дополнительным полем.' }
        ]
      }
    ],
    practice: {
      task:
        'Объяви `ValidationError(Exception)` и напиши `validate_age(age)`, который возвращает age, если 0 < age < 150, иначе поднимает ValidationError с понятным сообщением.',
      hint: 'Проверь тип и диапазон. Для поднятия используй `raise ValidationError("...")`.',
      starter: 'class ValidationError(Exception):\n    pass\n\n\ndef validate_age(age):\n    pass\n',
      solution:
        'class ValidationError(Exception):\n    pass\n\n\ndef validate_age(age):\n    if not isinstance(age, int):\n        raise ValidationError("возраст должен быть целым числом")\n    if not 0 < age < 150:\n        raise ValidationError("возраст должен быть от 1 до 149")\n    return age',
      tests: [
        'assert validate_age(27) == 27',
        'try:\n    validate_age(200)\nexcept ValidationError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValidationError")',
        'try:\n    validate_age("27")\nexcept ValidationError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValidationError для строки")'
      ]
    },
    quiz: [
      {
        q: 'Зачем наследовать своё исключение от общего базового класса?',
        options: ['Чтобы ускорить обработку', 'Чтобы ловить все ошибки домена одним except', 'Чтобы исключение стало unchecked', 'Это обязательно'],
        answer: 1,
        explain: 'Иерархия позволяет различать группы ошибок и при этом обрабатывать их общим обработчиком.'
      },
      {
        q: 'Что делает `raise NewError(...) from error`?',
        options: ['Удаляет старое исключение', 'Сохраняет исходную причину', 'Делает исключение глобальным', 'Печатает traceback'],
        answer: 1,
        explain: 'Исходное исключение остаётся доступным через `__cause__` и попадает в traceback.'
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
      task: 'Напиши `line_stats(text)`, возвращающую кортеж `(строки, слова, символы)` для переданного текста.',
      hint: '`splitlines()` даёт строки, `split()` — слова, `len(text)` — символы.',
      starter: 'def line_stats(text):\n    pass\n',
      solution:
        'def line_stats(text):\n    return len(text.splitlines()), len(text.split()), len(text)',
      tests: [
        'assert line_stats("one two\\nthree") == (2, 3, 13)',
        'assert line_stats("") == (0, 0, 0)',
        'assert line_stats("  \\n") == (1, 0, 3)'
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
      task:
        'Напиши `to_json(data)` с читаемой кириллицей и `from_json(text)`, возвращающую объект Python.',
      hint: 'Используй `json.dumps(data, ensure_ascii=False)` и `json.loads(text)`.',
      starter: 'import json\n\n\ndef to_json(data):\n    pass\n\n\ndef from_json(text):\n    pass\n',
      solution:
        'import json\n\n\ndef to_json(data):\n    return json.dumps(data, ensure_ascii=False)\n\n\ndef from_json(text):\n    return json.loads(text)',
      tests: [
        'assert from_json(to_json({"name": "Анна"})) == {"name": "Анна"}',
        'assert "Анна" in to_json({"name": "Анна"})',
        'assert from_json("[1, 2, 3]") == [1, 2, 3]'
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
  },
  {
    id: 'context-managers',
    title: 'Контекстные менеджеры',
    summary: 'with, __enter__/__exit__ и contextlib.contextmanager.',
    minutes: 8,
    goal:
      'Управлять ресурсами через `with` и писать свои контекстные менеджеры для повторяющейся подготовки и очистки.',
    ideas: [
      '`with` гарантирует вызов `__exit__` даже при исключении.',
      '`__exit__` получает тип, значение и traceback исключения.',
      'Возврат `True` из `__exit__` подавляет исключение.',
      '`@contextmanager` позволяет написать менеджер как генератор: до `yield` — вход, после — выход.'
    ],
    sources: [
      {
        file: 'errors/05_context_managers.py',
        focus: [
          { function: 'Timer', note: 'Класс с __enter__ и __exit__.' },
          { function: 'section', note: 'Контекстный менеджер через генератор.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши контекстный менеджер `suppress_errors(*types)`, который подавляет указанные исключения и возвращает объект с полем `error`.',
      hint: 'Используй `@contextmanager`. Сохрани исключение в списке или объекте, потому что после `yield` его можно перехватить через `try/except`.',
      starter: 'from contextlib import contextmanager\n\n\n@contextmanager\ndef suppress_errors(*types):\n    pass\n',
      solution:
        'from contextlib import contextmanager\n\n\nclass _Catcher:\n    def __init__(self):\n        self.error = None\n\n\n@contextmanager\ndef suppress_errors(*types):\n    catcher = _Catcher()\n    try:\n        yield catcher\n    except types as error:\n        catcher.error = error',
      tests: [
        'with suppress_errors(ValueError) as caught:\n    raise ValueError("boom")\nassert isinstance(caught.error, ValueError)',
        'with suppress_errors(ValueError) as caught:\n    pass\nassert caught.error is None',
        'try:\n    with suppress_errors(ValueError):\n        raise TypeError("not caught")\nexcept TypeError:\n    pass\nelse:\n    raise AssertionError("TypeError должен пройти дальше")'
      ]
    },
    quiz: [
      {
        q: 'Что произойдёт, если `__exit__` вернёт True?',
        options: ['Исключение будет подавлено', 'Исключение поднимется выше', 'Программа завершится', 'Будет SyntaxError'],
        answer: 0,
        explain: 'Истинное значение из `__exit__` означает, что исключение обработано.'
      },
      {
        q: 'Что делает `@contextmanager`?',
        options: ['Превращает генератор в контекстный менеджер', 'Закрывает файлы', 'Создаёт поток', 'Ускоряет with'],
        answer: 0,
        explain: 'Декоратор оборачивает генератор: код до `yield` — вход, после — выход.'
      }
    ]
  }
];
