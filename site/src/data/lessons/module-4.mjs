export default [
  {
    id: 'classes',
    title: 'Классы и объекты',
    summary: 'Состояние, методы, __init__ и атрибуты класса.',
    minutes: 10,
    goal:
      'Создать класс с состоянием и поведением, понять роль `self` и разницу между атрибутом класса и атрибутом экземпляра.',
    ideas: [
      'Класс — шаблон, объект — конкретный экземпляр с собственными данными.',
      '`__init__` инициализирует объект, но не создаёт его: создание делает вызов класса.',
      '`self` — ссылка на текущий объект; без него метод не знает, с какими данными работать.',
      'Атрибут класса общий для всех экземпляров, атрибут экземпляра хранится в каждом объекте отдельно.'
    ],
    sources: [
      {
        file: 'oop/01_classes.py',
        focus: [
          { function: 'BankAccount', note: 'Поля, конструктор и методы.' },
          { function: 'BankAccount.deposit', note: 'Метод меняет состояние объекта.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши класс `Counter` с методами `increment()` и `value()`. Счётчик начинается с нуля и увеличивается на единицу за вызов.',
      hint: 'В `__init__` создай `self._value = 0`. Метод `increment` меняет поле, `value` возвращает его.',
      starter: 'class Counter:\n    def __init__(self):\n        pass\n\n    def increment(self):\n        pass\n\n    def value(self):\n        pass\n',
      solution:
        'class Counter:\n    def __init__(self):\n        self._value = 0\n\n    def increment(self):\n        self._value += 1\n\n    def value(self):\n        return self._value',
      tests: [
        'counter = Counter()\nassert counter.value() == 0\ncounter.increment()\ncounter.increment()\nassert counter.value() == 2',
        'first = Counter()\nsecond = Counter()\nfirst.increment()\nassert first.value() == 1 and second.value() == 0'
      ]
    },
    quiz: [
      {
        q: 'Что такое `self`?',
        options: ['Имя класса', 'Ссылка на текущий экземпляр', 'Глобальная переменная', 'Декоратор'],
        answer: 1,
        explain: 'Python передаёт экземпляр первым аргументом метода; по соглашению он называется `self`.'
      },
      {
        q: 'Где хранится атрибут, созданный в `__init__` через `self.x`?',
        options: ['В классе', 'В экземпляре', 'В модуле', 'В глобальном словаре'],
        answer: 1,
        explain: 'Присваивание `self.x` создаёт атрибут конкретного объекта.'
      }
    ]
  },
  {
    id: 'custom-exceptions',
    title: 'Свои исключения',
    summary: 'Иерархия ошибок приложения и цепочки причин.',
    minutes: 8,
    goal: 'Создавать собственные исключения, чтобы вызывающий код мог различать ошибки домена, а не разбирать текст сообщения.',
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
          {
            function: 'validate_username',
            note: 'Доменная проверка через ValidationError.'
          },
          {
            function: 'find_user',
            note: 'Своё исключение и цепочка from.'
          },
          {
            function: 'UserNotFoundError',
            note: 'Исключение с дополнительным полем.'
          }
        ]
      }
    ],
    practice: {
      task: 'Объяви `ValidationError(Exception)` и напиши `validate_age(age)`, который возвращает age, если 0 < age < 150, иначе поднимает ValidationError с понятным сообщением.',
      hint: 'Проверь тип и диапазон. Для поднятия используй `raise ValidationError("...")`.',
      starter: 'class ValidationError(Exception):\n    pass\n\n\ndef validate_age(age):\n    pass\n',
      solution: 'class ValidationError(Exception):\n    pass\n\n\ndef validate_age(age):\n    if not isinstance(age, int):\n        raise ValidationError("возраст должен быть целым числом")\n    if not 0 < age < 150:\n        raise ValidationError("возраст должен быть от 1 до 149")\n    return age',
      tests: [
        'assert validate_age(27) == 27',
        'try:\n    validate_age(200)\nexcept ValidationError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValidationError")',
        'try:\n    validate_age("27")\nexcept ValidationError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValidationError для строки")'
      ]
    },
    quiz: [
      {
        q: 'Зачем наследовать своё исключение от общего базового класса?',
        options: [
          'Чтобы ускорить обработку',
          'Чтобы ловить все ошибки домена одним except',
          'Чтобы исключение стало unchecked',
          'Это обязательно'
        ],
        answer: 1,
        explain: 'Иерархия позволяет различать группы ошибок и при этом обрабатывать их общим обработчиком.'
      },
      {
        q: 'Что делает `raise NewError(...) from error`?',
        options: [
          'Удаляет старое исключение',
          'Сохраняет исходную причину',
          'Делает исключение глобальным',
          'Печатает traceback'
        ],
        answer: 1,
        explain: 'Исходное исключение остаётся доступным через `__cause__` и попадает в traceback.'
      }
    ]
  },

  {
    id: 'dataclasses',
    title: 'dataclass',
    summary: 'Данные без шаблонного кода: поля, значения по умолчанию, frozen.',
    minutes: 9,
    goal:
      'Использовать `@dataclass` для классов-данных и понимать, когда нужен `frozen=True` и `default_factory`.',
    ideas: [
      '`@dataclass` автоматически создаёт `__init__`, `__repr__` и `__eq__`.',
      'Изменяемые значения по умолчанию недопустимы — для списков нужен `field(default_factory=list)`.',
      '`frozen=True` делает объект неизменяемым и хэшируемым.',
      '`order=True` добавляет сравнение полей по порядку объявления.'
    ],
    sources: [
      {
        file: 'oop/02_dataclasses.py',
        focus: [
          { function: 'Task', note: 'Поля, default и default_factory.' },
          { function: 'Point', note: 'Неизменяемый dataclass.' },
          { function: 'Version', note: 'Сравнение через order=True.' }
        ]
      }
    ],
    practice: {
      task:
        'Создай dataclass `Book` с полями `title`, `author`, `tags` (список, по умолчанию пустой) и методом `add_tag(tag)`.',
      hint: 'Импортируй `dataclass` и `field`. Для списка используй `field(default_factory=list)`.',
      starter: 'from dataclasses import dataclass, field\n\n\n@dataclass\nclass Book:\n    pass\n',
      solution:
        'from dataclasses import dataclass, field\n\n\n@dataclass\nclass Book:\n    title: str\n    author: str\n    tags: list[str] = field(default_factory=list)\n\n    def add_tag(self, tag: str) -> None:\n        self.tags.append(tag)',
      tests: [
        'book = Book("Core", "Анна")\nbook.add_tag("python")\nassert book.tags == ["python"]',
        'first = Book("A", "X")\nsecond = Book("B", "Y")\nfirst.add_tag("t")\nassert second.tags == []',
        'assert Book("A", "X") == Book("A", "X")'
      ]
    },
    quiz: [
      {
        q: 'Почему `tags: list = []` в dataclass — плохая идея?',
        options: ['Список нельзя хранить', 'Все экземпляры получат один и тот же список', 'Это синтаксическая ошибка', 'dataclass не поддерживает списки'],
        answer: 1,
        explain: 'Изменяемое значение по умолчанию создаётся один раз и разделяется между объектами. Нужен `default_factory`.'
      },
      {
        q: 'Что делает `frozen=True`?',
        options: ['Замораживает процесс', 'Запрещает изменение полей', 'Удаляет __init__', 'Делает поля приватными'],
        answer: 1,
        explain: 'После создания объекта поля нельзя изменить; объект становится неизменяемым.'
      }
    ]
  },
  {
    id: 'properties',
    title: 'Свойства',
    summary: 'property, setter и валидация при присваивании.',
    minutes: 9,
    goal:
      'Скрыть внутреннее поле за свойством и проверять значения в момент записи, не меняя интерфейс класса.',
    ideas: [
      '`@property` превращает метод в атрибут только для чтения.',
      '`@name.setter` позволяет проверять значение при присваивании.',
      'Внутреннее поле принято называть с подчёркиванием: `_celsius`.',
      'Свойство не обязано хранить значение напрямую: `fahrenheit` вычисляется из `celsius`.'
    ],
    sources: [
      {
        file: 'oop/03_properties.py',
        focus: [
          { function: 'Temperature', note: 'Валидация и вычисляемое свойство.' },
          { function: 'User', note: 'Нормализация email в setter.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши класс `Temperature` со свойством `celsius`. Значения ниже -273.15 должны вызывать ValueError. Добавь свойство `fahrenheit`.',
      hint: 'Храни значение в `self._celsius`, а в setter проверяй диапазон. Формула: `celsius * 9 / 5 + 32`.',
      starter: 'class Temperature:\n    def __init__(self, celsius=0):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        pass\n\n    @celsius.setter\n    def celsius(self, value):\n        pass\n\n    @property\n    def fahrenheit(self):\n        pass\n',
      solution:
        'class Temperature:\n    def __init__(self, celsius=0):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError("ниже абсолютного нуля")\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9 / 5 + 32',
      tests: [
        'temperature = Temperature(25)\nassert temperature.celsius == 25\nassert temperature.fahrenheit == 77.0',
        'temperature = Temperature()\ntemperature.celsius = 100\nassert temperature.fahrenheit == 212.0',
        'try:\n    Temperature(-300)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
      ]
    },
    quiz: [
      {
        q: 'Зачем нужен setter?',
        options: ['Чтобы запретить чтение', 'Чтобы проверять значение при записи', 'Чтобы ускорить доступ', 'Чтобы сделать поле публичным'],
        answer: 1,
        explain: 'Setter выполняется при присваивании и может валидировать или нормализовать значение.'
      },
      {
        q: 'Что вернёт обращение к `@property` методу?',
        options: ['Саму функцию', 'Результат вызова метода', 'Ошибку', 'None'],
        answer: 1,
        explain: 'Property вызывается автоматически, поэтому снаружи это выглядит как обычный атрибут.'
      }
    ]
  },
  {
    id: 'inheritance',
    title: 'Наследование',
    summary: 'super(), переопределение методов и полиморфизм.',
    minutes: 10,
    goal:
      'Использовать наследование для общих контрактов и понимать, когда композиция лучше наследования.',
    ideas: [
      'Дочерний класс получает методы родителя и может их переопределять.',
      '`super()` вызывает реализацию родителя, не зашивая имя класса в код.',
      'Полиморфизм: один и тот же вызов работает по-разному для разных классов.',
      'Наследование моделирует «является», композиция — «содержит».'
    ],
    sources: [
      {
        file: 'oop/04_inheritance.py',
        focus: [
          { function: 'Animal', note: 'Базовый класс с общим поведением.' },
          { function: 'Cat', note: 'Дополнительное поле и super().__init__.' },
          { function: 'GuideDog', note: 'Расширение поведения родителя.' }
        ]
      }
    ],
    practice: {
      task:
        'Создай базовый класс `Shape` с методом `area()`, возвращающим 0, и класс `Rectangle(width, height)`, переопределяющий `area()`.',
      hint: 'В дочернем классе вызови `super().__init__()` при необходимости и верни `width * height`.',
      starter: 'class Shape:\n    def area(self):\n        return 0\n\n\nclass Rectangle(Shape):\n    pass\n',
      solution:
        'class Shape:\n    def area(self):\n        return 0\n\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height',
      tests: [
        'assert Rectangle(3, 4).area() == 12',
        'assert isinstance(Rectangle(1, 1), Shape)',
        'shapes = [Shape(), Rectangle(2, 5)]\nassert [shape.area() for shape in shapes] == [0, 10]'
      ]
    },
    quiz: [
      {
        q: 'Что делает `super()`?',
        options: ['Создаёт новый объект', 'Вызывает метод родительского класса', 'Удаляет родителя', 'Делает метод приватным'],
        answer: 1,
        explain: '`super()` даёт доступ к реализации родителя в порядке MRO.'
      },
      {
        q: 'Когда композиция лучше наследования?',
        options: ['Когда класс «является» частным случаем', 'Когда класс «содержит» другой объект', 'Всегда', 'Никогда'],
        answer: 1,
        explain: 'Если отношение не является наследованием, композиция обычно гибче и меньше связывает классы.'
      }
    ]
  },
  {
    id: 'composition',
    title: 'Композиция',
    summary: 'Объект содержит другой объект и делегирует ему работу.',
    minutes: 8,
    goal: 'Отличать «является» от «содержит» и собирать классы из маленьких зависимостей.',
    ideas: [
      'Композиция — это отношение «содержит»: объект хранит другой объект.',
      'Делегирование — метод вызывает метод вложенного объекта.',
      'Композиция гибче наследования, когда нет отношения «является».',
      'Зависимость можно заменить, не меняя код класса.'
    ],
    sources: [
      {
        file: 'oop/07_composition.py',
        focus: [
          {
            function: 'Engine',
            note: 'Маленькая зависимость с поведением.'
          },
          {
            function: 'Car',
            note: 'Хранит Engine и делегирует запуск.'
          }
        ]
      }
    ],
    practice: {
      task: 'Создай `Logger` с методом `log(message)` → `[LOG] <message>` и `Service(name, logger)` с методом `run()`, который возвращает `<name>: <лог о запуске>`. Используй композицию.',
      hint: 'Service хранит logger в `self.logger`, а `run` вызывает `self.logger.log("started")`.',
      starter: 'class Logger:\n    pass\n\n\nclass Service:\n    def __init__(self, name, logger):\n        pass\n\n    def run(self):\n        pass\n',
      solution: 'class Logger:\n    def log(self, message):\n        return f"[LOG] {message}"\n\n\nclass Service:\n    def __init__(self, name, logger):\n        self.name = name\n        self.logger = logger\n\n    def run(self):\n        return f"{self.name}: {self.logger.log(\'started\')}"\n',
      tests: [
        'assert Service("api", Logger()).run() == "api: [LOG] started"',
        'class Fake:\n    def log(self, message):\n        return message.upper()\nassert Service("x", Fake()).run() == "x: STARTED"',
        'assert isinstance(Service("x", Logger()).logger, Logger)'
      ]
    },
    quiz: [
      {
        q: 'Какое отношение описывает композиция?',
        options: [
          '«является»',
          '«содержит»',
          '«наследует»',
          '«копирует»'
        ],
        answer: 1,
        explain: 'Композиция — объект содержит другой объект и использует его поведение.'
      },
      {
        q: 'Когда композиция лучше наследования?',
        options: [
          'Когда классы связаны отношением «является»',
          'Когда один объект должен использовать поведение другого',
          'Когда нужно запретить замену зависимости',
          'Всегда'
        ],
        answer: 1,
        explain: 'Если отношение не «является», композиция обычно гибче и меньше связывает классы.'
      }
    ]
  },
  {
    id: 'dunder',
    title: 'Магические методы',
    summary: '__str__, __repr__, __eq__, __add__ и протоколы языка.',
    minutes: 10,
    goal:
      'Сделать свои объекты естественными для Python: печатать, сравнивать, складывать и итерировать.',
    ideas: [
      '`__repr__` нужен для отладки, `__str__` — для пользователя.',
      '`__eq__` определяет смысл равенства объектов.',
      '`__len__`, `__iter__`, `__getitem__` подключают объект к встроенным функциям.',
      'Если метод не знает, как обработать другой тип, верни `NotImplemented`, а не `False`.'
    ],
    sources: [
      {
        file: 'oop/05_dunder.py',
        focus: [
          { function: 'Vector', note: 'repr, str, eq, add, len и iter.' },
          { function: 'Playlist', note: 'len, getitem и contains.' }
        ]
      }
    ],
    practice: {
      task:
        'Создай класс `Money(amount, currency)` с `__repr__`, `__eq__` и `__add__`. Складывать можно только одинаковые валюты, иначе ValueError.',
      hint: '`__add__` возвращает новый объект `Money`. Сравнение проверяй через `isinstance`.',
      starter: 'class Money:\n    def __init__(self, amount, currency="RUB"):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        pass\n\n    def __eq__(self, other):\n        pass\n\n    def __add__(self, other):\n        pass\n',
      solution:
        'class Money:\n    def __init__(self, amount, currency="RUB"):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        return f"Money({self.amount}, {self.currency!r})"\n\n    def __eq__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return self.amount == other.amount and self.currency == other.currency\n\n    def __add__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        if self.currency != other.currency:\n            raise ValueError("разные валюты")\n        return Money(self.amount + other.amount, self.currency)',
      tests: [
        'assert Money(100) + Money(50) == Money(150)',
        'assert repr(Money(10)) == "Money(10, \'RUB\')"',
        'try:\n    Money(10, "RUB") + Money(5, "USD")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("ожидалось ValueError")'
      ]
    },
    quiz: [
      {
        q: 'Чем `__repr__` отличается от `__str__`?',
        options: ['Ничем', 'repr — для отладки, str — для пользователя', 'str только для чисел', 'repr нельзя переопределять'],
        answer: 1,
        explain: '`repr` стремится быть однозначным и полезным в консоли, `str` — читаемым.'
      },
      {
        q: 'Почему в `__eq__` возвращают `NotImplemented`?',
        options: ['Чтобы вызвать ошибку', 'Чтобы Python попробовал сравнение с другой стороны', 'Чтобы сравнение всегда было False', 'Это устаревший синтаксис'],
        answer: 1,
        explain: 'Специальное значение позволяет корректно работать с типами, которые умеют сравнивать себя с вашим объектом.'
      }
    ]
  },
  {
    id: 'protocols',
    title: 'Протоколы и ABC',
    summary: 'Утиная типизация, Protocol и абстрактные классы.',
    minutes: 9,
    goal:
      'Проектировать контракты так, чтобы код зависел от поведения, а не от конкретного класса.',
    ideas: [
      'Утиная типизация: если объект умеет нужное, его тип не важен.',
      '`typing.Protocol` описывает структуру для статической проверки.',
      '`ABC` и `@abstractmethod` требуют явной реализации у наследников.',
      'Для простых контрактов достаточно функции, принимающей объект с нужным методом.'
    ],
    sources: [
      {
        file: 'oop/06_protocols.py',
        focus: [
          { function: 'PaymentProvider', note: 'Структурный контракт.' },
          { function: 'checkout', note: 'Функция зависит от поведения, а не от класса.' },
          { function: 'Repository', note: 'ABC с обязательными методами.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `checkout(provider, amount)`, вызывающую `provider.pay(amount)` и возвращающую результат. Создай два класса с методом `pay`.',
      hint: 'Никакого наследования не нужно: достаточно одинакового метода. Это и есть утиная типизация.',
      starter: 'def checkout(provider, amount):\n    pass\n\n\nclass Card:\n    pass\n\n\nclass Cash:\n    pass\n',
      solution:
        'def checkout(provider, amount):\n    return provider.pay(amount)\n\n\nclass Card:\n    def pay(self, amount):\n        return f"card:{amount}"\n\n\nclass Cash:\n    def pay(self, amount):\n        return f"cash:{amount}"',
      tests: [
        'assert checkout(Card(), 100) == "card:100"',
        'assert checkout(Cash(), 50) == "cash:50"',
        'class Custom:\n    def pay(self, amount):\n        return amount * 2\nassert checkout(Custom(), 21) == 42'
      ]
    },
    quiz: [
      {
        q: 'Что такое утиная типизация?',
        options: ['Проверка имени класса', 'Использование объекта по его поведению', 'Наследование от object', 'Тип, который нельзя изменить'],
        answer: 1,
        explain: 'Если объект поддерживает нужные методы, его конкретный класс не важен.'
      },
      {
        q: 'Зачем нужен ABC?',
        options: ['Чтобы ускорить код', 'Чтобы запретить создание объекта без реализации методов', 'Чтобы сделать класс неизменяемым', 'Чтобы включить сборку мусора'],
        answer: 1,
        explain: 'Абстрактный базовый класс задаёт обязательный контракт для наследников.'
      }
    ]
  }
];
