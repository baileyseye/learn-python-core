"""Функции: параметры, return и вызов."""


def greet(name: str) -> str:
    return f"Привет, {name}!"


def add(a: int, b: int) -> int:
    return a + b


def main() -> None:
    print(greet("мир"))
    print(add(2, 3))


if __name__ == "__main__":
    main()
