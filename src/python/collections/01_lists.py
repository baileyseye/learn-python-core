"""Списки: изменяемая последовательность."""


def demonstrate_methods() -> None:
    fruits = ["яблоко", "банан"]
    fruits.append("вишня")
    fruits.insert(1, "груша")
    fruits.extend(["киви", "манго"])
    print("список:", fruits)
    print("pop:", fruits.pop(), "→", fruits)
    fruits.remove("груша")
    print("remove:", fruits)
    print("index:", fruits.index("вишня"))


def demonstrate_copy_pitfall() -> None:
    original = [1, 2, 3]
    alias = original
    copy = original.copy()

    alias.append(4)
    copy.append(99)

    print("original:", original)
    print("alias:", alias)
    print("copy:", copy)


def demonstrate_nested() -> None:
    matrix = [[1, 2], [3, 4]]
    matrix[0][1] = 20
    print("matrix:", matrix)
    print("сумма строк:", [sum(row) for row in matrix])


def main() -> None:
    demonstrate_methods()
    demonstrate_copy_pitfall()
    demonstrate_nested()


if __name__ == "__main__":
    main()
