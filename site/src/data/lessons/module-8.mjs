export default [
  {
    id: 'http-client',
    title: 'HTTP-клиент',
    summary: 'URL, статус-коды и JSON-ответ.',
    minutes: 8,
    goal: 'Разобрать, из чего состоит HTTP-запрос и ответ, и научиться читать URL и статус.',
    ideas: [
      'URL состоит из схемы, хоста, пути и параметров запроса.',
      '`urlparse` разбирает адрес, `parse_qs` превращает строку параметров в словарь.',
      'Статусы 2xx — успех, 4xx — ошибка клиента, 5xx — ошибка сервера.',
      'Ответ API часто приходит в JSON и превращается в словарь или список.'
    ],
    sources: [
      {
        file: 'web/00_http_client.py',
        focus: [
          {
            function: 'parse_url',
            note: 'Схема, хост, путь и query.'
          },
          {
            function: 'is_success',
            note: 'Проверка статуса 2xx.'
          }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. URL и статус',
      steps: [
        {
          label: 'Шаг 1. Схема и хост',
          task: 'Напиши `host_and_scheme(url)` → `(scheme, host)`.',
          hint: '`urlparse(url)`; `parsed.scheme` и `parsed.hostname`.',
          starter: 'def host_and_scheme(url):\n    pass\n',
          solution: 'from urllib.parse import urlparse\n\n\ndef host_and_scheme(url):\n    parsed = urlparse(url)\n    return parsed.scheme, parsed.hostname\n',
          tests: [
            'assert host_and_scheme("https://example.com/api") == ("https", "example.com")'
          ]
        },
        {
          label: 'Шаг 2. Параметры',
          task: 'Напиши `query_params(url)` — словарь параметров запроса.',
          hint: '`parse_qs(urlparse(url).query)`.',
          starter: 'def query_params(url):\n    pass\n',
          solution: 'from urllib.parse import parse_qs, urlparse\n\n\ndef query_params(url):\n    return parse_qs(urlparse(url).query)\n',
          tests: [
            'assert query_params("https://example.com?page=2&limit=10") == {"page": ["2"], "limit": ["10"]}',
            'assert query_params("https://example.com") == {}'
          ]
        }
      ],
      task: 'Напиши `parse_url(url)` → словарь с `scheme`, `host`, `path` (по умолчанию `/`) и `query`, а также `is_success(status)` → `True` для 2xx.',
      hint: 'Используй `urlparse` и `parse_qs` из `urllib.parse`. Для успеха проверь `200 <= status < 300`.',
      starter: 'def parse_url(url):\n    pass\n\n\ndef is_success(status):\n    pass\n',
      solution: 'from urllib.parse import parse_qs, urlparse\n\n\ndef parse_url(url):\n    parsed = urlparse(url)\n    return {\n        "scheme": parsed.scheme,\n        "host": parsed.hostname,\n        "path": parsed.path or "/",\n        "query": parse_qs(parsed.query),\n    }\n\n\ndef is_success(status):\n    return 200 <= status < 300\n',
      tests: [
        'data = parse_url("https://example.com/api?page=2&limit=10")\nassert data["scheme"] == "https"\nassert data["host"] == "example.com"\nassert data["path"] == "/api"\nassert data["query"] == {"page": ["2"], "limit": ["10"]}',
        'assert parse_url("https://example.com")["path"] == "/"',
        'assert is_success(200) is True\nassert is_success(204) is True\nassert is_success(404) is False\nassert is_success(500) is False'
      ]
    },
    quiz: [
      {
        q: 'Что означает статус 404?',
        options: [
          'Успех',
          'Ошибка клиента: ресурс не найден',
          'Ошибка сервера',
          'Перенаправление'
        ],
        answer: 1,
        explain: '4xx — ошибки на стороне клиента; 404 — конкретный ресурс не найден.'
      },
      {
        q: 'Зачем разбирать URL на части?',
        options: [
          'Чтобы получить хост, путь и параметры по отдельности',
          'Чтобы ускорить сеть',
          'Чтобы зашифровать запрос',
          'Это требование JSON'
        ],
        answer: 0,
        explain: 'Из частей URL собирают запросы, проверяют домен и читают параметры.'
      }
    ]
  },
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
    id: 'pydantic',
    title: 'Pydantic и валидация',
    summary: 'Модели данных, типы и понятные ошибки.',
    minutes: 10,
    goal: 'Валидировать входные данные декларативно и понимать, какую работу Pydantic делает за разработчика.',
    ideas: [
      'Модель Pydantic — класс с аннотированными полями, который проверяет данные при создании.',
      '`Field(gt=0, lt=150)` задаёт ограничения на число.',
      'При ошибке выбрасывается `ValidationError` с перечнем проблем.',
      'Валидация на границе приложения защищает внутренний код от грязных данных.',
      'В браузерной практике мы повторяем правила вручную; настоящая модель Pydantic запускается локально из `src/python/web/03_pydantic.py`.'
    ],
    sources: [
      {
        file: 'web/03_pydantic.py',
        focus: [
          {
            function: 'validate_user',
            note: 'Ручная валидация без зависимостей.'
          },
          {
            function: 'try_pydantic',
            note: 'Та же идея через Pydantic, если он установлен.'
          }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. validate_user',
      steps: [
        {
          label: 'Шаг 1. Email',
          task: 'Напиши `check_email(email)` — вернуть email в нижнем регистре или `ValueError`, если нет `@`.',
          hint: 'Проверь `"@" not in email` и нормализуй через `lower()`.',
          starter: 'def check_email(email):\n    pass\n',
          solution: 'def check_email(email):\n    if "@" not in email:\n        raise ValueError("email должен содержать @")\n    return email.lower()\n',
          tests: [
            'assert check_email("Anna@Example.com") == "anna@example.com"',
            'try:\n    check_email("wrong")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
          ]
        },
        {
          label: 'Шаг 2. Возраст',
          task: 'Напиши `check_age(age)` — вернуть возраст, если `0 < age < 150`, иначе `ValueError`.',
          hint: 'Проверь границы и подними ошибку.',
          starter: 'def check_age(age):\n    pass\n',
          solution: 'def check_age(age):\n    if not 0 < age < 150:\n        raise ValueError("возраст должен быть от 1 до 149")\n    return age\n',
          tests: [
            'assert check_age(27) == 27',
            'try:\n    check_age(200)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
          ]
        }
      ],
      task: 'Напиши `validate_user(email, age, name)`: email должен содержать `@`, возраст быть от 1 до 149, имя непустым. Верни словарь с нормализованными данными, иначе ValueError.',
      hint: 'Нормализуй email к нижнему регистру, имя через strip. Проверяй условия по порядку.',
      starter: 'def validate_user(email, age, name):\n    pass\n',
      solution: 'def validate_user(email, age, name):\n    if "@" not in email:\n        raise ValueError("email должен содержать @")\n    if not 0 < age < 150:\n        raise ValueError("возраст должен быть от 1 до 149")\n    if not name.strip():\n        raise ValueError("имя не может быть пустым")\n    return {"email": email.lower(), "age": age, "name": name.strip()}',
      tests: [
        'assert validate_user("Anna@Example.com", 27, " Анна ") == {"email": "anna@example.com", "age": 27, "name": "Анна"}',
        'try:\n    validate_user("wrong", 20, "Анна")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")',
        'try:\n    validate_user("a@b.c", 200, "Анна")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
      ]
    },
    quiz: [
      {
        q: 'Когда Pydantic проверяет данные?',
        options: [
          'При импорте модуля',
          'При создании модели',
          'Только при сериализации в JSON',
          'Раз в минуту'
        ],
        answer: 1,
        explain: 'Валидация выполняется в момент создания объекта модели.'
      },
      {
        q: 'Что лучше валидировать на границе приложения?',
        options: [
          'Внутренние переменные циклов',
          'Входные данные API',
          'Имена функций',
          'Комментарии'
        ],
        answer: 1,
        explain: 'После проверки внутри можно работать с уже проверенными данными.'
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
      '`HTTPException` возвращает корректный HTTP-статус и JSON с ошибкой.',
      'В браузере мы не поднимаем настоящий сервер: тренируем модель маршрутизации. Реальное приложение FastAPI — в `src/python/web/02_fastapi_intro.py`.'
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
      mainLabel: 'Шаг 3. Router',
      steps: [
        {
          label: 'Шаг 1. Добавить маршрут',
          task: 'Напиши `add_route(routes, method, path, handler)` — сохранить обработчик по ключу `(method.upper(), path)`.',
          hint: 'Верни обновлённый словарь.',
          starter: 'def add_route(routes, method, path, handler):\n    pass\n',
          solution: 'def add_route(routes, method, path, handler):\n    routes[(method.upper(), path)] = handler\n    return routes\n',
          tests: [
            'routes = {}\nadd_route(routes, "get", "/health", lambda: "ok")\nassert routes[("GET", "/health")]() == "ok"'
          ]
        },
        {
          label: 'Шаг 2. Найти обработчик',
          task: 'Напиши `resolve_route(routes, method, path)` — вернуть результат обработчика или `"404"`.',
          hint: 'Найди по ключу и вызови handler, если он есть.',
          starter: 'def resolve_route(routes, method, path):\n    pass\n',
          solution: 'def resolve_route(routes, method, path):\n    handler = routes.get((method.upper(), path))\n    return handler() if handler else "404"\n',
          tests: [
            'routes = {("GET", "/health"): lambda: "ok"}\nassert resolve_route(routes, "get", "/health") == "ok"\nassert resolve_route(routes, "GET", "/missing") == "404"'
          ]
        }
      ],
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
    id: 'sqlite',
    title: 'SQLite',
    summary: 'SQL, параметризованные запросы и транзакции.',
    minutes: 11,
    goal:
      'Подключиться к SQLite из Python, создать таблицу, вставить и прочитать данные без SQL-инъекций.',
    ideas: [
      '`sqlite3.connect(":memory:")` создаёт базу в памяти — удобно для примеров и тестов.',
      'Параметры передаются через `?`, а не через f-строку: это защита от инъекций. Имена таблиц и колонок параметризовать нельзя — их берут только из доверенного списка.',
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
      mainLabel: 'Шаг 3. build_insert',
      steps: [
        {
          label: 'Шаг 1. Колонки',
          task: 'Напиши `columns(data)` — имена колонок через запятую.',
          hint: '`", ".join(data)`.',
          starter: 'def columns(data):\n    pass\n',
          solution: 'def columns(data):\n    return ", ".join(data)\n',
          tests: [
            'assert columns({"name": "A", "email": "b"}) == "name, email"',
            'assert columns({"title": "x"}) == "title"'
          ]
        },
        {
          label: 'Шаг 2. Placeholders',
          task: 'Напиши `placeholders(count)` — строку из `count` знаков `?` через запятую.',
          hint: '`", ".join("?" for _ in range(count))`.',
          starter: 'def placeholders(count):\n    pass\n',
          solution: 'def placeholders(count):\n    return ", ".join("?" for _ in range(count))\n',
          tests: [
            'assert placeholders(2) == "?, ?"',
            'assert placeholders(1) == "?"'
          ]
        }
      ],
      task:
        'Напиши `build_insert(table, data)`, возвращающую пару `(sql, params)` для INSERT с placeholders `?`. Считай `table` и ключи `data` доверенными идентификаторами из кода; значения передаются только через `?`.',
      hint: 'Колонки — `", ".join(data)`, placeholders — `", ".join("?" for _ in data)`. Параметры — `tuple(data.values())`. Имена таблицы и колонок нельзя подставить через `?`, поэтому они должны быть константами или из белого списка.',
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
        explain: 'Параметры через `?` отделяют данные от SQL-кода. Имена таблиц и колонок параметризовать нельзя — их берут только из белого списка.'
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
    id: 'sql-practice',
    title: 'SQL-практикум',
    summary: 'SELECT, параметры и чтение результата через sqlite3.',
    minutes: 10,
    goal: 'Выполнять реальные SQL-запросы из Python и безопасно передавать значения через параметры.',
    ideas: [
      '`connection.execute(sql, params)` выполняет запрос и возвращает курсор.',
      '`?` подставляет значение безопасно; не склеивай SQL через f-строку.',
      '`fetchone()` возвращает одну строку или `None`, `fetchall()` — все.',
      '`executemany()` вставляет несколько строк за один вызов.'
    ],
    sources: [
      {
        file: 'web/06_sql_practice.py',
        focus: [
          {
            function: 'setup',
            note: 'Создание таблицы и пакетная вставка.'
          },
          {
            function: 'find_user',
            note: 'SELECT с параметром.'
          },
          {
            function: 'count_users',
            note: 'Агрегатный запрос.'
          }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. Поиск и количество',
      steps: [
        {
          label: 'Шаг 1. Все имена',
          task: 'Напиши `all_names(connection)` — список имён из таблицы `users`.',
          hint: '`SELECT name FROM users`, затем `fetchall()` и собери первые элементы.',
          starter: 'def all_names(connection):\n    pass\n',
          solution: 'def all_names(connection):\n    rows = connection.execute("SELECT name FROM users").fetchall()\n    return [row[0] for row in rows]\n',
          tests: [
            'import sqlite3\nconnection = sqlite3.connect(":memory:")\nconnection.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)")\nconnection.executemany("INSERT INTO users (name) VALUES (?)", [("Анна",), ("Борис",)])\nassert all_names(connection) == ["Анна", "Борис"]\nconnection.close()'
          ]
        },
        {
          label: 'Шаг 2. Поиск по имени',
          task: 'Напиши `find_user(connection, name)` → `(id, name)` или `None`.',
          hint: '`SELECT id, name FROM users WHERE name = ?` и параметр `(name,)`.',
          starter: 'def find_user(connection, name):\n    pass\n',
          solution: 'def find_user(connection, name):\n    return connection.execute(\n        "SELECT id, name FROM users WHERE name = ?", (name,)\n    ).fetchone()\n',
          tests: [
            'import sqlite3\nconnection = sqlite3.connect(":memory:")\nconnection.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)")\nconnection.executemany("INSERT INTO users (name) VALUES (?)", [("Анна",), ("Борис",)])\nassert find_user(connection, "Анна") == (1, "Анна")\nassert find_user(connection, "нет") is None\nconnection.close()'
          ]
        }
      ],
      task: 'Дана таблица `users(id, name)`. Напиши `find_user(connection, name)` → `(id, name)` или `None` и `count_users(connection)` → количество строк. Используй параметры `?`.',
      hint: 'Для поиска: `SELECT id, name FROM users WHERE name = ?` и `(name,)`. Для количества: `SELECT COUNT(*) FROM users`.',
      starter: 'def find_user(connection, name):\n    pass\n\n\ndef count_users(connection):\n    pass\n',
      solution: 'def find_user(connection, name):\n    return connection.execute(\n        "SELECT id, name FROM users WHERE name = ?", (name,)\n    ).fetchone()\n\n\ndef count_users(connection):\n    return connection.execute("SELECT COUNT(*) FROM users").fetchone()[0]\n',
      tests: [
        'import sqlite3\nconnection = sqlite3.connect(":memory:")\nconnection.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)")\nconnection.executemany("INSERT INTO users (name) VALUES (?)", [("Анна",), ("Борис",)])\nassert find_user(connection, "Анна") == (1, "Анна")\nassert find_user(connection, "нет") is None\nassert count_users(connection) == 2\nconnection.close()'
      ]
    },
    quiz: [
      {
        q: 'Почему значения передают через `?`, а не через f-строку?',
        options: [
          'Это быстрее',
          'Это защищает от SQL-инъекций',
          'SQLite не понимает f-строки',
          'Так короче'
        ],
        answer: 1,
        explain: 'Параметры отделяют данные от SQL-кода и не дают подставить опасную конструкцию.'
      },
      {
        q: 'Что вернёт `fetchone()`, если строк нет?',
        options: [
          'Пустой список',
          'None',
          '0',
          'Ошибку'
        ],
        answer: 1,
        explain: '`fetchone` возвращает `None`, когда результатов больше нет.'
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
      'В браузерной практике используется `await`; `asyncio.run` подходит для обычного скрипта, но не для уже запущенного event loop.',
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
      mainLabel: 'Шаг 3. fetch_user',
      steps: [
        {
          label: 'Шаг 1. Первая корутина',
          task: 'Напиши `async def tick()` — сделай `await asyncio.sleep(0)` и верни `"ok"`.',
          hint: '`async def` + `await asyncio.sleep(0)`.',
          starter: 'import asyncio\n\n\nasync def tick():\n    pass\n',
          solution: 'import asyncio\n\n\nasync def tick():\n    await asyncio.sleep(0)\n    return "ok"\n',
          tests: [
            'assert await tick() == "ok"'
          ]
        },
        {
          label: 'Шаг 2. Корутина с данными',
          task: 'Напиши `async def fetch_name(name)` — подожди `asyncio.sleep(0)` и верни `{"name": name}`.',
          hint: 'Как в шаге 1, но возвращай словарь.',
          starter: 'import asyncio\n\n\nasync def fetch_name(name):\n    pass\n',
          solution: 'import asyncio\n\n\nasync def fetch_name(name):\n    await asyncio.sleep(0)\n    return {"name": name}\n',
          tests: [
            'assert await fetch_name("a") == {"name": "a"}'
          ]
        }
      ],
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
  },
  {
    id: 'async-gather',
    title: 'async: gather и таймауты',
    summary: 'Конкурентный запуск корутин и ограничение ожидания.',
    minutes: 9,
    goal: 'Запускать несколько асинхронных операций одновременно и не ждать зависшую операцию бесконечно.',
    ideas: [
      '`asyncio.gather(*tasks)` запускает корутины конкурентно и возвращает результаты в исходном порядке.',
      '`asyncio.wait_for(coroutine, timeout)` ограничивает время ожидания.',
      'При таймауте поднимается `asyncio.TimeoutError`; его можно обработать и вернуть запасной результат.',
      '`gather` удобен для параллельных запросов, но не ускоряет CPU-вычисления.'
    ],
    sources: [
      {
        file: 'web/07_async_gather.py',
        focus: [
          {
            function: 'fetch_all',
            note: 'gather для нескольких имён.'
          },
          {
            function: 'fetch_with_timeout',
            note: 'wait_for и TimeoutError.'
          }
        ]
      }
    ],
    practice: {
      mainLabel: 'Шаг 3. Все имена и таймаут',
      steps: [
        {
          label: 'Шаг 1. Одна корутина',
          task: 'Напиши `fetch_one(name)` — дождись `fetch(name)` и верни результат.',
          hint: '`return await fetch(name)`.',
          starter: 'import asyncio\n\n\nasync def fetch(name):\n    await asyncio.sleep(0)\n    return {"name": name}\n\n\nasync def fetch_one(name):\n    pass\n',
          solution: 'import asyncio\n\n\nasync def fetch(name):\n    await asyncio.sleep(0)\n    return {"name": name}\n\n\nasync def fetch_one(name):\n    return await fetch(name)\n',
          tests: [
            'assert await fetch_one("a") == {"name": "a"}'
          ]
        },
        {
          label: 'Шаг 2. Две задачи',
          task: 'Напиши `fetch_two(a, b)` — запусти два `fetch` через `gather`.',
          hint: '`await asyncio.gather(fetch(a), fetch(b))`.',
          starter: 'import asyncio\n\n\nasync def fetch(name):\n    await asyncio.sleep(0)\n    return {"name": name}\n\n\nasync def fetch_two(a, b):\n    pass\n',
          solution: 'import asyncio\n\n\nasync def fetch(name):\n    await asyncio.sleep(0)\n    return {"name": name}\n\n\nasync def fetch_two(a, b):\n    return await asyncio.gather(fetch(a), fetch(b))\n',
          tests: [
            'assert await fetch_two("a", "b") == [{"name": "a"}, {"name": "b"}]'
          ]
        }
      ],
      task: 'Напиши `fetch_all(names)` — запускает `fetch(name)` для всех имён через gather и возвращает список результатов, и `fetch_with_timeout(name, timeout)` — возвращает результат `fetch(name, delay=0.05)` или `None` при таймауте.',
      hint: 'Для gather распакуй корутины: `await asyncio.gather(*(fetch(name) for name in names))`. Для таймаута используй `asyncio.wait_for`.',
      starter: 'import asyncio\n\n\nasync def fetch(name, delay=0):\n    await asyncio.sleep(delay)\n    return {"name": name}\n\n\nasync def fetch_all(names):\n    pass\n\n\nasync def fetch_with_timeout(name, timeout):\n    pass\n',
      solution: 'import asyncio\n\n\nasync def fetch(name, delay=0):\n    await asyncio.sleep(delay)\n    return {"name": name}\n\n\nasync def fetch_all(names):\n    return await asyncio.gather(*(fetch(name) for name in names))\n\n\nasync def fetch_with_timeout(name, timeout):\n    try:\n        return await asyncio.wait_for(fetch(name, delay=0.05), timeout)\n    except asyncio.TimeoutError:\n        return None\n',
      tests: [
        'assert await fetch_all(["a", "b"]) == [{"name": "a"}, {"name": "b"}]',
        'assert await fetch_with_timeout("ok", 1) == {"name": "ok"}',
        'assert await fetch_with_timeout("slow", 0.001) is None'
      ]
    },
    quiz: [
      {
        q: 'Что делает `asyncio.gather`?',
        options: [
          'Запускает корутины по очереди',
          'Запускает корутины конкурентно и собирает результаты',
          'Создаёт новый поток',
          'Ускоряет CPU-вычисления'
        ],
        answer: 1,
        explain: 'Gather передаёт управление задачам, пока они ждут ввода-вывода, и собирает результаты.'
      },
      {
        q: 'Какое исключение поднимает `asyncio.wait_for` при таймауте?',
        options: [
          'TimeoutError',
          'asyncio.TimeoutError',
          'ValueError',
          'StopIteration'
        ],
        answer: 1,
        explain: 'В asyncio используется `asyncio.TimeoutError`; в новых версиях он совместим со встроенным `TimeoutError`.'
      }
    ]
  },

];
