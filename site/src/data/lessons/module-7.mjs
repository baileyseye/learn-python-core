export default [
  {
    id: 'environment',
    title: 'Окружение и venv',
    summary: 'Версия Python, виртуальное окружение и зависимости.',
    minutes: 8,
    goal:
      'Понять, где живёт интерпретатор, зачем нужно виртуальное окружение и как не смешивать зависимости разных проектов.',
    ideas: [
      'Один компьютер может содержать несколько версий Python; `python --version` показывает активную.',
      '`venv` создаёт изолированную папку с интерпретатором и пакетами.',
      '`pip freeze > requirements.txt` фиксирует зависимости, `pip install -r` восстанавливает их.',
      'Современный вариант — `pyproject.toml` и инструменты вроде `uv`, `poetry` или `pip-tools`.'
    ],
    sources: [
      {
        file: 'testing/01_environment.py',
        focus: [
          { function: 'describe_interpreter', note: 'Версия и реализация интерпретатора.' },
          { function: 'describe_environment', note: 'Признак виртуального окружения.' },
          { function: 'check_version', note: 'Сравнение версии с минимумом.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `supports_python(current, minimum=(3, 10))`, принимающую версии кортежами и возвращающую True, если current не ниже minimum.',
      hint: 'Кортежи сравниваются лексикографически, поэтому достаточно `current >= minimum`.',
      starter: 'def supports_python(current, minimum=(3, 10)):\n    pass\n',
      solution:
        'def supports_python(current, minimum=(3, 10)):\n    return current >= minimum',
      tests: [
        'assert supports_python((3, 12)) is True',
        'assert supports_python((3, 9)) is False',
        'assert supports_python((3, 10)) is True',
        'assert supports_python((4, 0), (3, 12)) is True'
      ]
    },
    quiz: [
      {
        q: 'Зачем проекту своё виртуальное окружение?',
        options: ['Чтобы код работал быстрее', 'Чтобы зависимости не конфликтовали между проектами', 'Чтобы Python стал компилируемым', 'Чтобы отключить pip'],
        answer: 1,
        explain: 'Каждый проект получает собственный набор пакетов нужных версий.'
      },
      {
        q: 'Что делает `pip install -r requirements.txt`?',
        options: ['Удаляет пакеты', 'Устанавливает зависимости из файла', 'Создаёт venv', 'Запускает тесты'],
        answer: 1,
        explain: 'Команда читает список пакетов и версий из файла и устанавливает их.'
      }
    ]
  },
  {
    id: 'pytest',
    title: 'pytest',
    summary: 'Тесты как функции, assert и понятные отчёты.',
    minutes: 10,
    goal:
      'Писать первые тесты в стиле pytest и понимать, зачем тестировать поведение, а не реализацию.',
    ideas: [
      'Тест — обычная функция с именем `test_*`, внутри которой есть `assert`.',
      'pytest сам находит тесты и показывает значения, которые не совпали.',
      'Один тест проверяет одну мысль; несколько assert допустимы, если они про один сценарий.',
      'Тесты запускаются командой `pytest` из корня проекта.'
    ],
    sources: [
      {
        file: 'testing/02_pytest_demo.py',
        focus: [
          { function: 'slugify', note: 'Тестируемая функция.' },
          { function: 'test_slugify_simple', note: 'Первый тест.' },
          { function: 'test_parse_price_error', note: 'Проверка исключения без pytest.raises.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `slugify(title)` — нижний регистр, пробелы заменены на дефис, и `parse_price(text)` — целое число из строки с валютой. При отсутствии цифр — ValueError.',
      hint: '`"-".join(title.lower().split())`. Для цены собери только цифры через генератор.',
      starter: 'def slugify(title):\n    pass\n\n\ndef parse_price(text):\n    pass\n',
      solution:
        'def slugify(title):\n    return "-".join(title.lower().split())\n\n\ndef parse_price(text):\n    digits = "".join(char for char in text if char.isdigit())\n    if not digits:\n        raise ValueError("в строке нет цены")\n    return int(digits)',
      tests: [
        'assert slugify("Learn Python Core") == "learn-python-core"',
        'assert parse_price("4 900 ₽") == 4900',
        'try:\n    parse_price("бесплатно")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
      ]
    },
    quiz: [
      {
        q: 'Как pytest находит тесты?',
        options: ['По имени файла и функции test_*', 'По комментарию # test', 'Только в папке tests', 'По расширению .test'],
        answer: 0,
        explain: 'По умолчанию pytest ищет файлы `test_*.py` или `*_test.py` и функции `test_*`.'
      },
      {
        q: 'Что проверяет хороший тест?',
        options: ['Каждую строку реализации', 'Наблюдаемое поведение', 'Скорость интерпретатора', 'Стиль кода'],
        answer: 1,
        explain: 'Тест должен переживать рефакторинг, если поведение не изменилось.'
      }
    ]
  },
  {
    id: 'write-tests',
    title: 'Пишем тесты',
    summary: 'Обычный случай, границы и проверка того, что тест ловит поломку.',
    minutes: 9,
    goal: 'Научиться писать тесты, которые проверяют поведение и действительно падают при ошибке.',
    ideas: [
      'Тест — функция `test_*` с `assert` внутри.',
      'Покрой обычный случай, границу и ошибочный ввод.',
      'Хороший тест падает, если поведение сломали, а не просто выполняется без ошибок.',
      'Проверяй наблюдаемый результат, а не внутренние переменные.'
    ],
    sources: [
      {
        file: 'testing/06_write_tests.py',
        focus: [
          {
            function: 'slugify',
            note: 'Функция, которую тестируем.'
          },
          {
            function: 'test_slugify_simple',
            note: 'Обычный случай.'
          },
          {
            function: 'test_slugify_spaces',
            note: 'Граница с пробелами.'
          },
          {
            function: 'test_slugify_empty',
            note: 'Пустая строка.'
          }
        ]
      }
    ],
    practice: {
      task: 'Функция `slugify` уже написана. Заполни три теста: обычный заголовок, лишние пробелы и пустую строку. Проверка затем специально сломает `slugify` — тесты должны это заметить.',
      hint: 'В каждом тесте вызови `slugify` и сравни результат через `assert`. Для пустой строки ожидается пустая строка.',
      starter: 'def slugify(title):\n    return "-".join(title.lower().split())\n\n\ndef test_slugify_basic():\n    pass\n\n\ndef test_slugify_spaces():\n    pass\n\n\ndef test_slugify_empty():\n    pass\n',
      solution: 'def slugify(title):\n    return "-".join(title.lower().split())\n\n\ndef test_slugify_basic():\n    assert slugify("Learn Python Core") == "learn-python-core"\n\n\ndef test_slugify_spaces():\n    assert slugify("  A  B  ") == "a-b"\n\n\ndef test_slugify_empty():\n    assert slugify("") == ""\n',
      tests: [
        'test_slugify_basic()',
        'test_slugify_spaces()',
        'test_slugify_empty()',
        'original = slugify\n\ndef broken(title):\n    return title\n\nslugify = broken\ncaught = False\nfor test in (test_slugify_basic, test_slugify_spaces, test_slugify_empty):\n    try:\n        test()\n    except AssertionError:\n        caught = True\nif not caught:\n    raise AssertionError("тесты не поймали поломку")\nslugify = original'
      ]
    },
    quiz: [
      {
        q: 'Что проверяет хороший тест?',
        options: [
          'Каждую строку реализации',
          'Наблюдаемое поведение',
          'Скорость интерпретатора',
          'Стиль кода'
        ],
        answer: 1,
        explain: 'Тест фиксирует результат, который важен пользователю функции, а не детали реализации.'
      },
      {
        q: 'Зачем проверять, что тест падает на сломанной версии?',
        options: [
          'Чтобы ускорить тесты',
          'Чтобы убедиться, что тест действительно что-то проверяет',
          'Чтобы уменьшить покрытие',
          'Это требование Python'
        ],
        answer: 1,
        explain: 'Тест, который проходит всегда, бесполезен; он должен замечать изменение поведения.'
      }
    ]
  },

  {
    id: 'typing',
    title: 'Аннотации типов',
    summary: 'Подсказки типов, TypedDict, Protocol и проверка mypy.',
    minutes: 9,
    goal:
      'Добавлять аннотации, которые помогают читать код и ловить ошибки до запуска, не превращая Python в Java.',
    ideas: [
      'Аннотации не влияют на выполнение, но их проверяют IDE и mypy/pyright.',
      '`list[int]`, `dict[str, int]`, `int | None` — современный синтаксис Python 3.10+.',
      '`TypedDict` описывает словарь с фиксированными ключами.',
      '`Protocol` описывает поведение без наследования.'
    ],
    sources: [
      {
        file: 'testing/03_typing.py',
        focus: [
          { function: 'average', note: 'Аннотация Iterable и float.' },
          { function: 'newest', note: 'Список TypedDict и Optional-результат.' },
          { function: 'total_pages', note: 'Protocol вместо конкретного класса.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `average(values: list[float]) -> float` с нулём для пустого списка и `is_adult(age: int) -> bool` для возраста 18+.',
      hint: 'Проверь пустой список до деления. `is_adult` возвращает сравнение.',
      starter: 'def average(values: list[float]) -> float:\n    pass\n\n\ndef is_adult(age: int) -> bool:\n    pass\n',
      solution:
        'def average(values: list[float]) -> float:\n    if not values:\n        return 0.0\n    return sum(values) / len(values)\n\n\ndef is_adult(age: int) -> bool:\n    return age >= 18',
      tests: [
        'assert average([2, 4]) == 3.0',
        'assert average([]) == 0.0',
        'assert is_adult(18) is True',
        'assert is_adult(17) is False'
      ]
    },
    quiz: [
      {
        q: 'Влияют ли аннотации типов на выполнение программы?',
        options: ['Да, проверяются в рантайме', 'Нет, это подсказки для инструментов', 'Только для функций', 'Только при импорте'],
        answer: 1,
        explain: 'По умолчанию аннотации хранятся как метаданные и не проверяются интерпретатором.'
      },
      {
        q: 'Что означает `int | None`?',
        options: ['Только int', 'Только None', 'int или None', 'Список int'],
        answer: 2,
        explain: 'Это современная запись `Optional[int]`.'
      }
    ]
  },
  {
    id: 'debugging',
    title: 'Отладка',
    summary: 'Чтение traceback, assert и типичные ошибки.',
    minutes: 10,
    goal:
      'Находить причину ошибки по traceback и использовать `assert`, отладчик и логи вместо хаотичных print.',
    ideas: [
      'Читайте traceback снизу вверх: последняя строка — тип и сообщение, выше — место возникновения.',
      '`assert condition, "message"` документирует ожидание и помогает на этапе разработки.',
      '`breakpoint()` запускает pdb: `n` — следующая строка, `p expr` — печать, `c` — продолжить.',
      'Если ошибка воспроизводится, сначала сузьте входные данные, а не меняйте код наугад.'
    ],
    sources: [
      {
        file: 'testing/04_debugging.py',
        focus: [
          { function: 'divide', note: 'assert как проверка предусловия.' },
          { function: 'parse_ints', note: 'Обработка частично некорректных данных.' },
          { function: 'show_traceback', note: 'Разбор traceback.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `parse_ints(values)`, который преобразует строки в int, пропускает некорректные значения и возвращает список чисел.',
      hint: 'Перебери значения, лови `ValueError` и добавляй только успешные преобразования.',
      starter: 'def parse_ints(values):\n    result = []\n    # добавь обработку\n    return result\n',
      solution:
        'def parse_ints(values):\n    result = []\n    for value in values:\n        try:\n            result.append(int(value))\n        except ValueError:\n            continue\n    return result',
      tests: [
        'assert parse_ints(["1", "два", "3"]) == [1, 3]',
        'assert parse_ints([]) == []',
        'assert parse_ints([" 4 "]) == [4]'
      ]
    },
    quiz: [
      {
        q: 'Где в traceback находится место возникновения ошибки?',
        options: ['В первой строке', 'В последней строке с файлом и номером', 'В середине', 'Traceback не содержит файлов'],
        answer: 1,
        explain: 'Нижняя часть traceback указывает на конкретный файл и строку, где поднялось исключение.'
      },
      {
        q: 'Что делает `breakpoint()`?',
        options: ['Завершает программу', 'Останавливает выполнение и запускает отладчик', 'Печатает переменные', 'Запускает тесты'],
        answer: 1,
        explain: 'По умолчанию открывается pdb, где можно исследовать состояние программы.'
      }
    ]
  },
  {
    id: 'project-layout',
    title: 'Структура проекта',
    summary: 'Пакеты, модули, точка входа и раскладка файлов.',
    minutes: 8,
    goal:
      'Организовать проект так, чтобы его можно было запускать, импортировать и тестировать без хаков с путями.',
    ideas: [
      'Пакет — папка с `__init__.py` (в современных проектах допустим namespace package, но для учебного — проще с ним).',
      'Точка входа — отдельный модуль, который вызывает функции, а не содержит всю логику.',
      'Тесты лежат отдельно и импортируют код как пакет.',
      '`pyproject.toml` хранит метаданные, зависимости и настройки инструментов.'
    ],
    sources: [
      {
        file: 'testing/05_project_layout.py',
        focus: [
          { function: 'describe_module', note: 'Разбор dotted path.' }
        ]
      }
    ],
    practice: {
      task: 'Напиши `describe_module(path)`: по строке `"app.services.users"` верни словарь с ключами `package`, `module` и `file` (файл с `.py`).',
      hint: '`parts = path.split(".")`. Пакет — всё до последнего элемента, файл — путь через `/` с `.py`.',
      starter: 'def describe_module(path):\n    pass\n',
      solution:
        'def describe_module(path):\n    parts = path.split(".")\n    return {\n        "package": ".".join(parts[:-1]),\n        "module": parts[-1],\n        "file": "/".join(parts) + ".py",\n    }',
      tests: [
        'assert describe_module("app.services.users") == {"package": "app.services", "module": "users", "file": "app/services/users.py"}',
        'assert describe_module("main")["package"] == ""'
      ]
    },
    quiz: [
      {
        q: 'Зачем выносить точку входа в отдельный модуль?',
        options: ['Чтобы код нельзя было импортировать', 'Чтобы отделить запуск от логики', 'Чтобы ускорить Python', 'Это требование PEP 8'],
        answer: 1,
        explain: 'Так логику можно импортировать и тестировать, не выполняя побочные действия.'
      },
      {
        q: 'Что обычно хранит `pyproject.toml`?',
        options: ['Только пароли', 'Метаданные проекта, зависимости и настройки', 'Скомпилированный код', 'Тестовые данные'],
        answer: 1,
        explain: 'Это стандартный файл конфигурации современного Python-проекта.'
      }
    ]
  },
  {
    id: 'notes-project',
    title: 'Мини-проект: заметки',
    summary: 'Функции, исключения, JSON и поиск в одном маленьком модуле.',
    minutes: 10,
    goal: 'Собрать изученные инструменты в небольшой модуль с понятными функциями и проверяемым поведением.',
    ideas: [
      'Проект собирается из маленьких функций с одной ответственностью.',
      'Ошибочный ввод отсекается на границе: пустой заголовок — `ValueError`.',
      'Внутри программы удобны списки и словари, а JSON — формат хранения.',
      '`ensure_ascii=False` сохраняет кириллицу читаемой.'
    ],
    sources: [
      {
        file: 'testing/07_notes_project.py',
        focus: [
          {
            function: 'add_note',
            note: 'Добавление с проверкой входа.'
          },
          {
            function: 'find_notes',
            note: 'Поиск без учёта регистра.'
          },
          {
            function: 'to_json',
            note: 'Сохранение в JSON.'
          },
          {
            function: 'from_json',
            note: 'Загрузка из JSON.'
          }
        ]
      }
    ],
    practice: {
      task: 'Собери модуль заметок: `add_note(notes, title, text)` (пустой заголовок → `ValueError`), `find_notes(notes, query)` (поиск по заголовку и тексту без учёта регистра), `to_json(notes)` и `from_json(text)`.',
      hint: 'Для поиска приведи query и поля к нижнему регистру. Для JSON используй `json.dumps(..., ensure_ascii=False)` и `json.loads`.',
      starter: 'import json\n\n\ndef add_note(notes, title, text):\n    pass\n\n\ndef find_notes(notes, query):\n    pass\n\n\ndef to_json(notes):\n    pass\n\n\ndef from_json(text):\n    pass\n',
      solution: 'import json\n\n\ndef add_note(notes, title, text):\n    if not title.strip():\n        raise ValueError("заголовок не может быть пустым")\n    notes.append({"title": title.strip(), "text": text.strip()})\n    return notes\n\n\ndef find_notes(notes, query):\n    query = query.lower()\n    return [\n        note\n        for note in notes\n        if query in note["title"].lower() or query in note["text"].lower()\n    ]\n\n\ndef to_json(notes):\n    return json.dumps(notes, ensure_ascii=False)\n\n\ndef from_json(text):\n    return json.loads(text)\n',
      tests: [
        'notes = []\nadd_note(notes, "Python", "Читать код")\nassert notes == [{"title": "Python", "text": "Читать код"}]',
        'notes = [{"title": "Python", "text": "Читать код"}]\nassert find_notes(notes, "python") == notes\nassert find_notes(notes, "код") == notes\nassert find_notes(notes, "sql") == []',
        'try:\n    add_note([], "  ", "x")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")',
        'notes = [{"title": "Python", "text": "Читать код"}]\nassert "Python" in to_json(notes)\nassert from_json(to_json(notes)) == notes'
      ]
    },
    quiz: [
      {
        q: 'Где проверять пустой заголовок заметки?',
        options: [
          'При каждом чтении JSON',
          'На границе добавления заметки',
          'Только в тестах',
          'В `print`'
        ],
        answer: 1,
        explain: 'Проверка на границе не пускает некорректные данные внутрь программы.'
      },
      {
        q: 'Зачем в `json.dumps` нужен `ensure_ascii=False`?',
        options: [
          'Чтобы ускорить сериализацию',
          'Чтобы кириллица осталась читаемой',
          'Чтобы JSON стал короче',
          'Чтобы сохранить даты'
        ],
        answer: 1,
        explain: 'По умолчанию кириллица превращается в `\\uXXXX`; с `ensure_ascii=False` строка остаётся читаемой.'
      }
    ]
  },

];
