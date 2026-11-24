"""Строки: неизменяемость, f-строки и полезные методы."""


def demonstrate_creation() -> None:
    single = 'Python'
    double = "Python"
    multiline = """Первая строка
Вторая строка"""
    raw = r"C:\Users\student"
    print(single == double)
    print(multiline)
    print(raw)


def demonstrate_methods() -> None:
    text = "  Learn Python Core  "
    print("strip:", repr(text.strip()))
    print("lower:", text.strip().lower())
    print("replace:", text.strip().replace("Python", "FastAPI"))
    print("split:", "яблоко,банан,вишня".split(","))
    print("join:", " → ".join(["учить", "писать", "запускать"]))
    print("startswith:", "test_api.py".startswith("test_"))


def demonstrate_formatting() -> None:
    name = "Анна"
    score = 92.456
    print(f"{name}: {score:.1f}%")
    print(f"{name!r} в поле шириной 10: |{name:>10}|")
    print(f"{255:b} {255:o} {255:x}")


def demonstrate_immutability() -> None:
    original = "python"
    changed = original.upper()
    print("original:", original)
    print("changed:", changed)
    print("первый символ:", original[0], "последний:", original[-1])


def main() -> None:
    demonstrate_creation()
    demonstrate_methods()
    demonstrate_formatting()
    demonstrate_immutability()


if __name__ == "__main__":
    main()
