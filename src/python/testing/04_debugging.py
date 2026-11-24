"""Отладка: чтение traceback, assert и типичные ошибки."""

import traceback


def divide(a: int, b: int) -> float:
    assert b != 0, "b не должен быть нулём"
    return a / b


def parse_ints(values: list[str]) -> list[int]:
    result: list[int] = []
    for value in values:
        try:
            result.append(int(value))
        except ValueError:
            print(f"пропущено: {value!r}")
    return result


def show_traceback() -> None:
    try:
        data = {"name": "Анна"}
        print(data["age"])
    except KeyError:
        text = traceback.format_exc()
        print("последняя строка traceback:")
        print(text.strip().splitlines()[-1])


def explain_common_errors() -> None:
    examples = {
        "NameError": "обращение к имени, которое не объявлено",
        "TypeError": "операция не подходит для этого типа",
        "IndexError": "индекс за пределами последовательности",
        "KeyError": "ключа нет в словаре",
        "AttributeError": "у объекта нет такого атрибута",
    }
    for name, text in examples.items():
        print(f"{name:14} {text}")


def main() -> None:
    print("divide:", divide(10, 2))
    try:
        divide(1, 0)
    except AssertionError as error:
        print("assert:", error)

    print(parse_ints(["1", "два", "3"]))
    show_traceback()
    explain_common_errors()


if __name__ == "__main__":
    main()
