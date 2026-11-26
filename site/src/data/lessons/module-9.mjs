export default [
  {
    id: 'concurrency-overview',
    title: 'Потоки, процессы и async',
    summary: 'Три инструмента конкурентности — и когда какой брать.',
    minutes: 6,
    goal:
      'Понять разницу между ожиданием ввода-вывода и вычислениями и запомнить, какой инструмент подходит в каждом случае.',
    ideas: [
      'Если программа ждёт сеть или диск, процессор простаивает. async и потоки помогают заняться другим делом.',
      'Потоки делят память, но в CPython байт-код одновременно исполняет только один поток — это GIL.',
      'Процессы не делят память и подходят для тяжёлых вычислений, но обмен данными сложнее.',
      'async — один поток и явные `await`: удобно для множества сетевых запросов.',
      'Это только карта: для настоящих конкурентных задач нужна отдельная практика.'
    ],
    sources: [
      {
        file: 'advanced/01_concurrency.py',
        focus: [
          { function: 'run_threads', note: 'Два потока ждут одновременно.' },
          { function: 'run_async', note: 'То же ожидание через async и gather.' },
          { function: 'pick_mode', note: 'Грубый выбор инструмента по типу задачи.' }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 2. Разложить задачи',
      steps: [
        {
          label: 'Шаг 1. Выбор инструмента',
          task: 'Напиши `pick_mode(kind)`: для `"io"` верни `"async"`, для `"cpu"` — `"processes"`, иначе `ValueError`.',
          hint: 'Сравни строку и подними `ValueError` для неизвестного значения.',
          starter: 'def pick_mode(kind):\n    pass\n',
          solution:
            'def pick_mode(kind):\n    if kind == "io":\n        return "async"\n    if kind == "cpu":\n        return "processes"\n    raise ValueError("kind: ожидается \'io\' или \'cpu\'")',
          tests: [
            'assert pick_mode("io") == "async"',
            'assert pick_mode("cpu") == "processes"',
            'try:\n    pick_mode("gpu")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
          ]
        }
      ],
      task:
        'Напиши `group_tasks(tasks)`: разложи задачи по видам. Верни словарь `{"io": [имена], "cpu": [имена]}`. Неизвестный `kind` — `ValueError`.',
      hint: 'Создай словарь с двумя пустыми списками и добавляй `task["name"]` по ключу `task["kind"]`.',
      starter: 'def group_tasks(tasks):\n    pass\n',
      solution:
        'def group_tasks(tasks):\n    grouped = {"io": [], "cpu": []}\n    for task in tasks:\n        kind = task["kind"]\n        if kind not in grouped:\n            raise ValueError("kind: ожидается \'io\' или \'cpu\'")\n        grouped[kind].append(task["name"])\n    return grouped',
      tests: [
        'tasks = [{"name": "скачать", "kind": "io"}, {"name": "посчитать", "kind": "cpu"}, {"name": "прочитать", "kind": "io"}]\nassert group_tasks(tasks) == {"io": ["скачать", "прочитать"], "cpu": ["посчитать"]}',
        'assert group_tasks([]) == {"io": [], "cpu": []}',
        'try:\n    group_tasks([{"name": "x", "kind": "gpu"}])\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
      ]
    },
    quiz: [
      {
        q: 'Что лучше выбрать для сотни сетевых запросов?',
        options: ['async или потоки', 'процессы', 'обычный цикл', 'рекурсию'],
        answer: 0,
        explain: 'Запросы больше ждут, чем считают, поэтому подходят async или потоки.'
      },
      {
        q: 'Почему потоки обычно не ускоряют чистые вычисления в CPython?',
        options: ['Из-за GIL', 'Из-за SQL', 'Из-за JSON', 'Потоки всегда быстрее'],
        answer: 0,
        explain: 'GIL разрешает исполнять байт-код Python только одному потоку за раз.'
      }
    ]
  },
  {
    id: 'python-internals',
    title: 'Внутри Python',
    summary: 'GIL, память, дескрипторы и метаклассы — без погружения.',
    minutes: 7,
    goal:
      'Узнать, что скрывается за словами GIL, сборка мусора, дескриптор и метакласс, и не пугаться их в чужом коде.',
    ideas: [
      'GIL упрощает управление памятью, но не даёт исполнять Python-код в нескольких потоках одновременно.',
      'Объект живёт, пока на него есть ссылки. Циклические ссылки подбирает сборщик мусора.',
      'Дескриптор управляет доступом к одному атрибуту через `__get__` и `__set__`.',
      'Метакласс — это «класс для класса». Так фреймворки добавляют поля и поведение.',
      'В прикладном коде это встречается редко; достаточно узнавать идею.'
    ],
    sources: [
      {
        file: 'advanced/02_internals.py',
        focus: [
          { function: 'Positive', note: 'Дескриптор проверяет значение при записи.' },
          { function: 'ModelMeta', note: 'Метакласс добавляет классу имя таблицы.' },
          { function: 'User', note: 'Этот класс создан метаклассом.' },
          { function: 'memory_demo', note: 'Ссылки и удаление имени.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши дескриптор `Positive`: хранит значение в `_имя`, читается через `__get__`, при записи запрещает отрицательные числа через `ValueError`.',
      hint: 'В `__set_name__` запомни `"_" + name`. В `__get__` верни `self`, если `instance is None`, иначе значение из `__dict__`.',
      starter:
        'class Positive:\n    def __set_name__(self, owner, name):\n        pass\n\n    def __get__(self, instance, owner=None):\n        pass\n\n    def __set__(self, instance, value):\n        pass\n',
      solution:
        'class Positive:\n    def __set_name__(self, owner, name):\n        self.name = "_" + name\n\n    def __get__(self, instance, owner=None):\n        if instance is None:\n            return self\n        return getattr(instance, self.name, 0)\n\n    def __set__(self, instance, value):\n        if value < 0:\n            raise ValueError("значение должно быть >= 0")\n        setattr(instance, self.name, value)',
      tests: [
        'class Product:\n    price = Positive()\n\n    def __init__(self, price):\n        self.price = price\n\nproduct = Product(100)\nassert product.price == 100\nproduct.price = 50\nassert product.price == 50',
        'class Product:\n    price = Positive()\n\n    def __init__(self, price):\n        self.price = price\n\nproduct = Product(1)\ntry:\n    product.price = -1\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")',
        'class Product:\n    price = Positive()\n\nassert isinstance(Product.__dict__["price"], Positive)'
      ]
    },
    quiz: [
      {
        q: 'Что делает GIL?',
        options: [
          'Запрещает потоки',
          'Разрешает исполнять байт-код Python только одному потоку за раз',
          'Ускоряет словари',
          'Удаляет память'
        ],
        answer: 1,
        explain: 'Потоки существуют, но Python-код в них выполняется по очереди.'
      },
      {
        q: 'Что такое дескриптор?',
        options: [
          'Объект, который управляет доступом к атрибуту',
          'Тип словаря',
          'Способ запуска файла',
          'Ошибка синтаксиса'
        ],
        answer: 0,
        explain: 'Дескриптор задаёт правила чтения и записи конкретного атрибута.'
      }
    ]
  },
  {
    id: 'testing-toolbox',
    title: 'Тесты: фикстуры и mock',
    summary: 'Параметризация, фикстуры, подмена сервисов и coverage — по верхам.',
    minutes: 7,
    goal:
      'Узнать четыре инструмента pytest, которые делают тесты короче и надёжнее, и попробовать идею подмены зависимости.',
    ideas: [
      'Параметризация запускает один тест на нескольких наборах данных.',
      'Фикстура готовит общие данные и убирает за собой.',
      'Mock подменяет внешний сервис, чтобы тест не ходил в сеть.',
      'Coverage показывает, какие строки тесты не выполнили. 100% — не самоцель.',
      'Если функция принимает зависимость аргументом, её легко заменить в тесте.'
    ],
    sources: [
      {
        file: 'advanced/03_testing.py',
        focus: [
          { function: 'discount', note: 'Правило, которое легко проверить.' },
          { function: 'final_price', note: 'Зависимость приходит аргументом.' },
          { function: 'demo_mock', note: 'patch подменяет внешний вызов.' }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 2. Цена со скидкой',
      steps: [
        {
          label: 'Шаг 1. Скидка',
          task: 'Напиши `discount(price, percent)` — целую скидку в рублях. Для `percent` вне 0–100 подними `ValueError`.',
          hint: '`price * percent // 100`; сначала проверь диапазон.',
          starter: 'def discount(price, percent):\n    pass\n',
          solution:
            'def discount(price, percent):\n    if not 0 <= percent <= 100:\n        raise ValueError("percent: от 0 до 100")\n    return price * percent // 100',
          tests: [
            'assert discount(100, 25) == 25',
            'assert discount(199, 10) == 19',
            'try:\n    discount(100, 101)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
          ]
        }
      ],
      task:
        'Напиши `final_price(price, rate_provider)`. `rate_provider` — функция без аргументов, которая возвращает процент. Верни цену без скидки. Функция `discount` уже дана.',
      hint: 'Получи процент через `rate_provider()` и вычти `discount(price, percent)`. В тесте вместо сервиса передаётся `lambda: 10`.',
      starter:
        'def discount(price, percent):\n    if not 0 <= percent <= 100:\n        raise ValueError("percent: от 0 до 100")\n    return price * percent // 100\n\n\ndef final_price(price, rate_provider):\n    pass\n',
      solution:
        'def discount(price, percent):\n    if not 0 <= percent <= 100:\n        raise ValueError("percent: от 0 до 100")\n    return price * percent // 100\n\n\ndef final_price(price, rate_provider):\n    return price - discount(price, rate_provider())',
      tests: [
        'assert final_price(1000, lambda: 10) == 900',
        'assert final_price(200, lambda: 0) == 200',
        'assert final_price(100, lambda: 100) == 0'
      ]
    },
    quiz: [
      {
        q: 'Зачем нужна параметризация в pytest?',
        options: ['Чтобы один тест проверить на многих данных', 'Чтобы ускорить Python', 'Чтобы заменить mock', 'Чтобы удалить фикстуры'],
        answer: 0,
        explain: '`parametrize` убирает копипасту: один тест — много случаев.'
      },
      {
        q: 'Что делает mock?',
        options: ['Подменяет внешнюю зависимость в тесте', 'Создаёт базу данных', 'Запускает браузер', 'Считает coverage'],
        answer: 0,
        explain: 'Mock возвращает заранее заданный ответ вместо настоящего сервиса.'
      },
      {
        q: 'Что показывает coverage?',
        options: ['Какие строки выполнились в тестах', 'Скорость интернета', 'Количество функций', 'Размер файла'],
        answer: 0,
        explain: 'Отчёт покрытия помогает заметить код, который тесты не затронули.'
      }
    ]
  },
  {
    id: 'algorithms-intro',
    title: 'Алгоритмы и структуры данных',
    summary: 'O(n), двоичный поиск и обход графа — первый шаг.',
    minutes: 8,
    goal:
      'Научиться грубо оценивать скорость алгоритма и познакомиться с двумя базовыми приёмами: двоичным поиском и обходом в ширину.',
    ideas: [
      'O(n) значит «время растёт вместе с данными», O(log n) — «растёт очень медленно».',
      'Двоичный поиск каждый шаг отбрасывает половину, но список должен быть отсортирован.',
      'Доступ по ключу в словаре в среднем O(1), поиск в списке — O(n).',
      'BFS обходит граф слоями и использует очередь.',
      'Дерево — частный случай графа; деревья и графы часто встречаются в задачах.',
      'Это знакомство, а не полноценный курс алгоритмов.'
    ],
    sources: [
      {
        file: 'advanced/04_algorithms.py',
        focus: [
          { function: 'linear_search', note: 'Проверяет элементы по одному.' },
          { function: 'binary_search', note: 'Делит отсортированный список пополам.' },
          { function: 'bfs_order', note: 'Обход графа в ширину через deque.' }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. Обход графа',
      steps: [
        {
          label: 'Шаг 1. Линейный поиск',
          task: 'Напиши `linear_search(items, target)` — индекс первого совпадения или `-1`.',
          hint: 'Пройти циклом `enumerate` и вернуть индекс при совпадении.',
          starter: 'def linear_search(items, target):\n    pass\n',
          solution:
            'def linear_search(items, target):\n    for index, item in enumerate(items):\n        if item == target:\n            return index\n    return -1',
          tests: [
            'assert linear_search([3, 1, 2], 1) == 1',
            'assert linear_search([1, 2], 5) == -1',
            'assert linear_search([], 1) == -1'
          ]
        },
        {
          label: 'Шаг 2. Двоичный поиск',
          task: 'Напиши `binary_search(items, target)` для отсортированного списка. Верни индекс или `-1`.',
          hint: 'Держи `left` и `right`, бери середину и сравнивай с целью.',
          starter: 'def binary_search(items, target):\n    pass\n',
          solution:
            'def binary_search(items, target):\n    left, right = 0, len(items) - 1\n    while left <= right:\n        middle = (left + right) // 2\n        if items[middle] == target:\n            return middle\n        if items[middle] < target:\n            left = middle + 1\n        else:\n            right = middle - 1\n    return -1',
          tests: [
            'assert binary_search([1, 3, 5, 8, 13], 13) == 4',
            'assert binary_search([1, 3, 5], 4) == -1',
            'assert binary_search([], 1) == -1'
          ]
        }
      ],
      task:
        'Напиши `bfs_order(graph, start)` — порядок обхода графа в ширину. Граф — словарь вида `{"A": ["B"]}`. Повторно узлы не добавляй.',
      hint: 'Используй `deque`, множество посещённых и `popleft()`. Добавляй соседей, которых ещё не видели.',
      starter: 'from collections import deque\n\n\ndef bfs_order(graph, start):\n    pass\n',
      solution:
        'from collections import deque\n\n\ndef bfs_order(graph, start):\n    queue = deque([start])\n    seen = {start}\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            if neighbor not in seen:\n                seen.add(neighbor)\n                queue.append(neighbor)\n    return order',
      tests: [
        'graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}\nassert bfs_order(graph, "A") == ["A", "B", "C", "D"]',
        'assert bfs_order({}, "A") == ["A"]',
        'assert bfs_order({"A": ["B"], "B": ["A"]}, "A") == ["A", "B"]'
      ]
    },
    quiz: [
      {
        q: 'Какая сложность у двоичного поиска?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 2,
        explain: 'Каждый шаг уменьшает область поиска примерно вдвое.'
      },
      {
        q: 'Что обязательно для двоичного поиска?',
        options: ['Отсортированный список', 'Словарь', 'Файл на диске', 'Потоки'],
        answer: 0,
        explain: 'Без порядка нельзя понять, в какую половину идти.'
      },
      {
        q: 'Какую структуру удобно использовать для BFS?',
        options: ['Очередь', 'Стек', 'Множество', 'Строку'],
        answer: 0,
        explain: 'BFS обрабатывает узлы в порядке поступления — это очередь.'
      }
    ]
  }
];
