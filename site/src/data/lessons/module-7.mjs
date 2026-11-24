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
  }
];
