"""Ввод и вывод: print, f-строки и чтение из потока.

Настоящий input() в демонстрации не вызывается, иначе программа ждала бы
пользователя. Вместо этого функция принимает любой поток с методом readline.
"""

import io


def ask_name(stream) -> str:
    """Читает имя из потока. В реальной программе сюда передают sys.stdin."""
    print("Как тебя зовут? ", end="")
    name = stream.readline().strip()
    return name or "друг"


def format_receipt(items: list[tuple[str, int]]) -> str:
    """Выравнивание текста и чисел через f-строки."""
    lines = ["Товар            Цена"]
    lines.append("-" * 22)
    for title, price in items:
        lines.append(f"{title:<16}{price:>6}")
    lines.append("-" * 22)
    lines.append(f"{'Итого':<16}{sum(price for _, price in items):>6}")
    return "\n".join(lines)


def main() -> None:
    fake_input = io.StringIO("Анна\n")
    name = ask_name(fake_input)
    print(f"Привет, {name}!")

    print("a", "b", "c", sep=" | ")
    print("без перевода строки", end="")
    print(" — и продолжаем")

    print(format_receipt([("Книга", 1200), ("Курс", 4900), ("Кофе", 250)]))


if __name__ == "__main__":
    main()
