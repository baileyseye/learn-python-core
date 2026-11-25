export default [
  {
    id: 'args-kwargs',
    title: '*args и **kwargs',
    summary: 'Гибкие сигнатуры функций и распаковка аргументов.',
    minutes: 8,
    goal:
      'Принимать произвольное число позиционных и именованных аргументов и осознанно проектировать сигнатуры.',
    ideas: [
      '`*args` собирает лишние позиционные аргументы в кортеж.',
      '`**kwargs` собирает лишние именованные аргументы в словарь.',
      'Порядок в сигнатуре: обычные параметры, `*args`, именованные, `**kwargs`.',
      'При вызове `*` и `**` наоборот распаковывают последовательность и словарь.'
    ],
    sources: [
      {
        file: 'functional/01_args_kwargs.py',
        focus: [
          { function: 'total', note: 'Сумма произвольного числа аргументов.' },
          { function: 'build_profile', note: 'Словарь из именованных аргументов.' },
          { function: 'log_call', note: 'Полная сигнатура с именованными параметрами.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `total(*numbers)` — сумму аргументов и `build_profile(**fields)` — словарь с ключом `type` равным `"profile"`.',
      hint: 'Внутри `total` переменная `numbers` — кортеж. В `build_profile` собери новый словарь через `{"type": "profile", **fields}`.',
      starter: 'def total(*numbers):\n    pass\n\n\ndef build_profile(**fields):\n    pass\n',
      solution:
        'def total(*numbers):\n    return sum(numbers)\n\n\ndef build_profile(**fields):\n    return {"type": "profile", **fields}',
      tests: [
        'assert total(1, 2, 3) == 6',
        'assert total() == 0',
        'assert build_profile(name="Анна", role="admin") == {"type": "profile", "name": "Анна", "role": "admin"}'
      ]
    },
    quiz: [
      {
        q: 'Какого типа `args` внутри функции с `*args`?',
        options: ['list', 'tuple', 'dict', 'set'],
        answer: 1,
        explain: 'Позиционные аргументы собираются в кортеж, а именованные — в словарь.'
      },
      {
        q: 'Что делает вызов `func(*items)`?',
        options: ['Передаёт список как один аргумент', 'Распаковывает элементы как позиционные аргументы', 'Копирует список', 'Создаёт кортеж'],
        answer: 1,
        explain: 'Звёздочка при вызове распаковывает последовательность в отдельные аргументы.'
      }
    ]
  },
  {
    id: 'closures',
    title: 'Замыкания',
    summary: 'Функции, которые запоминают окружение.',
    minutes: 8,
    goal:
      'Понять, как внутренняя функция сохраняет доступ к переменным внешней, и использовать это для фабрик функций.',
    ideas: [
      'Замыкание — функция плюс захваченное окружение.',
      'Чтение внешней переменной не требует объявлений, а изменение — требует `nonlocal`.',
      'Каждый вызов фабрики создаёт независимое замыкание.',
      'Замыкания лежат в основе декораторов и многих функций обратного вызова.'
    ],
    sources: [
      {
        file: 'functional/02_closures.py',
        focus: [
          { function: 'make_counter', note: 'Независимый счётчик на каждый вызов.' },
          { function: 'make_multiplier', note: 'Фабрика функций с параметром.' },
          { function: 'make_accumulator', note: 'Захваченный изменяемый список.' }
        ]
      }
    ],
    practice: {
      task: 'Напиши `make_counter(start=0)`, возвращающую функцию без аргументов, которая при каждом вызове увеличивает счётчик на 1 и возвращает новое значение.',
      hint: 'Объяви `count = start` во внешней функции и используй `nonlocal count` внутри внутренней.',
      starter: 'def make_counter(start=0):\n    pass\n',
      solution:
        'def make_counter(start=0):\n    count = start\n\n    def counter():\n        nonlocal count\n        count += 1\n        return count\n\n    return counter',
      tests: [
        'counter = make_counter()\nassert counter() == 1\nassert counter() == 2',
        'first = make_counter()\nsecond = make_counter(10)\nassert first() == 1\nassert second() == 11\nassert first() == 2'
      ]
    },
    quiz: [
      {
        q: 'Зачем нужно `nonlocal`?',
        options: ['Чтобы создать глобальную переменную', 'Чтобы изменить переменную внешней функции', 'Чтобы импортировать модуль', 'Чтобы сделать переменную константой'],
        answer: 1,
        explain: 'Без `nonlocal` присваивание создало бы новую локальную переменную внутренней функции.'
      },
      {
        q: 'Сколько независимых счётчиков создаст два вызова `make_counter()`?',
        options: ['Один общий', 'Два независимых', 'Ни одного', 'Зависит от Python'],
        answer: 1,
        explain: 'Каждый вызов создаёт новое окружение и своё замыкание.'
      }
    ]
  },
  {
    id: 'decorators',
    title: 'Декораторы',
    summary: 'Обёртки, functools.wraps и декораторы с параметрами.',
    minutes: 10,
    goal:
      'Писать декораторы, которые добавляют поведение, не меняя тело функции, и сохраняют её метаданные.',
    ideas: [
      'Декоратор — функция, которая принимает функцию и возвращает новую.',
      '`*args, **kwargs` позволяют обёртке работать с любой сигнатурой.',
      '`functools.wraps` сохраняет имя и docstring исходной функции.',
      'Декоратор с параметрами — это функция, возвращающая декоратор.'
    ],
    sources: [
      {
        file: 'functional/03_decorators.py',
        focus: [
          { function: 'logged', note: 'Простая обёртка и functools.wraps.' },
          { function: 'retry', note: 'Декоратор с параметрами.' },
          { function: 'timed', note: 'Измерение времени выполнения.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши декоратор `count_calls`, который считает вызовы функции и сохраняет число в атрибуте `calls` у обёрнутой функции.',
      hint: 'Создай `wrapper.calls = 0`, увеличивай его при вызове и используй `functools.wraps`.',
      starter: 'import functools\n\n\ndef count_calls(function):\n    pass\n',
      solution:
        'import functools\n\n\ndef count_calls(function):\n    @functools.wraps(function)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return function(*args, **kwargs)\n\n    wrapper.calls = 0\n    return wrapper',
      tests: [
        '@count_calls\ndef add(a, b):\n    return a + b\nassert add(1, 2) == 3\nassert add.calls == 1\nassert add(2, 2) == 4\nassert add.calls == 2',
        '@count_calls\ndef identity(value):\n    return value\nassert identity.calls == 0\nidentity("x")\nassert identity.calls == 1'
      ]
    },
    quiz: [
      {
        q: 'Зачем нужен `functools.wraps`?',
        options: ['Ускоряет функцию', 'Сохраняет имя и docstring оригинала', 'Позволяет принимать kwargs', 'Делает функцию приватной'],
        answer: 1,
        explain: 'Без `wraps` обёрнутая функция будет называться `wrapper`, что ломает документацию и отладку.'
      },
      {
        q: 'Сколько уровней вложенности у декоратора с параметрами?',
        options: ['Один', 'Два', 'Три', 'Ноль'],
        answer: 2,
        explain: 'Внешняя функция принимает параметры, средняя — функцию, внутренняя — аргументы вызова.'
      }
    ]
  },
  {
    id: 'decorator-params',
    title: 'Декораторы с параметрами',
    summary: 'Три уровня, functools.wraps и повторные вызовы.',
    minutes: 8,
    goal: 'Писать декораторы, которым можно передать настройки, и не терять метаданные функции.',
    ideas: [
      'Декоратор с параметрами — три уровня: `repeat(times)` → `decorator(function)` → `wrapper`.',
      'Внешняя функция запоминает настройки, а внутренняя оборачивает конкретную функцию.',
      '`functools.wraps` сохраняет имя и docstring.',
      'Так устроены `retry`, `repeat`, `cache` и другие полезные обёртки.'
    ],
    sources: [
      {
        file: 'functional/07_decorator_params.py',
        focus: [
          {
            function: 'repeat',
            note: 'Декоратор с количеством повторов.'
          },
          {
            function: 'retry',
            note: 'Повтор при исключении.'
          }
        ]
      }
    ],
    practice: {
      task: 'Напиши `repeat(times)` — декоратор, который вызывает функцию `times` раз и возвращает последний результат. Сохрани имя функции через `functools.wraps`.',
      hint: 'Внешняя функция принимает `times`, средняя — `function`, внутренняя — `*args, **kwargs`. Результат сохраняй в переменной.',
      starter: 'import functools\n\n\ndef repeat(times):\n    pass\n',
      solution: 'import functools\n\n\ndef repeat(times):\n    def decorator(function):\n        @functools.wraps(function)\n        def wrapper(*args, **kwargs):\n            result = None\n            for _ in range(times):\n                result = function(*args, **kwargs)\n            return result\n\n        return wrapper\n\n    return decorator\n',
      tests: [
        'calls = []\n@repeat(3)\ndef record(value):\n    calls.append(value)\n    return value\nassert record("x") == "x"\nassert calls == ["x", "x", "x"]',
        '@repeat(1)\ndef identity(value):\n    return value\nassert identity(5) == 5\nassert identity.__name__ == "identity"'
      ]
    },
    quiz: [
      {
        q: 'Сколько уровней функций у декоратора с параметрами?',
        options: [
          'Один',
          'Два',
          'Три',
          'Четыре'
        ],
        answer: 2,
        explain: 'Параметры → декоратор функции → обёртка вызова.'
      },
      {
        q: 'Зачем нужен `functools.wraps`?',
        options: [
          'Ускоряет вызов',
          'Сохраняет имя и docstring исходной функции',
          'Добавляет аргументы',
          'Запрещает повторный вызов'
        ],
        answer: 1,
        explain: 'Без `wraps` обёрнутая функция потеряет имя и документацию оригинала.'
      }
    ]
  },

  {
    id: 'iterators',
    title: 'Итераторы',
    summary: '__iter__, __next__ и StopIteration.',
    minutes: 8,
    goal: 'Понять, как `for` получает элементы, и написать собственный итератор.',
    ideas: [
      'Итератор — объект с методами `__iter__` и `__next__`.',
      '`for` вызывает `iter()`, затем `next()` до `StopIteration`.',
      '`__iter__` обычно возвращает `self`.',
      'Генераторы — более короткий способ создать итератор.'
    ],
    sources: [
      {
        file: 'functional/06_iterators.py',
        focus: [
          {
            function: 'Countdown',
            note: '__iter__, __next__ и StopIteration.'
          }
        ]
      }
    ],
    practice: {
      task: 'Реализуй `Countdown(start)` — итератор, который отдаёт числа от `start` до `1`, затем поднимает `StopIteration`.',
      hint: 'Храни `self.current`. В `__next__` проверь `self.current <= 0`, иначе верни число и уменьши его.',
      starter: 'class Countdown:\n    def __init__(self, start):\n        pass\n\n    def __iter__(self):\n        pass\n\n    def __next__(self):\n        pass\n',
      solution: 'class Countdown:\n    def __init__(self, start):\n        self.current = start\n\n    def __iter__(self):\n        return self\n\n    def __next__(self):\n        if self.current <= 0:\n            raise StopIteration\n        value = self.current\n        self.current -= 1\n        return value\n',
      tests: [
        'assert list(Countdown(3)) == [3, 2, 1]',
        'assert list(Countdown(0)) == []',
        'iterator = Countdown(1)\nassert next(iterator) == 1\ntry:\n    next(iterator)\nexcept StopIteration:\n    pass\nelse:\n    raise AssertionError("ожидалось StopIteration")'
      ]
    },
    quiz: [
      {
        q: 'Какой метод вызывается при `next(iterator)`?',
        options: [
          '__iter__',
          '__next__',
          '__getitem__',
          '__len__'
        ],
        answer: 1,
        explain: '`next()` обращается к `__next__`, пока не получит `StopIteration`.'
      },
      {
        q: 'Что обычно возвращает `__iter__`?',
        options: [
          'self',
          'Новый список',
          'None',
          'Последний элемент'
        ],
        answer: 0,
        explain: 'Итератор сам является своим итератором, поэтому чаще всего возвращает `self`.'
      }
    ]
  },
  {
    id: 'generators',
    title: 'Генераторы',
    summary: 'yield, ленивые вычисления и генераторные выражения.',
    minutes: 9,
    goal:
      'Обрабатывать последовательности лениво, не загружая всё в память, и понимать разницу между генератором и списком.',
    ideas: [
      '`yield` приостанавливает функцию и возвращает очередное значение.',
      'Генератор можно пройти только один раз.',
      'Генераторное выражение выглядит как comprehension, но вычисляется лениво.',
      'Генераторы удобно соединять в конвейер: каждый этап берёт по одному элементу.'
    ],
    sources: [
      {
        file: 'functional/04_generators.py',
        focus: [
          { function: 'countdown', note: 'Генератор с yield в цикле.' },
          { function: 'fibonacci', note: 'Бесконечная идея, ограниченная условием.' },
          { function: 'pipeline', note: 'Цепочка ленивых преобразований.' }
        ]
      }
    ],
    practice: {
      task: 'Напиши генератор `fibonacci(limit)`, который возвращает числа Фибоначчи, меньшие limit, начиная с 0 и 1.',
      hint: 'Храни `a, b = 0, 1`, в цикле `while a < limit` отдавай `a` через yield и обновляй пару.',
      starter: 'def fibonacci(limit):\n    pass\n',
      solution:
        'def fibonacci(limit):\n    a, b = 0, 1\n    while a < limit:\n        yield a\n        a, b = b, a + b',
      tests: [
        'assert list(fibonacci(20)) == [0, 1, 1, 2, 3, 5, 8, 13]',
        'assert list(fibonacci(1)) == [0]',
        'gen = fibonacci(10)\nassert next(gen) == 0\nassert next(gen) == 1'
      ]
    },
    quiz: [
      {
        q: 'Чем генератор отличается от списка?',
        options: ['Хранит все элементы в памяти', 'Вычисляет элементы лениво', 'Нельзя обойти в цикле', 'Может содержать только числа'],
        answer: 1,
        explain: 'Генератор создаёт значения по требованию и не хранит всю последовательность.'
      },
      {
        q: 'Сколько раз можно полностью обойти один генератор?',
        options: ['Сколько угодно', 'Один раз', 'Два раза', 'Зависит от длины'],
        answer: 1,
        explain: 'После исчерпания генератор пуст; для повторного обхода нужно создать новый.'
      }
    ]
  },
  {
    id: 'context-managers',
    title: 'Контекстные менеджеры',
    summary: 'with, __enter__/__exit__ и contextlib.contextmanager.',
    minutes: 8,
    goal: 'Управлять ресурсами через `with` и писать свои контекстные менеджеры для повторяющейся подготовки и очистки.',
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
          {
            function: 'Timer',
            note: 'Класс с __enter__ и __exit__.'
          },
          {
            function: 'section',
            note: 'Контекстный менеджер через генератор.'
          }
        ]
      }
    ],
    practice: {
      task: 'Напиши контекстный менеджер `suppress_errors(*types)`, который подавляет указанные исключения и возвращает объект с полем `error`.',
      hint: 'Используй `@contextmanager`. Сохрани исключение в списке или объекте, потому что после `yield` его можно перехватить через `try/except`.',
      starter: 'from contextlib import contextmanager\n\n\n@contextmanager\ndef suppress_errors(*types):\n    pass\n',
      solution: 'from contextlib import contextmanager\n\n\nclass _Catcher:\n    def __init__(self):\n        self.error = None\n\n\n@contextmanager\ndef suppress_errors(*types):\n    catcher = _Catcher()\n    try:\n        yield catcher\n    except types as error:\n        catcher.error = error',
      tests: [
        'with suppress_errors(ValueError) as caught:\n    raise ValueError("boom")\nassert isinstance(caught.error, ValueError)',
        'with suppress_errors(ValueError) as caught:\n    pass\nassert caught.error is None',
        'try:\n    with suppress_errors(ValueError):\n        raise TypeError("not caught")\nexcept TypeError:\n    pass\nelse:\n    raise AssertionError("TypeError должен пройти дальше")'
      ]
    },
    quiz: [
      {
        q: 'Что произойдёт, если `__exit__` вернёт True?',
        options: [
          'Исключение будет подавлено',
          'Исключение поднимется выше',
          'Программа завершится',
          'Будет SyntaxError'
        ],
        answer: 0,
        explain: 'Истинное значение из `__exit__` означает, что исключение обработано.'
      },
      {
        q: 'Что делает `@contextmanager`?',
        options: [
          'Превращает генератор в контекстный менеджер',
          'Закрывает файлы',
          'Создаёт поток',
          'Ускоряет with'
        ],
        answer: 0,
        explain: 'Декоратор оборачивает генератор: код до `yield` — вход, после — выход.'
      }
    ]
  },

  {
    id: 'functional-tools',
    title: 'Функциональные инструменты',
    summary: 'lambda, map, filter, reduce и itertools.',
    minutes: 9,
    goal:
      'Узнать инструменты функционального стиля и применять их там, где они делают код короче и яснее.',
    ideas: [
      '`lambda` — короткая анонимная функция для простого преобразования.',
      '`map` и `filter` возвращают итераторы, поэтому результат часто оборачивают в `list`.',
      '`reduce` сворачивает последовательность в одно значение.',
      '`itertools` даёт готовые ленивые операции: chain, groupby, combinations.'
    ],
    sources: [
      {
        file: 'functional/05_functional.py',
        focus: [
          { function: 'demonstrate_lambda', note: 'lambda как ключ сортировки.' },
          { function: 'demonstrate_map_filter', note: 'map и filter.' },
          { function: 'demonstrate_itertools', note: 'chain и groupby.' },
          { function: 'compose', note: 'Композиция функций.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `compose(*functions)`, возвращающую функцию, которая применяет переданные функции слева направо к значению.',
      hint: 'Начни с исходного значения и последовательно применяй функции в цикле или через `reduce`.',
      starter: 'def compose(*functions):\n    pass\n',
      solution:
        'def compose(*functions):\n    def composed(value):\n        for function in functions:\n            value = function(value)\n        return value\n\n    return composed',
      tests: [
        'process = compose(str.strip, str.upper)\nassert process("  python  ") == "PYTHON"',
        'process = compose(lambda x: x + 1, lambda x: x * 2)\nassert process(3) == 8',
        'assert compose()("x") == "x"'
      ]
    },
    quiz: [
      {
        q: 'Что возвращает `map` в Python 3?',
        options: ['Список', 'Итератор', 'Кортеж', 'Строку'],
        answer: 1,
        explain: '`map` ленив; для списка нужно `list(map(...))`.'
      },
      {
        q: 'Когда lambda уместна?',
        options: ['Для большой функции с ветвлениями', 'Для короткого выражения в key или filter', 'Вместо любого def', 'Только для чисел'],
        answer: 1,
        explain: 'Lambda хороша для однострочных выражений; сложную логику лучше вынести в именованную функцию.'
      }
    ]
  }
];
