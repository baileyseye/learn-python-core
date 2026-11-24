"""Comprehensions: короткая запись преобразований и фильтрации."""


def squares(numbers: list[int]) -> list[int]:
    return [number**2 for number in numbers]


def even_squares(numbers: list[int]) -> list[int]:
    return [number**2 for number in numbers if number % 2 == 0]


def lengths(words: list[str]) -> dict[str, int]:
    return {word: len(word) for word in words}


def unique_initials(names: list[str]) -> set[str]:
    return {name[0].upper() for name in names}


def flatten(matrix: list[list[int]]) -> list[int]:
    """Два for в одном comprehension читаются слева направо."""
    return [value for row in matrix for value in row]


def main() -> None:
    print("squares:", squares([1, 2, 3, 4]))
    print("even squares:", even_squares([1, 2, 3, 4, 5, 6]))
    print("lengths:", lengths(["python", "core", "ok"]))
    print("initials:", unique_initials(["анна", "борис", "алла"]))
    print("flatten:", flatten([[1, 2], [3], [4, 5]]))


if __name__ == "__main__":
    main()
