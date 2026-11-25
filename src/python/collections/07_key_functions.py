"""key, lambda и сортировка по правилу."""


def sort_by_length(words):
    return sorted(words, key=len)


def sort_by_abs(numbers):
    return sorted(numbers, key=abs)


def max_by(items, key):
    return max(items, key=key)


def main() -> None:
    print(sort_by_length(["python", "go", "rust"]))
    print(sort_by_abs([-5, 2, -1]))
    print(max_by(["анна", "борис"], key=len))


if __name__ == "__main__":
    main()
