"""Исключения: try / except / else / finally."""


def safe_divide(a: float, b: float) -> float | None:
    try:
        result = a / b
    except ZeroDivisionError:
        print("на ноль делить нельзя")
        return None
    else:
        print("деление прошло успешно")
        return result
    finally:
        print("finally выполняется всегда")


def parse_age(raw: str) -> int:
    """Ловим конкретное исключение, а не всё подряд."""
    try:
        age = int(raw)
    except ValueError:
        print(f"{raw!r} — это не число")
        return -1
    if age < 0:
        raise ValueError("возраст не может быть отрицательным")
    return age


def read_value(data: dict, key: str) -> str:
    """EAFP: проще попросить прощения, чем разрешения."""
    try:
        return data[key]
    except KeyError:
        return "ключа нет"


def main() -> None:
    print(safe_divide(10, 2))
    print(safe_divide(10, 0))
    print(parse_age("42"))
    print(parse_age("сорок"))
    print(read_value({"name": "Анна"}, "name"))
    print(read_value({}, "name"))

    try:
        parse_age("-5")
    except ValueError as error:
        print("поймали:", error)


if __name__ == "__main__":
    main()
