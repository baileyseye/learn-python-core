"""Срезы: start, stop, step и копия."""


def first_last(items):
    return items[0], items[-1]


def every_second(items):
    return items[::2]


def reverse(items):
    return items[::-1]


def main() -> None:
    numbers = [10, 20, 30, 40, 50]
    print(first_last(numbers))
    print(every_second(numbers))
    print(reverse(numbers))


if __name__ == "__main__":
    main()
