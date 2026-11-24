"""Функциональные инструменты: lambda, map, filter, reduce, itertools."""

from functools import reduce
from itertools import chain, groupby


def demonstrate_lambda() -> None:
    pairs = [("Анна", 92), ("Борис", 75), ("Вера", 92)]
    pairs.sort(key=lambda pair: (-pair[1], pair[0]))
    print(pairs)


def demonstrate_map_filter() -> None:
    numbers = [1, 2, 3, 4, 5, 6]
    doubled = list(map(lambda number: number * 2, numbers))
    evens = list(filter(lambda number: number % 2 == 0, numbers))
    print("map:", doubled)
    print("filter:", evens)


def demonstrate_reduce() -> None:
    numbers = [1, 2, 3, 4]
    print("reduce:", reduce(lambda acc, number: acc * number, numbers, 1))


def demonstrate_itertools() -> None:
    print("chain:", list(chain([1, 2], [3, 4])))
    words = ["apple", "avocado", "banana", "blueberry", "cherry"]
    grouped = {key: list(group) for key, group in groupby(words, key=lambda word: word[0])}
    print("groupby:", grouped)


def compose(*functions):
    """Композиция функций слева направо."""
    return lambda value: reduce(lambda acc, fn: fn(acc), functions, value)


def main() -> None:
    demonstrate_lambda()
    demonstrate_map_filter()
    demonstrate_reduce()
    demonstrate_itertools()

    process = compose(str.strip, str.lower, lambda text: text.replace(" ", "-"))
    print(process("  Learn Python Core  "))


if __name__ == "__main__":
    main()
