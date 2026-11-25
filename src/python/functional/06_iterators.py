"""Итераторы: __iter__ и __next__."""


class Countdown:
    def __init__(self, start: int) -> None:
        self.current = start

    def __iter__(self):
        return self

    def __next__(self) -> int:
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value


def main() -> None:
    print(list(Countdown(3)))


if __name__ == "__main__":
    main()
