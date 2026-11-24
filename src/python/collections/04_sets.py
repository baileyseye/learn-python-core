"""Множества: уникальность и операции над множествами."""


def unique_preserve_order(items: list[str]) -> list[str]:
    """set убирает дубликаты, но не сохраняет порядок — сохраняем сами."""
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def demonstrate_operations() -> None:
    python = {"Анна", "Борис", "Вера"}
    java = {"Борис", "Глеб"}

    print("объединение:", sorted(python | java))
    print("пересечение:", sorted(python & java))
    print("разность:", sorted(python - java))
    print("симметричная разность:", sorted(python ^ java))


def demonstrate_membership_speed() -> None:
    numbers = set(range(1_000_000))
    print("999999 в set:", 999_999 in numbers)
    print("добавление:", numbers.add(2_000_000))


def main() -> None:
    print(unique_preserve_order(["b", "a", "b", "c", "a"]))
    demonstrate_operations()
    demonstrate_membership_speed()


if __name__ == "__main__":
    main()
