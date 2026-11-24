"""Первая программа: вывод в консоль и функция.

Запуск:
    python src/python/basics/01_hello.py
"""


def greet(name: str = "мир") -> str:
    """Возвращает приветствие для имени."""
    return f"Привет, {name}!"


def main() -> None:
    print("Hello, Python!")
    print(greet())
    print(greet("Анна"))
    print("Python читается почти как обычный текст.")


if __name__ == "__main__":
    main()
