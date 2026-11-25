"""Числа и операторы.

int в Python не переполняется, а float хранит двоичное приближение.
Для денег и точных десятичных расчётов используют Decimal.
"""

from decimal import Decimal


def demonstrate_integers() -> None:
    big = 2**100
    print("2**100 =", big)
    print("деление с округлением вниз:", 17 // 5)
    print("остаток:", 17 % 5)
    print("степень:", 2**10)
    print("знак минус:", -7 // 2, -7 % 2)


def demonstrate_floats() -> None:
    print("0.1 + 0.2 =", 0.1 + 0.2)
    print("округление:", round(2.675, 2))
    print("Decimal:", Decimal("0.1") + Decimal("0.2"))


def calculate(a: int, b: int) -> dict[str, int]:
    """Возвращает результаты пяти арифметических операций."""
    return {
        "sum": a + b,
        "difference": a - b,
        "product": a * b,
        "quotient": a // b,
        "remainder": a % b,
    }


def main() -> None:
    demonstrate_integers()
    demonstrate_floats()
    print(calculate(10, 3))


if __name__ == "__main__":
    main()
