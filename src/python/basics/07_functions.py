"""Функции: параметры, значения по умолчанию, аннотации и область видимости."""


def add(a: int, b: int) -> int:
    """Складывает два числа."""
    return a + b


def greet(name: str, greeting: str = "Привет") -> str:
    """Параметр со значением по умолчанию идёт последним."""
    return f"{greeting}, {name}!"


def min_max(numbers: list[int]) -> tuple[int, int]:
    """Функция может вернуть несколько значений через кортеж."""
    return min(numbers), max(numbers)


def apply_twice(function, value):
    """Функция — такой же объект, её можно передать аргументом."""
    return function(function(value))


def double(value: int) -> int:
    return value * 2


def main() -> None:
    print(add(2, 3))
    print(greet("Анна"))
    print(greet("Ли", greeting="Добрый день"))
    print(min_max([4, 1, 9, 2]))
    print("apply_twice:", apply_twice(double, 5))
    print("docstring:", add.__doc__)


if __name__ == "__main__":
    main()
