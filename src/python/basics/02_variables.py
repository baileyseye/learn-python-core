"""Переменные и динамическая типизация.

Python не требует объявлять тип переменной: тип принадлежит значению,
а не имени. При этом Python остаётся строго типизированным языком.
"""


def demonstrate_assignment() -> None:
    name = "Анна"
    age = 27
    height = 1.72
    is_student = False

    print(name, type(name).__name__)
    print(age, type(age).__name__)
    print(height, type(height).__name__)
    print(is_student, type(is_student).__name__)


def demonstrate_reassignment() -> None:
    value = 10
    print("сначала:", value, type(value).__name__)

    value = "теперь строка"
    print("потом:", value, type(value).__name__)


def demonstrate_unpacking() -> None:
    x, y = 3, 7
    x, y = y, x
    print("после обмена:", x, y)

    first, *middle, last = [1, 2, 3, 4, 5]
    print("first:", first, "middle:", middle, "last:", last)


def check_type(value: object) -> str:
    """isinstance умеет проверять несколько типов сразу."""
    if isinstance(value, (int, float)):
        return "число"
    if isinstance(value, str):
        return "строка"
    return "другое"


def main() -> None:
    demonstrate_assignment()
    demonstrate_reassignment()
    demonstrate_unpacking()
    print("42 —", check_type(42))
    print("'42' —", check_type("42"))


if __name__ == "__main__":
    main()
