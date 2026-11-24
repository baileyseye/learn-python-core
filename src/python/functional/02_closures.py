"""Замыкания: функция запоминает окружение."""


def make_counter(start: int = 0):
    """Возвращает функцию со своим независимым состоянием."""
    count = start

    def counter() -> int:
        nonlocal count
        count += 1
        return count

    return counter


def make_multiplier(factor: int):
    def multiply(value: int) -> int:
        return value * factor

    return multiply


def make_accumulator():
    values: list[int] = []

    def add(value: int) -> list[int]:
        values.append(value)
        return values

    return add


def main() -> None:
    counter = make_counter()
    print(counter(), counter(), counter())

    second = make_counter(10)
    print(second())

    double = make_multiplier(2)
    triple = make_multiplier(3)
    print(double(5), triple(5))

    add = make_accumulator()
    add(1)
    add(2)
    print(add(3))

    print("имя функции:", counter.__name__)
    print("замыкание:", counter.__closure__[0].cell_contents)


if __name__ == "__main__":
    main()
