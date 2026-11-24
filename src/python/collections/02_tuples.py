"""Кортежи: неизменяемые последовательности и распаковка."""

from collections import namedtuple


def demonstrate_basics() -> None:
    point = (3, 7)
    x, y = point
    print("point:", point)
    print("x, y:", x, y)
    print("срез:", point[::-1])


def demonstrate_single_element() -> None:
    not_tuple = ("Python")
    one_item = ("Python",)
    print(type(not_tuple).__name__, type(one_item).__name__)


def split_name(full_name: str) -> tuple[str, str]:
    """Кортеж — удобный способ вернуть несколько значений."""
    first, last = full_name.split(maxsplit=1)
    return first, last


def demonstrate_namedtuple() -> None:
    User = namedtuple("User", "name role")
    user = User("Анна", "admin")
    print(user)
    print(user.name, user.role)


def main() -> None:
    demonstrate_basics()
    demonstrate_single_element()
    print(split_name("Анна Петрова"))
    demonstrate_namedtuple()


if __name__ == "__main__":
    main()
