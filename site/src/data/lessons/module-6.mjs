export default [
  {
    id: 'datetime',
    title: 'Дата и время',
    summary: 'date, datetime, timedelta, форматирование и часовые пояса.',
    minutes: 9,
    goal:
      'Считать даты, разбирать строки в даты и не путать локальное время с UTC.',
    ideas: [
      '`date` хранит дату, `datetime` — дату и время, `timedelta` — разницу.',
      'Вычитание дат даёт `timedelta`, у которого есть `.days` и `.total_seconds()`.',
      '`strftime` форматирует дату в строку, `strptime` разбирает строку по шаблону.',
      'Для часовых поясов используйте aware-объекты с `tzinfo`, а не наивное локальное время.'
    ],
    sources: [
      {
        file: 'stdlib/01_datetime.py',
        focus: [
          { function: 'demonstrate_dates', note: 'Разница дат и timedelta.' },
          { function: 'demonstrate_formatting', note: 'strftime и strptime.' },
          { function: 'demonstrate_timezones', note: 'UTC и переход в другой пояс.' },
          { function: 'working_days', note: 'Подсчёт будних дней.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `days_between(first, second)` для двух дат в формате `"2026-11-01"` и `format_date(value)` → `"01.11.2026"`.',
      hint: 'Используй `datetime.date.fromisoformat` и `strftime("%d.%m.%Y")`.',
      starter: 'from datetime import date\n\n\ndef days_between(first, second):\n    pass\n\n\ndef format_date(value):\n    pass\n',
      solution:
        'from datetime import date\n\n\ndef days_between(first, second):\n    start = date.fromisoformat(first)\n    end = date.fromisoformat(second)\n    return abs((end - start).days)\n\n\ndef format_date(value):\n    return date.fromisoformat(value).strftime("%d.%m.%Y")',
      tests: [
        'assert days_between("2026-11-01", "2026-11-10") == 9',
        'assert days_between("2026-11-10", "2026-11-01") == 9',
        'assert format_date("2026-11-25") == "25.11.2026"'
      ]
    },
    quiz: [
      {
        q: 'Что вернёт вычитание двух `date`?',
        options: ['int', 'timedelta', 'datetime', 'str'],
        answer: 1,
        explain: 'Разница дат — объект `timedelta`; количество дней доступно через `.days`.'
      },
      {
        q: 'Зачем нужны aware-даты?',
        options: ['Они быстрее', 'Они учитывают часовой пояс', 'Они всегда в UTC', 'Они не поддерживают форматирование'],
        answer: 1,
        explain: 'Aware-объекты содержат информацию о поясе и корректно сравниваются между собой.'
      }
    ]
  },
  {
    id: 'collections-stdlib',
    title: 'collections',
    summary: 'Counter, defaultdict и deque вместо ручных структур.',
    minutes: 9,
    goal:
      'Использовать специализированные контейнеры стандартной библиотеки для подсчёта, группировки и очередей.',
    ideas: [
      '`Counter` считает частоты и умеет отдавать `most_common`.',
      '`defaultdict(list)` создаёт пустой список при обращении к новому ключу.',
      '`deque` быстро добавляет и удаляет с обоих концов; `maxlen` задаёт окно.',
      'Специализированный контейнер часто заменяет 5–10 строк ручной логики.'
    ],
    sources: [
      {
        file: 'stdlib/02_collections.py',
        focus: [
          { function: 'demonstrate_counter', note: 'Подсчёт частот и топ элементов.' },
          { function: 'group_by_first_letter', note: 'defaultdict(list) для группировки.' },
          { function: 'sliding_window', note: 'deque с maxlen.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `group_by_first_letter(words)`, возвращающую обычный словарь: первая буква → список слов.',
      hint: 'Используй `defaultdict(list)` и `dict(result)` в конце, чтобы вернуть обычный словарь.',
      starter: 'from collections import defaultdict\n\n\ndef group_by_first_letter(words):\n    pass\n',
      solution:
        'from collections import defaultdict\n\n\ndef group_by_first_letter(words):\n    groups = defaultdict(list)\n    for word in words:\n        groups[word[0]].append(word)\n    return dict(groups)',
      tests: [
        'assert group_by_first_letter(["анна", "борис", "алла"]) == {"а": ["анна", "алла"], "б": ["борис"]}',
        'assert group_by_first_letter([]) == {}',
        'assert group_by_first_letter(["кот"]) == {"к": ["кот"]}'
      ]
    },
    quiz: [
      {
        q: 'Чем `defaultdict(list)` удобен для группировки?',
        options: ['Сортирует ключи', 'Создаёт пустой список для нового ключа', 'Удаляет дубликаты', 'Хранит только строки'],
        answer: 1,
        explain: 'Не нужно проверять наличие ключа перед `append`.'
      },
      {
        q: 'Где `deque` быстрее списка?',
        options: ['При доступе по индексу', 'При добавлении и удалении с концов', 'При сортировке', 'При поиске по значению'],
        answer: 1,
        explain: '`deque` оптимизирован для операций с обоих концов.'
      }
    ]
  },
  {
    id: 'regex',
    title: 'Регулярные выражения',
    summary: 'Поиск, группы, замена и разбор строк через re.',
    minutes: 10,
    goal:
      'Извлекать данные из текста регулярными выражениями и понимать, когда лучше обойтись строковыми методами.',
    ideas: [
      '`re.search` ищет первое совпадение, `re.findall` — все.',
      'Скобки создают группы, а `(?P<name>...)` — именованные группы.',
      '`re.sub` заменяет совпадения; в замене можно ссылаться на группы.',
      'Скомпилированный шаблон `re.compile` удобно переиспользовать.'
    ],
    sources: [
      {
        file: 'stdlib/03_regex.py',
        focus: [
          { function: 'demonstrate_search', note: 'Поиск email в тексте.' },
          { function: 'demonstrate_groups', note: 'Группы и именованные группы.' },
          { function: 'demonstrate_sub', note: 'Замена и маска телефона.' },
          { function: 'parse_log_line', note: 'Разбор лога на поля.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `extract_emails(text)` — список email и `normalize_phone(text)` — только цифры из телефона.',
      hint: 'Для email подойдёт `[\\w.+-]+@[\\w-]+\\.[\\w.]+`. Для телефона замени всё нецифровое через `re.sub(r"\\D", "", text)`.',
      starter: 'import re\n\n\ndef extract_emails(text):\n    pass\n\n\ndef normalize_phone(text):\n    pass\n',
      solution:
        'import re\n\n\ndef extract_emails(text):\n    return re.findall(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+", text)\n\n\ndef normalize_phone(text):\n    return re.sub(r"\\D", "", text)',
      tests: [
        'assert extract_emails("a@example.com и b@test.org") == ["a@example.com", "b@test.org"]',
        'assert extract_emails("нет почты") == []',
        'assert normalize_phone("+7 (999) 123-45-67") == "79991234567"'
      ]
    },
    quiz: [
      {
        q: 'Чем `re.search` отличается от `re.match`?',
        options: ['search ищет в любом месте, match — с начала строки', 'match ищет все совпадения', 'search работает только с числами', 'Ничем'],
        answer: 0,
        explain: '`match` привязан к началу строки, `search` просматривает всю строку.'
      },
      {
        q: 'Что делает `(?P<name>...)`?',
        options: ['Комментарий', 'Именованную группу', 'Повторение', 'Опциональную группу'],
        answer: 1,
        explain: 'Такая группа доступна по имени через `groupdict()`.'
      }
    ]
  },
  {
    id: 'random-statistics',
    title: 'random и statistics',
    summary: 'Воспроизводимые случайности и описательная статистика.',
    minutes: 8,
    goal:
      'Генерировать случайные данные с контролем воспроизводимости и считать базовые статистики без сторонних библиотек.',
    ideas: [
      '`random.Random(seed)` создаёт независимый генератор с воспроизводимой последовательностью.',
      '`choice`, `sample`, `shuffle`, `randint` покрывают большинство учебных задач.',
      '`statistics.mean`, `median`, `mode`, `stdev` считают статистики по последовательности.',
      'Для паролей и токенов нужен модуль `secrets`, а не `random`.'
    ],
    sources: [
      {
        file: 'stdlib/04_random_stats.py',
        focus: [
          { function: 'demonstrate_random', note: 'seed, choice, sample и shuffle.' },
          { function: 'simulate_dice', note: 'Симуляция с воспроизводимым результатом.' },
          { function: 'demonstrate_statistics', note: 'mean, median, mode, stdev.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `describe(values)`, возвращающую словарь с ключами `mean`, `median`, `mode` и `count`.',
      hint: 'Используй функции из `statistics`. `count` — это длина последовательности.',
      starter: 'import statistics\n\n\ndef describe(values):\n    pass\n',
      solution:
        'import statistics\n\n\ndef describe(values):\n    return {\n        "mean": statistics.mean(values),\n        "median": statistics.median(values),\n        "mode": statistics.mode(values),\n        "count": len(values),\n    }',
      tests: [
        'assert describe([1, 2, 2, 3])["mean"] == 2',
        'assert describe([1, 2, 2, 3])["median"] == 2',
        'assert describe([1, 2, 2, 3])["mode"] == 2',
        'assert describe([5])["count"] == 1'
      ]
    },
    quiz: [
      {
        q: 'Зачем указывать seed?',
        options: ['Чтобы числа стали по-настоящему случайными', 'Чтобы последовательность была воспроизводимой', 'Чтобы ускорить генерацию', 'Чтобы избежать импорта'],
        answer: 1,
        explain: 'С одинаковым seed генератор выдаёт одинаковую последовательность — удобно для тестов.'
      },
      {
        q: 'Какой модуль использовать для токенов безопасности?',
        options: ['random', 'statistics', 'secrets', 'math'],
        answer: 2,
        explain: '`secrets` использует криптографически стойкий источник случайности.'
      }
    ]
  },
  {
    id: 'logging',
    title: 'Логирование',
    summary: 'Уровни, форматтеры и логгеры вместо print.',
    minutes: 9,
    goal:
      'Заменить отладочные `print` на логи с уровнями, которые можно включать и выключать без правки кода.',
    ideas: [
      'Уровни: DEBUG < INFO < WARNING < ERROR < CRITICAL.',
      'Логгер с именем `logging.getLogger("app")` позволяет настраивать части приложения отдельно.',
      'Форматтер задаёт вид строки: уровень, имя, сообщение.',
      '`logger.exception` пишет сообщение и traceback внутри `except`.'
    ],
    sources: [
      {
        file: 'stdlib/05_logging.py',
        focus: [
          { function: 'configure', note: 'Настройка логгера и обработчика.' },
          { function: 'process_order', note: 'Сообщения разных уровней.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `make_logger(name, level="INFO")`, возвращающий логгер с заданным уровнем и одним StreamHandler. Повторные вызовы не должны добавлять обработчики бесконечно.',
      hint: 'Сопоставь строку с `logging.DEBUG` и т.п. Перед добавлением обработчика очисти `logger.handlers`.',
      starter: 'import logging\n\n\ndef make_logger(name, level="INFO"):\n    pass\n',
      solution:
        'import logging\n\n\ndef make_logger(name, level="INFO"):\n    logger = logging.getLogger(name)\n    logger.setLevel(getattr(logging, level.upper()))\n    logger.handlers.clear()\n    logger.addHandler(logging.StreamHandler())\n    logger.propagate = False\n    return logger',
      tests: [
        'import logging\nlogger = make_logger("test.demo", "DEBUG")\nassert logger.name == "test.demo"\nassert logger.level == logging.DEBUG\nassert len(logger.handlers) == 1',
        'logger = make_logger("test.demo", "ERROR")\nassert logger.level == logging.ERROR\nassert len(logger.handlers) == 1'
      ]
    },
    quiz: [
      {
        q: 'Какой уровень самый подробный?',
        options: ['DEBUG', 'INFO', 'WARNING', 'ERROR'],
        answer: 0,
        explain: 'DEBUG ниже остальных, поэтому при уровне INFO сообщения DEBUG не выводятся.'
      },
      {
        q: 'Что делает `logger.exception(...)`?',
        options: ['Поднимает исключение', 'Пишет сообщение и traceback', 'Отключает логгер', 'Создаёт новый файл'],
        answer: 1,
        explain: 'Метод предназначен для вызова внутри `except` и добавляет traceback в лог.'
      }
    ]
  }
];
