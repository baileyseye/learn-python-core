"""Генераторы: ленивые последовательности и yield."""


def countdown(start: int):
    """Генератор не хранит всю последовательность в памяти."""
    while start > 0:
        yield start
        start -= 1


def fibonacci(limit: int):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b


def read_lines(text: str):
    for line in text.splitlines():
        yield line.strip()


def pipeline(numbers):
    """Генераторные выражения можно соединять в цепочку."""
    evens = (number for number in numbers if number % 2 == 0)
    squares = (number**2 for number in evens)
    return sum(squares)


def main() -> None:
    print("countdown:", list(countdown(5)))
    print("fibonacci:", list(fibonacci(50)))

    generator = fibonacci(100)
    print("next:", next(generator), next(generator))
    print("остаток:", list(generator))

    print("строки:", list(read_lines("  первая\nвторая  ")))
    print("pipeline:", pipeline(range(10)))


if __name__ == "__main__":
    main()
