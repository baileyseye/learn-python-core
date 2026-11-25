export default [
  {
    id: 'slices',
    title: 'Срезы и копии',
    summary: 'start:stop:step, обратный порядок и поверхностная копия.',
    minutes: 8,
    goal: 'Брать часть последовательности срезом, не путать границы и понимать, что срез создаёт новый объект.',
    ideas: [
      '`items[start:stop]` берёт элементы с `start` до `stop`, не включая `stop`.',
      '`items[:3]` — с начала, `items[2:]` — до конца, `items[:]` — копия.',
      'Третий параметр задаёт шаг: `items[::2]`, `items[::-1]` — разворот.',
      'Срез не меняет исходный список; он создаёт новый.'
    ],
    sources: [
      {
        file: 'collections/00_slices.py',
        focus: [
          {
            function: 'first_last',
            note: 'Первый и последний элементы.'
          },
          {
            function: 'every_second',
            note: 'Шаг среза.'
          },
          {
            function: 'reverse',
            note: 'Обратный порядок без изменения исходника.'
          }
        ]
      }
    ],
    practice: {
      task: 'Напиши `first_last(items)` → `(первый, последний)`, `every_second(items)` → каждый второй элемент и `reverse(items)` → последовательность в обратном порядке.',
      hint: 'Используй `items[0]`, `items[-1]`, `items[::2]` и `items[::-1]`.',
      starter: 'def first_last(items):\n    pass\n\n\ndef every_second(items):\n    pass\n\n\ndef reverse(items):\n    pass\n',
      solution: 'def first_last(items):\n    return items[0], items[-1]\n\n\ndef every_second(items):\n    return items[::2]\n\n\ndef reverse(items):\n    return items[::-1]\n',
      tests: [
        'assert first_last([1, 2, 3]) == (1, 3)',
        'assert every_second([1, 2, 3, 4]) == [1, 3]',
        'assert reverse("abc") == "cba"',
        'items = [1, 2, 3]\nreverse(items)\nassert items == [1, 2, 3]'
      ]
    },
    quiz: [
      {
        q: 'Что вернёт `[10, 20, 30, 40][1:3]`?',
        options: [
          '[10, 20, 30]',
          '[20, 30]',
          '[20, 30, 40]',
          '[30, 40]'
        ],
        answer: 1,
        explain: 'Индексы 1 и 2; элемент с индексом 3 не включается.'
      },
      {
        q: 'Что делает `items[::-1]`?',
        options: [
          'Удаляет последний элемент',
          'Сортирует список',
          'Возвращает копию в обратном порядке',
          'Меняет исходный список'
        ],
        answer: 2,
        explain: 'Отрицательный шаг идёт с конца, а срез создаёт новый объект.'
      }
    ]
  },
  {
    id: 'lists',
    title: 'Списки',
    summary: 'Изменяемая последовательность, методы и ловушка копирования.',
    minutes: 9,
    goal:
      'Уверенно добавлять, удалять и изменять элементы списка и понимать разницу между ссылкой на список и его копией.',
    ideas: [
      'Список изменяем: `append`, `insert`, `extend`, `pop`, `remove` меняют его на месте.',
      'Присваивание `alias = original` не копирует список, а создаёт второе имя для того же объекта.',
      '`copy()` делает поверхностную копию: вложенные списки остаются общими.',
      'Список можно обходить напрямую, а если нужен индекс — через `enumerate`.'
    ],
    sources: [
      {
        file: 'collections/01_lists.py',
        focus: [
          { function: 'demonstrate_methods', note: 'Основные методы списка.' },
          { function: 'demonstrate_copy_pitfall', note: 'Ссылка и копия ведут себя по-разному.' },
          { function: 'demonstrate_nested', note: 'Вложенные списки и матрицы.' }
        ]
      }
    ],
    practice: {
      task: 'Напиши `chunk(items, size)`, разбивающую список на части заданного размера. Последняя часть может быть короче.',
      hint: 'Используй срез `items[start:start + size]` и шаг `range(0, len(items), size)`.',
      starter: 'def chunk(items, size):\n    pass\n',
      solution:
        'def chunk(items, size):\n    if size <= 0:\n        raise ValueError("size должен быть положительным")\n    return [items[start:start + size] for start in range(0, len(items), size)]',
      tests: [
        'assert chunk([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]',
        'assert chunk([], 3) == []',
        'assert chunk([1, 2, 3], 5) == [[1, 2, 3]]'
      ]
    },
    quiz: [
      {
        q: 'Что произойдёт при `alias = original; alias.append(1)`?',
        options: ['Изменится только alias', 'Изменится original', 'Создастся копия', 'Будет ошибка'],
        answer: 1,
        explain: 'Оба имени ссылаются на один и тот же объект списка.'
      },
      {
        q: 'Какой метод добавляет элемент в конец списка?',
        options: ['push', 'add', 'append', 'insert'],
        answer: 2,
        explain: '`append` добавляет один элемент в конец; `extend` добавляет элементы другой последовательности.'
      }
    ]
  },
  {
    id: 'tuples',
    title: 'Кортежи',
    summary: 'Неизменяемость, распаковка и namedtuple.',
    minutes: 7,
    goal:
      'Понять, зачем нужен кортеж, когда он лучше списка и как использовать распаковку для читаемого кода.',
    ideas: [
      'Кортеж неизменяем, поэтому подходит для фиксированных наборов значений.',
      'Вернуть несколько значений из функции — идиоматично через кортеж.',
      'Один элемент задаётся запятой: `("Python",)` — это кортеж, а `("Python")` — просто строка.',
      '`namedtuple` даёт имена полям, сохраняя лёгкость кортежа.'
    ],
    sources: [
      {
        file: 'collections/02_tuples.py',
        focus: [
          { function: 'demonstrate_basics', note: 'Распаковка и перестановка.' },
          { function: 'demonstrate_single_element', note: 'Ловушка с запятой.' },
          { function: 'split_name', note: 'Возврат двух значений.' },
          { function: 'demonstrate_namedtuple', note: 'Именованные поля.' }
        ]
      }
    ],
    practice: {
      task: 'Напиши `split_name(full_name)`, возвращающую кортеж `(имя, фамилия)`. Если передано одно слово, фамилия должна быть пустой строкой.',
      hint: '`str.split(maxsplit=1)` вернёт один или два элемента. Учти оба случая.',
      starter: 'def split_name(full_name):\n    pass\n',
      solution:
        'def split_name(full_name):\n    parts = full_name.strip().split(maxsplit=1)\n    if len(parts) == 1:\n        return parts[0], ""\n    return parts[0], parts[1]',
      tests: [
        'assert split_name("Анна Петрова") == ("Анна", "Петрова")',
        'assert split_name("Борис") == ("Борис", "")',
        'assert split_name("  Анна  Петрова  ") == ("Анна", "Петрова")'
      ]
    },
    quiz: [
      {
        q: 'Как создать кортеж из одного элемента?',
        options: ['("Python")', '("Python",)', '["Python"]', '{Python}'],
        answer: 1,
        explain: 'Запятая делает кортеж; без неё это просто строка в скобках.'
      },
      {
        q: 'Почему кортеж может быть ключом словаря, а список — нет?',
        options: ['Кортеж быстрее', 'Кортеж неизменяем и хэшируем', 'Список нельзя сравнивать', 'Это не так'],
        answer: 1,
        explain: 'Ключи должны быть хэшируемыми, а изменяемые объекты, такие как список, такими не являются.'
      }
    ]
  },
  {
    id: 'dicts',
    title: 'Словари',
    summary: 'Ключ → значение, get, объединение и перебор.',
    minutes: 10,
    goal:
      'Использовать словарь как основную структуру для именованных данных и подсчёта частот.',
    ideas: [
      'Словарь хранит пары ключ-значение и даёт быстрый доступ по ключу.',
      '`data["key"]` падает с `KeyError`, если ключа нет; `data.get("key", default)` — нет.',
      '`for key, value in data.items()` — стандартный способ обхода.',
      'Оператор `|` объединяет словари, не меняя исходные.'
    ],
    sources: [
      {
        file: 'collections/03_dicts.py',
        focus: [
          { function: 'demonstrate_basics', note: 'Добавление, обновление и get.' },
          { function: 'count_words', note: 'Подсчёт частот через get.' },
          { function: 'merge_profiles', note: 'Объединение словарей оператором |.' }
        ]
      }
    ],
    practice: {
      task: 'Напиши `count_words(text)`, возвращающую словарь частот слов. Регистр не важен, слова разделены пробелами.',
      hint: 'Приводи текст к нижнему регистру, перебери `text.split()` и используй `counts.get(word, 0) + 1`.',
      starter: 'def count_words(text):\n    pass\n',
      solution:
        'def count_words(text):\n    counts = {}\n    for word in text.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts',
      tests: [
        'assert count_words("кот пёс кот") == {"кот": 2, "пёс": 1}',
        'assert count_words("Python python PYTHON") == {"python": 3}',
        'assert count_words("") == {}'
      ]
    },
    quiz: [
      {
        q: 'Чем `data.get("x")` отличается от `data["x"]`?',
        options: ['Ничем', 'get вернёт None вместо KeyError', 'get удаляет ключ', 'get работает только со строками'],
        answer: 1,
        explain: '`get` возвращает значение по умолчанию, если ключа нет.'
      },
      {
        q: 'Что вернёт `{"a": 1} | {"b": 2}`?',
        options: ['{"a": 1}', '{"b": 2}', '{"a": 1, "b": 2}', 'Ошибку'],
        answer: 2,
        explain: 'Оператор `|` объединяет словари; при совпадении ключей побеждает правый.'
      }
    ]
  },
  {
    id: 'sets',
    title: 'Множества',
    summary: 'Уникальность, операции и быстрая проверка вхождения.',
    minutes: 7,
    goal:
      'Убирать дубликаты и сравнивать наборы значений через множества, понимая, когда порядок теряется.',
    ideas: [
      '`set` хранит только уникальные элементы и не гарантирует порядок.',
      'Операции `|`, `&`, `-`, `^` соответствуют объединению, пересечению, разности и симметричной разности.',
      'Проверка `in` у множества в среднем быстрее, чем у списка.',
      'Для неизменяемого множества есть `frozenset`.'
    ],
    sources: [
      {
        file: 'collections/04_sets.py',
        focus: [
          { function: 'unique_preserve_order', note: 'Дубликаты убираются с сохранением порядка.' },
          { function: 'demonstrate_operations', note: 'Четыре операции над множествами.' },
          { function: 'demonstrate_membership_speed', note: 'Проверка вхождения.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `common_tags(first, second)` — общие теги двух списков без дубликатов, и `unique_preserve_order(items)` — уникальные элементы в исходном порядке.',
      hint: 'Для общих тегов используй `set(first) & set(second)`. Во второй функции пригодится вспомогательное множество `seen`.',
      starter: 'def common_tags(first, second):\n    pass\n\n\ndef unique_preserve_order(items):\n    pass\n',
      solution:
        'def common_tags(first, second):\n    return set(first) & set(second)\n\n\ndef unique_preserve_order(items):\n    seen = set()\n    result = []\n    for item in items:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result',
      tests: [
        'assert common_tags(["python", "api"], ["api", "sql"]) == {"api"}',
        'assert unique_preserve_order(["b", "a", "b", "c"]) == ["b", "a", "c"]',
        'assert unique_preserve_order([]) == []'
      ]
    },
    quiz: [
      {
        q: 'Сохраняет ли `set` порядок элементов?',
        options: ['Да, всегда', 'Нет, порядок не гарантируется', 'Только для чисел', 'Только для строк'],
        answer: 1,
        explain: 'Множество оптимизировано для проверки вхождения, а не для порядка.'
      },
      {
        q: 'Что даёт `a & b` для множеств?',
        options: ['Объединение', 'Пересечение', 'Разность', 'Симметричную разность'],
        answer: 1,
        explain: '`&` оставляет элементы, которые есть в обоих множествах.'
      }
    ]
  },
  {
    id: 'comprehensions',
    title: 'Comprehensions',
    summary: 'Списки, словари, множества и генераторы в одну строку.',
    minutes: 9,
    goal:
      'Писать преобразования коллекций компактно, не превращая код в нечитаемую головоломку.',
    ideas: [
      '`[expr for item in items if condition]` — список; `{}` с двоеточием — словарь; без двоеточия — множество.',
      'Генераторное выражение `(expr for item in items)` лениво и не создаёт список.',
      'Несколько `for` читаются слева направо, как вложенные циклы.',
      'Если comprehension не помещается в одну-две строки, обычный цикл часто понятнее.'
    ],
    sources: [
      {
        file: 'collections/05_comprehensions.py',
        focus: [
          { function: 'squares', note: 'Простое преобразование.' },
          { function: 'even_squares', note: 'Фильтр внутри comprehension.' },
          { function: 'lengths', note: 'Словарное включение.' },
          { function: 'flatten', note: 'Два уровня вложенности.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `even_squares(numbers)` — квадраты чётных чисел, и `flatten(matrix)` — плоский список из списка списков.',
      hint: 'Фильтр: `if number % 2 == 0`. Для flatten: `[value for row in matrix for value in row]`.',
      starter: 'def even_squares(numbers):\n    pass\n\n\ndef flatten(matrix):\n    pass\n',
      solution:
        'def even_squares(numbers):\n    return [number ** 2 for number in numbers if number % 2 == 0]\n\n\ndef flatten(matrix):\n    return [value for row in matrix for value in row]',
      tests: [
        'assert even_squares([1, 2, 3, 4]) == [4, 16]',
        'assert even_squares([]) == []',
        'assert flatten([[1, 2], [3], [4, 5]]) == [1, 2, 3, 4, 5]'
      ]
    },
    quiz: [
      {
        q: 'Что создаёт `(x for x in range(3))`?',
        options: ['Список', 'Кортеж', 'Генератор', 'Множество'],
        answer: 2,
        explain: 'Круглые скобки без вызова функции создают ленивый генератор.'
      },
      {
        q: 'Что делает `[x for x in items if x > 0]`?',
        options: ['Оставляет положительные элементы', 'Заменяет отрицательные', 'Сортирует список', 'Считает сумму'],
        answer: 0,
        explain: 'Условие после `if` фильтрует элементы.'
      }
    ]
  },
  {
    id: 'key-functions',
    title: 'lambda и ключ сортировки',
    summary: 'Функция как правило: key, lambda, sorted и max.',
    minutes: 8,
    goal: 'Понять, что `key` — это функция, и научиться задавать правило сортировки коротко и читаемо.',
    ideas: [
      '`key` получает элемент и возвращает критерий, по которому его сравнивают.',
      '`lambda x: ...` — короткая функция без имени для одного выражения.',
      '`sorted(items, key=len)` сортирует по длине, не меняя исходный список.',
      '`min` и `max` тоже принимают `key`.'
    ],
    sources: [
      {
        file: 'collections/07_key_functions.py',
        focus: [
          {
            function: 'sort_by_length',
            note: 'key=len.'
          },
          {
            function: 'sort_by_abs',
            note: 'key=abs.'
          },
          {
            function: 'max_by',
            note: 'Передача функции как аргумента.'
          }
        ]
      }
    ],
    practice: {
      task: 'Напиши `sort_by_length(words)` — сортировка по длине, `sort_by_abs(numbers)` — по модулю и `max_by(items, key)` — максимум по переданному ключу.',
      hint: 'Передай функцию в `key`: `len`, `abs` или `lambda`. Для `max_by` верни `max(items, key=key)`.',
      starter: 'def sort_by_length(words):\n    pass\n\n\ndef sort_by_abs(numbers):\n    pass\n\n\ndef max_by(items, key):\n    pass\n',
      solution: 'def sort_by_length(words):\n    return sorted(words, key=len)\n\n\ndef sort_by_abs(numbers):\n    return sorted(numbers, key=abs)\n\n\ndef max_by(items, key):\n    return max(items, key=key)\n',
      tests: [
        'assert sort_by_length(["python", "go", "rust"]) == ["go", "rust", "python"]',
        'assert sort_by_abs([-5, 2, -1]) == [-1, 2, -5]',
        'assert max_by([{"n": 1}, {"n": 5}], key=lambda item: item["n"]) == {"n": 5}',
        'assert max_by(["aa", "b"], key=len) == "aa"'
      ]
    },
    quiz: [
      {
        q: 'Что получает функция в `key`?',
        options: [
          'Индекс элемента',
          'Сам элемент',
          'Весь список',
          'Длину списка'
        ],
        answer: 1,
        explain: '`key` вызывается для каждого элемента и возвращает критерий сравнения.'
      },
      {
        q: 'Когда `lambda` уместна?',
        options: [
          'Для длинной функции с ветвлениями',
          'Для короткого правила в `key`',
          'Вместо любого `def`',
          'Только для чисел'
        ],
        answer: 1,
        explain: 'Lambda хороша для одного короткого выражения; сложную логику лучше вынести в именованную функцию.'
      }
    ]
  },
  {
    id: 'sorting',
    title: 'Сортировка',
    summary: 'sorted, key, reverse и стабильность сортировки.',
    minutes: 8,
    goal:
      'Сортировать числа, строки и объекты по одному или нескольким полям, не изобретая собственные алгоритмы.',
    ideas: [
      '`sorted(items)` возвращает новый список, `list.sort()` сортирует на месте.',
      '`key` принимает функцию, которая возвращает критерий сортировки.',
      'Сортировка стабильна: элементы с одинаковым ключом сохраняют исходный порядок.',
      'Несколько полей задаются кортежем в `key`, например `(-grade, name)`.'
    ],
    sources: [
      {
        file: 'collections/06_sorting.py',
        focus: [
          { function: 'sort_numbers', note: 'Новый список против сортировки на месте.' },
          { function: 'sort_words_by_length', note: 'Ключ — длина строки.' },
          { function: 'sort_students', note: 'Два поля и обратный порядок оценки.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `sort_students(students)`, где students — список словарей с ключами `name` и `grade`. Отсортируй по убыванию grade, при равенстве — по имени.',
      hint: 'Верни `sorted(students, key=lambda item: (-item["grade"], item["name"]))`.',
      starter: 'def sort_students(students):\n    pass\n',
      solution:
        'def sort_students(students):\n    return sorted(students, key=lambda item: (-item["grade"], item["name"]))',
      tests: [
        'data = [{"name": "Борис", "grade": 75}, {"name": "Анна", "grade": 92}, {"name": "Вера", "grade": 92}]\nassert [item["name"] for item in sort_students(data)] == ["Анна", "Вера", "Борис"]',
        'assert sort_students([]) == []'
      ]
    },
    quiz: [
      {
        q: 'Чем `sorted(items)` отличается от `items.sort()`?',
        options: ['Ничем', 'sorted возвращает новый список', 'sort возвращает новый список', 'sorted работает только с числами'],
        answer: 1,
        explain: '`sorted` не меняет исходный объект, а `list.sort` сортирует на месте и возвращает None.'
      },
      {
        q: 'Зачем в `key` возвращать кортеж?',
        options: ['Чтобы ускорить сортировку', 'Чтобы задать несколько критериев', 'Чтобы отсортировать по убыванию', 'Это ошибка'],
        answer: 1,
        explain: 'Кортежи сравниваются лексикографически: сначала первый элемент, затем второй.'
      }
    ]
  }
];
