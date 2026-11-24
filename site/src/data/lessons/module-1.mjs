export default [
  {
    id: 'hello-python',
    title: 'Первая программа',
    summary: 'Как запускается Python-файл, зачем нужен __main__ и как вывести текст.',
    minutes: 6,
    goal:
      'Понять, из чего состоит минимальная программа на Python, чем файл отличается от модуля и почему точка входа оформляется через `if __name__ == "__main__"`.',
    ideas: [
      'Python читает файл сверху вниз и выполняет инструкции сразу, без отдельной компиляции.',
      '`print()` — обычная функция, а не оператор: скобки обязательны.',
      '`def` создаёт функцию, но не вызывает её. Вызов — отдельная строка `greet()`.',
      'Конструкция `if __name__ == "__main__":` запускает `main()` только при прямом запуске файла, но не при импорте.'
    ],
    sources: [
      {
        file: 'basics/01_hello.py',
        focus: [
          { function: 'greet', note: 'Функция с аннотацией типов и значением по умолчанию.' },
          { function: 'main', note: 'Точка входа: всё, что должно выполниться при запуске.' }
        ]
      }
    ],
    practice: {
      task: 'Выведи две строки: `Hello, Python!` и любое приветствие от себя. Затем оберни вывод в функцию `main()` и вызови её.',
      hint: 'Каждый `print()` выводит отдельную строку. Проверка смотрит на реальный stdout.',
      starter: 'print("Hello, Python!")\n',
      solution:
        'def main() -> None:\n    print("Hello, Python!")\n    print("Я учу Python")\n\n\nif __name__ == "__main__":\n    main()',
      tests: [
        'assert "Hello, Python!" in stdout',
        'assert len([line for line in stdout.splitlines() if line.strip()]) >= 2'
      ]
    },
    quiz: [
      {
        q: 'Что делает `print("Hi")`?',
        options: ['Создаёт переменную print', 'Выводит Hi в stdout', 'Возвращает строку Hi', 'Компилирует файл'],
        answer: 1,
        explain: '`print` — встроенная функция, которая выводит значения в стандартный поток вывода.'
      },
      {
        q: 'Когда выполняется код внутри `if __name__ == "__main__":`?',
        options: ['Всегда', 'Только при импорте файла', 'Только при прямом запуске файла', 'Никогда'],
        answer: 2,
        explain: 'При прямом запуске `__name__` равно `"__main__"`, при импорте — имени модуля.'
      }
    ]
  },
  {
    id: 'variables',
    title: 'Переменные и типы',
    summary: 'Имена, динамическая типизация, распаковка и проверка типов.',
    minutes: 8,
    goal:
      'Научиться хранить значения в переменных, понимать, что тип принадлежит значению, и не путать динамическую типизацию со слабой.',
    ideas: [
      'Переменная в Python — имя, привязанное к объекту. Отдельного объявления с типом нет.',
      'Тип можно узнать через `type(value).__name__`, а принадлежность проверить через `isinstance`.',
      'Одно и то же имя может указывать на значения разных типов: это динамическая типизация.',
      'Кортеж слева позволяет распаковать последовательность: `x, y = 1, 2`, а `*rest` собирает остаток.'
    ],
    sources: [
      {
        file: 'basics/02_variables.py',
        focus: [
          { function: 'demonstrate_assignment', note: 'Четыре значения и их типы.' },
          { function: 'demonstrate_unpacking', note: 'Обмен значениями и звёздочная распаковка.' },
          { function: 'check_type', note: '`isinstance` умеет проверять несколько типов сразу.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши функцию `swap(a, b)`, которая возвращает значения в обратном порядке, и функцию `describe(value)`, возвращающую имя типа значения.',
      hint: 'В Python обмен делается без временной переменной: `a, b = b, a`. Для типа используй `type(value).__name__`.',
      starter: 'def swap(a, b):\n    pass\n\n\ndef describe(value):\n    pass\n',
      solution:
        'def swap(a, b):\n    return b, a\n\n\ndef describe(value):\n    return type(value).__name__',
      tests: [
        'assert swap(1, 2) == (2, 1)',
        'assert swap("a", "b") == ("b", "a")',
        'assert describe(42) == "int"',
        'assert describe("42") == "str"',
        'assert describe(1.5) == "float"',
        'assert describe(True) == "bool"'
      ]
    },
    quiz: [
      {
        q: 'Что такое динамическая типизация?',
        options: [
          'Переменная может хранить значения разных типов в разное время',
          'Python не проверяет типы вообще',
          'Все значения приводятся к строке',
          'Тип нужно указывать вручную'
        ],
        answer: 0,
        explain: 'Имя может быть привязано к объекту любого типа. При этом операции над несовместимыми типами всё равно дают ошибку.'
      },
      {
        q: 'Что вернёт `type("42").__name__`?',
        options: ['int', 'str', '42', 'string'],
        answer: 1,
        explain: 'Кавычки создают строку, даже если внутри цифры.'
      }
    ]
  },
  {
    id: 'numbers',
    title: 'Числа и операторы',
    summary: 'int без переполнения, float, //, %, ** и Decimal.',
    minutes: 9,
    goal:
      'Разобраться с целыми и дробными числами, целочисленным делением, остатком и типичной ловушкой двоичной точности.',
    ideas: [
      '`int` в Python произвольной точности: `2 ** 100` считается без переполнения.',
      '`/` всегда возвращает float, а `//` — целую часть. `%` возвращает остаток.',
      '`0.1 + 0.2` не равно ровно `0.3` из-за двоичного представления float.',
      'Для денег и точных расчётов используют `Decimal`, а не `float`.'
    ],
    sources: [
      {
        file: 'basics/03_numbers.py',
        focus: [
          { function: 'demonstrate_integers', note: 'Большие числа, `//`, `%` и `**`.' },
          { function: 'demonstrate_floats', note: 'Погрешность float и точный Decimal.' },
          { function: 'calculate', note: 'Функция возвращает словарь с результатами.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `calculate(a, b)`, возвращающую словарь с ключами `sum`, `difference`, `product`, `quotient`, `remainder`. Для `quotient` используй целочисленное деление.',
      hint: 'Целочисленное деление — `//`, остаток — `%`. Словарь создаётся фигурными скобками.',
      starter: 'def calculate(a, b):\n    pass\n',
      solution:
        'def calculate(a, b):\n    return {\n        "sum": a + b,\n        "difference": a - b,\n        "product": a * b,\n        "quotient": a // b,\n        "remainder": a % b,\n    }',
      tests: [
        'assert calculate(10, 3) == {"sum": 13, "difference": 7, "product": 30, "quotient": 3, "remainder": 1}',
        'assert calculate(7, 2)["quotient"] == 3',
        'assert calculate(-7, 2)["quotient"] == -4'
      ]
    },
    quiz: [
      {
        q: 'Что вернёт `17 // 5`?',
        options: ['3.4', '3', '4', '2'],
        answer: 1,
        explain: '`//` отбрасывает дробную часть и возвращает целое число.'
      },
      {
        q: 'Почему `0.1 + 0.2 == 0.3` даёт False?',
        options: ['Python округляет все float', 'Из-за двоичного представления дробей', 'Это баг конкретной версии', 'Потому что 0.3 — строка'],
        answer: 1,
        explain: 'Многие десятичные дроби нельзя точно представить в двоичной системе, поэтому сравнение float требует осторожности.'
      }
    ]
  },
  {
    id: 'strings',
    title: 'Строки',
    summary: 'Неизменяемость, f-строки, методы и индексы.',
    minutes: 9,
    goal:
      'Научиться собирать и разбирать текст: методы строк, форматирование, срезы и понимание того, что строка неизменяема.',
    ideas: [
      'Строка неизменяема: `upper()` возвращает новую строку, а не меняет старую.',
      'f-строки `f"{name}: {score:.1f}"` — стандартный способ форматирования.',
      'Индексы начинаются с нуля, отрицательные считаются с конца: `text[-1]`.',
      '`split` и `join` — базовая пара для преобразования между строкой и списком.'
    ],
    sources: [
      {
        file: 'basics/04_strings.py',
        focus: [
          { function: 'demonstrate_methods', note: 'strip, lower, replace, split, join и startswith.' },
          { function: 'demonstrate_formatting', note: 'f-строки, точность и выравнивание.' },
          { function: 'demonstrate_immutability', note: 'Индексы и неизменяемость.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `normalize(name)`, которая убирает пробелы по краям и приводит имя к виду «Анна Петрова», и `initials(full_name)`, возвращающую инициалы через точку: `А.П.`.',
      hint: '`strip()` убирает пробелы, `title()` делает заглавные буквы. Для инициалов удобен `split()` и генератор.',
      starter: 'def normalize(name):\n    pass\n\n\ndef initials(full_name):\n    pass\n',
      solution:
        'def normalize(name):\n    return name.strip().title()\n\n\ndef initials(full_name):\n    parts = full_name.split()\n    return ".".join(part[0].upper() for part in parts) + "."',
      tests: [
        'assert normalize("  анна петрова ") == "Анна Петрова"',
        'assert initials("анна петрова") == "А.П."',
        'assert initials("борис") == "Б."'
      ]
    },
    quiz: [
      {
        q: 'Что вернёт `"Python"[0]`?',
        options: ['P', 'y', 'Python', 'Ошибку'],
        answer: 0,
        explain: 'Индексация начинается с нуля, поэтому первый символ — `P`.'
      },
      {
        q: 'Меняет ли `text.upper()` исходную строку?',
        options: ['Да', 'Нет, возвращает новую строку', 'Только для ASCII', 'Только если строка объявлена через f-строку'],
        answer: 1,
        explain: 'Строки неизменяемы, поэтому методы возвращают новое значение.'
      }
    ]
  },
  {
    id: 'conditions',
    title: 'Условия и truthiness',
    summary: 'if/elif/else, логические операторы, пустые значения и match/case.',
    minutes: 8,
    goal:
      'Писать понятные ветвления, понимать, какие значения считаются ложными, и использовать `match/case` там, где он уместен.',
    ideas: [
      'В Python нет фигурных скобок: блок задаётся отступом в четыре пробела.',
      'Пустые коллекции, `0`, `""`, `None` и `False` считаются ложными.',
      '`and` и `or` возвращают не bool, а последний вычисленный операнд.',
      '`match/case` удобен для разбора вариантов, но не заменяет обычный `if` повсюду.'
    ],
    sources: [
      {
        file: 'basics/05_conditions.py',
        focus: [
          { function: 'classify_score', note: 'Цепочка if/elif/else.' },
          { function: 'describe_truthiness', note: 'Какие значения ложные.' },
          { function: 'describe_day', note: '`match/case` с объединением вариантов.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `classify_score(score)`: 90+ — «отлично», 75+ — «хорошо», 60+ — «зачёт», иначе «нужно повторить».',
      hint: 'Проверки идут сверху вниз, поэтому первым должно быть самое строгое условие.',
      starter: 'def classify_score(score):\n    pass\n',
      solution:
        'def classify_score(score):\n    if score >= 90:\n        return "отлично"\n    if score >= 75:\n        return "хорошо"\n    if score >= 60:\n        return "зачёт"\n    return "нужно повторить"',
      tests: [
        'assert classify_score(95) == "отлично"',
        'assert classify_score(90) == "отлично"',
        'assert classify_score(80) == "хорошо"',
        'assert classify_score(61) == "зачёт"',
        'assert classify_score(40) == "нужно повторить"'
      ]
    },
    quiz: [
      {
        q: 'Какое значение считается ложным?',
        options: ['"0"', '[0]', '[]', '0.1'],
        answer: 2,
        explain: 'Пустой список ложен. Строка `"0"` и непустой список `[0]` — истинны.'
      },
      {
        q: 'Что вернёт `"" or "fallback"`?',
        options: ['""', 'False', '"fallback"', 'None'],
        answer: 2,
        explain: '`or` возвращает первый истинный операнд, поэтому пустая строка пропускается.'
      }
    ]
  },
  {
    id: 'loops',
    title: 'Циклы',
    summary: 'for, while, range, enumerate, zip и for/else.',
    minutes: 9,
    goal:
      'Перебирать данные идиоматично: без ручных индексов там, где есть `enumerate`, и с пониманием `break`, `continue` и `else`.',
    ideas: [
      '`for` в Python перебирает элементы, а не счётчик: `for item in items`.',
      '`range(start, stop, step)` не включает `stop`.',
      '`enumerate` даёт индекс и значение, `zip` идёт по нескольким последовательностям параллельно.',
      '`else` у цикла выполняется, только если цикл завершился без `break`.'
    ],
    sources: [
      {
        file: 'basics/06_loops.py',
        focus: [
          { function: 'multiplication_table', note: 'Вложенный comprehension вместо вложенного цикла.' },
          { function: 'find_first_even', note: '`for/else` ищет первый элемент.' },
          { function: 'countdown', note: '`while` с изменением условия.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `fizzbuzz(n)`, возвращающую список строк от 1 до n: кратные 3 — `Fizz`, кратные 5 — `Buzz`, кратные 15 — `FizzBuzz`, остальные — число строкой.',
      hint: 'Сначала проверяй кратность 15, иначе ветки для 3 и 5 перехватят число раньше.',
      starter: 'def fizzbuzz(n):\n    result = []\n    # добавь цикл\n    return result\n',
      solution:
        'def fizzbuzz(n):\n    result = []\n    for number in range(1, n + 1):\n        if number % 15 == 0:\n            result.append("FizzBuzz")\n        elif number % 3 == 0:\n            result.append("Fizz")\n        elif number % 5 == 0:\n            result.append("Buzz")\n        else:\n            result.append(str(number))\n    return result',
      tests: [
        'assert fizzbuzz(5) == ["1", "2", "Fizz", "4", "Buzz"]',
        'assert fizzbuzz(15)[-1] == "FizzBuzz"',
        'assert len(fizzbuzz(20)) == 20'
      ]
    },
    quiz: [
      {
        q: 'Что выведет `list(range(1, 5))`?',
        options: ['[1, 2, 3, 4, 5]', '[1, 2, 3, 4]', '[0, 1, 2, 3, 4]', '[2, 3, 4, 5]'],
        answer: 1,
        explain: 'Правый конец диапазона не включается.'
      },
      {
        q: 'Когда выполняется `else` у цикла?',
        options: ['Всегда после цикла', 'Только если цикл не прерван через break', 'Только для while', 'Никогда'],
        answer: 1,
        explain: '`else` полезен для поиска: он срабатывает, если элемент так и не нашли.'
      }
    ]
  },
  {
    id: 'functions',
    title: 'Функции',
    summary: 'Параметры, возвращаемые значения, аннотации и функции как объекты.',
    minutes: 9,
    goal:
      'Выносить повторяющуюся логику в функции, понимать значения по умолчанию и уметь передавать функцию аргументом.',
    ideas: [
      'Функция объявляется через `def`, а возвращает результат через `return`.',
      'Без `return` функция возвращает `None`.',
      'Значения по умолчанию вычисляются один раз при объявлении функции.',
      'Функции — объекты: их можно передавать, хранить в словарях и возвращать из других функций.'
    ],
    sources: [
      {
        file: 'basics/07_functions.py',
        focus: [
          { function: 'add', note: 'Минимальная функция с аннотациями.' },
          { function: 'greet', note: 'Параметр со значением по умолчанию.' },
          { function: 'min_max', note: 'Возврат нескольких значений кортежем.' },
          { function: 'apply_twice', note: 'Функция как аргумент.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `apply_twice(function, value)`, которая применяет функцию к значению дважды, и `min_max(numbers)`, возвращающую кортеж из минимума и максимума.',
      hint: '`apply_twice` вызывает `function(function(value))`. Для min/max есть встроенные функции.',
      starter: 'def apply_twice(function, value):\n    pass\n\n\ndef min_max(numbers):\n    pass\n',
      solution:
        'def apply_twice(function, value):\n    return function(function(value))\n\n\ndef min_max(numbers):\n    return min(numbers), max(numbers)',
      tests: [
        'assert apply_twice(lambda x: x * 2, 3) == 12',
        'assert apply_twice(str.upper, "ab") == "AB"',
        'assert min_max([4, 1, 9, 2]) == (1, 9)'
      ]
    },
    quiz: [
      {
        q: 'Что вернёт функция без `return`?',
        options: ['0', 'None', 'Пустую строку', 'Ошибку'],
        answer: 1,
        explain: 'Неявный возврат в Python — `None`.'
      },
      {
        q: 'Можно ли передать функцию аргументом в другую функцию?',
        options: ['Нет, только результат вызова', 'Да, функции — объекты', 'Только lambda', 'Только встроенные функции'],
        answer: 1,
        explain: 'Функции в Python — полноценные объекты, поэтому их можно передавать и возвращать.'
      }
    ]
  },
  {
    id: 'input-output',
    title: 'Ввод и вывод',
    summary: 'print с sep и end, f-строки и чтение из потока.',
    minutes: 7,
    goal:
      'Форматировать вывод и читать ввод так, чтобы программу можно было и запустить вручную, и протестировать автоматически.',
    ideas: [
      '`print` принимает `sep` и `end`, поэтому не всегда нужна конкатенация.',
      '`input()` всегда возвращает строку, даже если пользователь ввёл число.',
      'Для тестируемости лучше передавать поток ввода в функцию, а не вызывать `input()` глубоко внутри.',
      '`f"{text:<16}{number:>6}"` выравнивает колонки без ручных пробелов.'
    ],
    sources: [
      {
        file: 'basics/08_io.py',
        focus: [
          { function: 'ask_name', note: 'Чтение из переданного потока — удобно тестировать.' },
          { function: 'format_receipt', note: 'Выравнивание текста и чисел через f-строки.' }
        ]
      }
    ],
    practice: {
      task:
        'Напиши `format_receipt(items)`, где items — список пар (название, цена). Верни многострочный чек с заголовком `Итого` и суммой.',
      hint: 'Собери строки в список и соедини через `"\\n".join(lines)`. Сумма — `sum(price for _, price in items)`.',
      starter: 'def format_receipt(items):\n    pass\n',
      solution:
        'def format_receipt(items):\n    lines = ["Товар            Цена", "-" * 22]\n    for title, price in items:\n        lines.append(f"{title:<16}{price:>6}")\n    lines.append("-" * 22)\n    lines.append(f"{\'Итого\':<16}{sum(price for _, price in items):>6}")\n    return "\\n".join(lines)',
      tests: [
        'assert "Итого" in format_receipt([("Книга", 1200)])',
        'assert "6100" in format_receipt([("Книга", 1200), ("Курс", 4900)])',
        'assert format_receipt([]).splitlines()[-1].strip().endswith("0")'
      ]
    },
    quiz: [
      {
        q: 'Какого типа значение возвращает `input()`?',
        options: ['int', 'str', 'float', 'Зависит от ввода'],
        answer: 1,
        explain: '`input()` всегда возвращает строку; число нужно преобразовать через `int()` или `float()`.'
      },
      {
        q: 'Что делает `print("a", "b", sep="-")`?',
        options: ['a-b', 'a b', 'ab', 'Ошибка'],
        answer: 0,
        explain: '`sep` задаёт разделитель между аргументами.'
      }
    ]
  }
];
