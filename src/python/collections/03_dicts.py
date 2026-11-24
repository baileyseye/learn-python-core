"""Словари: ключ → значение."""


def demonstrate_basics() -> None:
    user = {"name": "Анна", "age": 27}
    user["city"] = "Москва"
    user["age"] = 28

    print("name:", user["name"])
    print("email:", user.get("email", "не указан"))
    print("keys:", list(user.keys()))
    print("values:", list(user.values()))


def count_words(text: str) -> dict[str, int]:
    """Подсчёт частот — классическая задача для словаря."""
    counts: dict[str, int] = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts


def merge_profiles(base: dict, extra: dict) -> dict:
    """Оператор | объединяет словари, не меняя исходные."""
    return base | extra


def demonstrate_iteration() -> None:
    prices = {"книга": 1200, "курс": 4900}
    for title, price in prices.items():
        print(f"{title}: {price} ₽")


def main() -> None:
    demonstrate_basics()
    print(count_words("кот пёс кот кот"))
    print(merge_profiles({"lang": "Python"}, {"level": "core"}))
    demonstrate_iteration()


if __name__ == "__main__":
    main()
