export default [
  {
    id: 'http-basics',
    title: 'HTTP своими руками',
    summary: 'Метод, путь, маршрут и ответ — что скрывает фреймворк.',
    minutes: 9,
    goal:
      'Понять базовую модель HTTP-сервера: приходит метод и путь, находится обработчик, возвращается статус и тело.',
    ideas: [
      'HTTP-запрос состоит из метода (`GET`, `POST`), пути, заголовков и тела.',
      'Маршрутизация сопоставляет пару «метод + путь» с функцией-обработчиком.',
      'Путь может содержать параметр: `/users/{id}`.',
      'Фреймворк автоматически разбирает запрос и сериализует ответ, но модель остаётся той же.'
    ],
    sources: [
      {
        file: 'web/01_http_server.py',
        focus: [
          { function: 'match_route', note: 'Точные маршруты и параметр пути.' },
          { function: 'make_handler', note: 'Обработчик для стандартного http.server.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `match_route(method, path)`: для `GET /health` верни `"ok"`, для `POST /users` — `"created"`, для `GET /users/{id}` — `"user:<id>"`, иначе `"404"`.',
      hint: 'Сначала проверь точные пары, затем разбери путь по `/` и проверь, что второй сегмент — число.',
      starter: 'def match_route(method, path):\n    pass\n',
      solution:
        'def match_route(method, path):\n    exact = {\n        ("GET", "/health"): "ok",\n        ("POST", "/users"): "created",\n    }\n    key = (method.upper(), path)\n    if key in exact:\n        return exact[key]\n\n    parts = path.strip("/").split("/")\n    if method.upper() == "GET" and len(parts) == 2 and parts[0] == "users" and parts[1].isdigit():\n        return f"user:{parts[1]}"\n    return "404"',
      tests: [
        'assert match_route("GET", "/health") == "ok"',
        'assert match_route("POST", "/users") == "created"',
        'assert match_route("GET", "/users/42") == "user:42"',
        'assert match_route("GET", "/missing") == "404"',
        'assert match_route("GET", "/users/abc") == "404"'
      ]
    },
    quiz: [
      {
        q: 'Что определяет маршрут в HTTP-сервере?',
        options: ['Только путь', 'Метод и путь', 'Только заголовок Host', 'Порт'],
        answer: 1,
        explain: 'Один и тот же путь может обрабатываться по-разному для GET и POST.'
      },
      {
        q: 'Что означает параметр `{id}` в пути?',
        options: ['Имя файла', 'Переменную часть пути', 'HTTP-заголовок', 'Статус-код'],
        answer: 1,
        explain: 'Фреймворк извлекает значение из URL и передаёт его в обработчик.'
      }
    ]
  },
  {
    id: 'fastapi',
    title: 'FastAPI',
    summary: 'Маршруты, Pydantic-модели и автодокументация.',
    minutes: 12,
    goal:
      'Прочитать и собрать минимальный API на FastAPI, понимая, откуда берутся валидация и документация.',
    ideas: [
      '`FastAPI()` создаёт приложение, а декораторы `@app.get` и `@app.post` регистрируют маршруты.',
      'Аннотации типов используются для валидации и генерации OpenAPI.',
      'Pydantic-модель описывает тело запроса и ответа.',
      '`HTTPException` возвращает корректный HTTP-статус и JSON с ошибкой.'
    ],
    sources: [
      {
        file: 'web/02_fastapi_intro.py',
        focus: [
          { function: 'create_app', note: 'Полное приложение: health, список, создание, получение.' },
          { function: 'dependency_status', note: 'Проверка, установлены ли зависимости.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши класс `Router` с методами `add(method, path, handler)` и `resolve(method, path)`. При совпадении верни результат handler, иначе `"404"`.',
      hint: 'Храни маршруты в словаре с ключом `(method.upper(), path)`. Handler может быть lambda без аргументов.',
      starter: 'class Router:\n    def __init__(self):\n        self.routes = {}\n\n    def add(self, method, path, handler):\n        pass\n\n    def resolve(self, method, path):\n        pass\n',
      solution:
        'class Router:\n    def __init__(self):\n        self.routes = {}\n\n    def add(self, method, path, handler):\n        self.routes[(method.upper(), path)] = handler\n\n    def resolve(self, method, path):\n        handler = self.routes.get((method.upper(), path))\n        return handler() if handler else "404"',
      tests: [
        'router = Router()\nrouter.add("GET", "/health", lambda: "ok")\nassert router.resolve("GET", "/health") == "ok"',
        'router = Router()\nassert router.resolve("GET", "/missing") == "404"',
        'router = Router()\nrouter.add("POST", "/users", lambda: "created")\nassert router.resolve("post", "/users") == "created"'
      ]
    },
    quiz: [
      {
        q: 'Откуда FastAPI берёт схему валидации?',
        options: ['Из отдельного YAML', 'Из аннотаций типов и Pydantic-моделей', 'Из комментариев', 'Из переменных окружения'],
        answer: 1,
        explain: 'Аннотации и модели одновременно служат валидацией и источником OpenAPI-схемы.'
      },
      {
        q: 'Что делает `HTTPException(status_code=404)`?',
        options: ['Завершает сервер', 'Возвращает клиенту ошибку с указанным статусом', 'Создаёт маршрут', 'Логирует запрос'],
        answer: 1,
        explain: 'FastAPI превращает исключение в JSON-ответ с нужным HTTP-статусом.'
      }
    ]
  },
  {
    id: 'pydantic',
    title: 'Pydantic и валидация',
    summary: 'Модели данных, типы и понятные ошибки.',
    minutes: 10,
    goal:
      'Валидировать входные данные декларативно и понимать, какую работу Pydantic делает за разработчика.',
    ideas: [
      'Модель Pydantic — класс с аннотированными полями, который проверяет данные при создании.',
      '`Field(gt=0, lt=150)` задаёт ограничения на число.',
      'При ошибке выбрасывается `ValidationError` с перечнем проблем.',
      'Валидация на границе приложения защищает внутренний код от грязных данных.'
    ],
    sources: [
      {
        file: 'web/03_pydantic.py',
        focus: [
          { function: 'validate_user', note: 'Ручная валидация без зависимостей.' },
          { function: 'try_pydantic', note: 'Та же идея через Pydantic, если он установлен.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `validate_user(email, age, name)`: email должен содержать `@`, возраст быть от 1 до 149, имя непустым. Верни словарь с нормализованными данными, иначе ValueError.',
      hint: 'Нормализуй email к нижнему регистру, имя через strip. Проверяй условия по порядку.',
      starter: 'def validate_user(email, age, name):\n    pass\n',
      solution:
        'def validate_user(email, age, name):\n    if "@" not in email:\n        raise ValueError("email должен содержать @")\n    if not 0 < age < 150:\n        raise ValueError("возраст должен быть от 1 до 149")\n    if not name.strip():\n        raise ValueError("имя не может быть пустым")\n    return {"email": email.lower(), "age": age, "name": name.strip()}',
      tests: [
        'assert validate_user("Anna@Example.com", 27, " Анна ") == {"email": "anna@example.com", "age": 27, "name": "Анна"}',
        'try:\n    validate_user("wrong", 20, "Анна")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")',
        'try:\n    validate_user("a@b.c", 200, "Анна")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
      ]
    },
    quiz: [
      {
        q: 'Когда Pydantic проверяет данные?',
        options: ['При импорте модуля', 'При создании модели', 'Только при сериализации в JSON', 'Раз в минуту'],
        answer: 1,
        explain: 'Валидация выполняется в момент создания объекта модели.'
      },
      {
        q: 'Что лучше валидировать на границе приложения?',
        options: ['Внутренние переменные циклов', 'Входные данные API', 'Имена функций', 'Комментарии'],
        answer: 1,
        explain: 'После проверки внутри можно работать с уже проверенными данными.'
      }
    ]
  },
  {
    id: 'sqlite',
    title: 'SQLite',
    summary: 'SQL, параметризованные запросы и транзакции.',
    minutes: 11,
    goal:
      'Подключиться к SQLite из Python, создать таблицу, вставить и прочитать данные без SQL-инъекций.',
    ideas: [
      '`sqlite3.connect(":memory:")` создаёт базу в памяти — удобно для примеров и тестов.',
      'Параметры передаются через `?`, а не через f-строку: это защита от инъекций.',
      '`commit()` фиксирует изменения, `close()` освобождает соединение.',
      'Ограничения БД (`UNIQUE`, `NOT NULL`) — часть модели данных, а не только проверка в Python.'
    ],
    sources: [
      {
        file: 'web/04_sqlite.py',
        focus: [
          { function: 'create_schema', note: 'DDL и ограничения.' },
          { function: 'add_user', note: 'Параметризованный INSERT.' },
          { function: 'list_users', note: 'SELECT и порядок.' },
          { function: 'find_by_email', note: 'Поиск по параметру.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `build_insert(table, data)`, возвращающую пару `(sql, params)` для INSERT с placeholders `?`. Ключи data — колонки.',
      hint: 'Колонки — `", ".join(data)`, placeholders — `", ".join("?" for _ in data)`. Параметры — `tuple(data.values())`.',
      starter: 'def build_insert(table, data):\n    pass\n',
      solution:
        'def build_insert(table, data):\n    columns = ", ".join(data)\n    placeholders = ", ".join("?" for _ in data)\n    sql = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"\n    return sql, tuple(data.values())',
      tests: [
        'assert build_insert("users", {"name": "Анна", "email": "a@b.c"}) == ("INSERT INTO users (name, email) VALUES (?, ?)", ("Анна", "a@b.c"))',
        'assert build_insert("tags", {"title": "python"})[0] == "INSERT INTO tags (title) VALUES (?)"'
      ]
    },
    quiz: [
      {
        q: 'Почему нельзя собирать SQL через f-строку с пользовательским вводом?',
        options: ['Это медленно', 'Возможна SQL-инъекция', 'SQLite не поддерживает f-строки', 'Запрос станет нечитаемым'],
        answer: 1,
        explain: 'Параметры через `?` отделяют данные от SQL-кода.'
      },
      {
        q: 'Что делает `connection.commit()`?',
        options: ['Открывает соединение', 'Фиксирует транзакцию', 'Удаляет таблицу', 'Создаёт резервную копию'],
        answer: 1,
        explain: 'Без commit изменения могут не сохраниться.'
      }
    ]
  },
  {
    id: 'async',
    title: 'async/await',
    summary: 'Конкурентный ввод-вывод без потоков и лишней сложности.',
    minutes: 11,
    goal:
      'Понять, зачем нужен async в веб-приложениях, и запускать несколько операций ввода-вывода конкурентно.',
    ideas: [
      '`async def` создаёт корутину; её нужно запустить через `await` или `asyncio.run`.',
      '`await` отдаёт управление другим задачам, пока текущая ждёт.',
      '`asyncio.gather` запускает несколько корутин конкурентно.',
      'async ускоряет ввод-вывод, но не делает CPU-вычисления параллельными.'
    ],
    sources: [
      {
        file: 'web/05_async.py',
        focus: [
          { function: 'fetch_user', note: 'Корутина с имитацией запроса.' },
          { function: 'fetch_all', note: 'gather запускает задачи конкурентно.' },
          { function: 'with_timeout', note: 'Ограничение времени ожидания.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `async def fetch_user(user_id)`, которая ждёт `asyncio.sleep(0)` и возвращает словарь `{"id": user_id, "name": f"user-{user_id}"}`.',
      hint: 'Не забудь `await asyncio.sleep(0)`. Проверка выполнит корутину через `await` в асинхронной среде.',
      starter: 'import asyncio\n\n\nasync def fetch_user(user_id):\n    pass\n',
      solution:
        'import asyncio\n\n\nasync def fetch_user(user_id):\n    await asyncio.sleep(0)\n    return {"id": user_id, "name": f"user-{user_id}"}',
      tests: [
        'result = await fetch_user(1)\nassert result == {"id": 1, "name": "user-1"}',
        'result = await fetch_user(7)\nassert result["id"] == 7'
      ]
    },
    quiz: [
      {
        q: 'Что делает `await`?',
        options: ['Блокирует весь сервер', 'Передаёт управление, пока операция ждёт', 'Создаёт поток', 'Ускоряет CPU-вычисления'],
        answer: 1,
        explain: 'Пока одна корутина ждёт ввода-вывода, event loop выполняет другие задачи.'
      },
      {
        q: 'Для чего async подходит лучше всего?',
        options: ['Сортировка большого списка', 'Сетевые запросы и файлы', 'Матричные вычисления', 'Рендеринг 3D'],
        answer: 1,
        explain: 'Async выигрывает там, где программа большую часть времени ждёт внешние операции.'
      }
    ]
  }
];
