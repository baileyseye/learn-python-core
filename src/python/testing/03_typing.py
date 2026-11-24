"""Аннотации типов: подсказки для человека и инструментов."""

from dataclasses import dataclass
from typing import Iterable, Protocol, TypedDict


class Movie(TypedDict):
    title: str
    year: int


@dataclass
class Book:
    title: str
    pages: int

    def __len__(self) -> int:
        return self.pages


class Sized(Protocol):
    def __len__(self) -> int: ...


def average(values: Iterable[float]) -> float:
    items = list(values)
    if not items:
        return 0.0
    return sum(items) / len(items)


def newest(movies: list[Movie]) -> Movie | None:
    if not movies:
        return None
    return max(movies, key=lambda movie: movie["year"])


def total_pages(items: Iterable[Sized]) -> int:
    return sum(len(item) for item in items)


def main() -> None:
    print("average:", average([4, 5, 9]))
    print("average пусто:", average([]))

    movies: list[Movie] = [
        {"title": "Alien", "year": 1979},
        {"title": "Arrival", "year": 2016},
    ]
    print("newest:", newest(movies))
    print("total pages:", total_pages([Book("Core", 320), Book("API", 180)]))


if __name__ == "__main__":
    main()
