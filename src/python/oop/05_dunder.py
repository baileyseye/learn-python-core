"""Магические методы: как объект ведёт себя в Python."""


class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self) -> str:
        return f"Vector({self.x!r}, {self.y!r})"

    def __str__(self) -> str:
        return f"({self.x}; {self.y})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self) -> int:
        return 2

    def __iter__(self):
        yield self.x
        yield self.y


class Playlist:
    def __init__(self, songs: list[str]):
        self.songs = songs

    def __len__(self) -> int:
        return len(self.songs)

    def __getitem__(self, index: int) -> str:
        return self.songs[index]

    def __contains__(self, song: object) -> bool:
        return song in self.songs


def main() -> None:
    first = Vector(1, 2)
    second = Vector(3, 4)
    print("str:", str(first))
    print("repr:", repr(first))
    print("add:", first + second)
    print("eq:", first == Vector(1, 2))
    print("len:", len(first), "распаковка:", list(first))

    playlist = Playlist(["Intro", "Core", "Outro"])
    print(len(playlist), playlist[1], "Core" in playlist)


if __name__ == "__main__":
    main()
