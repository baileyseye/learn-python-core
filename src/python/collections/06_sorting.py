"""Сортировка: key, reverse и стабильность."""

from dataclasses import dataclass
from operator import itemgetter


@dataclass
class Student:
    name: str
    grade: int


def sort_numbers() -> None:
    numbers = [5, 1, 9, 3]
    print("sorted:", sorted(numbers))
    print("по убыванию:", sorted(numbers, reverse=True))
    print("исходный список:", numbers)


def sort_words_by_length(words: list[str]) -> list[str]:
    return sorted(words, key=len)


def sort_students(students: list[Student]) -> list[Student]:
    """Сортировка по двум полям: сначала grade, потом name."""
    return sorted(students, key=lambda student: (-student.grade, student.name))


def main() -> None:
    sort_numbers()
    print(sort_words_by_length(["python", "c", "java", "go"]))
    print("по второму элементу:", sorted([("a", 3), ("b", 1)], key=itemgetter(1)))

    students = [Student("Анна", 90), Student("Борис", 90), Student("Вера", 95)]
    for student in sort_students(students):
        print(student)


if __name__ == "__main__":
    main()
