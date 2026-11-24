"""Циклы for и while, range, enumerate, zip и else."""


def multiplication_table(size: int = 3) -> list[list[int]]:
    """Вложенные циклы: таблица умножения."""
    return [[row * col for col in range(1, size + 1)] for row in range(1, size + 1)]


def find_first_even(numbers: list[int]) -> int | None:
    """for/else: else выполняется, только если не было break."""
    for number in numbers:
        if number % 2 == 0:
            print("нашли:", number)
            break
    else:
        print("чётных нет")
        return None
    return number


def countdown(start: int) -> None:
    while start > 0:
        print(start, end=" ")
        start -= 1
    print("старт!")


def main() -> None:
    print("range:", list(range(1, 6)))
    print("enumerate:")
    for index, letter in enumerate("Python", start=1):
        print(f"  {index}: {letter}")
    print("zip:", list(zip(["a", "b", "c"], [1, 2, 3])))
    print("таблица:", multiplication_table())
    find_first_even([1, 3, 8, 10])
    find_first_even([1, 3, 5])
    countdown(3)


if __name__ == "__main__":
    main()
