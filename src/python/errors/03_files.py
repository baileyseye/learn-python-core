"""Работа с файлами: open, with и кодировки."""

import tempfile
from pathlib import Path


def write_and_read(folder: Path) -> None:
    path = folder / "notes.txt"
    path.write_text("первая строка\nвторая строка\n", encoding="utf-8")

    with path.open(encoding="utf-8") as file:
        for number, line in enumerate(file, start=1):
            print(number, line.rstrip())


def append_line(folder: Path) -> None:
    path = folder / "notes.txt"
    with path.open("a", encoding="utf-8") as file:
        file.write("третья строка\n")
    print("строк теперь:", len(path.read_text(encoding="utf-8").splitlines()))


def count_words(path: Path) -> int:
    with path.open(encoding="utf-8") as file:
        return sum(len(line.split()) for line in file)


def main() -> None:
    with tempfile.TemporaryDirectory() as temp:
        folder = Path(temp)
        write_and_read(folder)
        append_line(folder)
        print("слов:", count_words(folder / "notes.txt"))


if __name__ == "__main__":
    main()
