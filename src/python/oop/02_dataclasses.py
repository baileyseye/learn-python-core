"""dataclass: меньше шаблонного кода для данных."""

from dataclasses import asdict, dataclass, field


@dataclass
class Task:
    title: str
    done: bool = False
    tags: list[str] = field(default_factory=list)

    def complete(self) -> None:
        self.done = True


@dataclass(frozen=True)
class Point:
    x: int
    y: int


@dataclass(order=True)
class Version:
    major: int
    minor: int


def main() -> None:
    task = Task("Выучить Python")
    task.tags.append("учёба")
    task.complete()
    print(task)
    print(asdict(task))

    point = Point(2, 3)
    print(point)
    try:
        point.x = 10
    except Exception as error:
        print(type(error).__name__, "—", error)

    versions = sorted([Version(2, 1), Version(1, 9), Version(2, 0)])
    print(versions)


if __name__ == "__main__":
    main()
