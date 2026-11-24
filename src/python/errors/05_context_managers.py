"""Контекстные менеджеры: with и contextlib."""

from contextlib import contextmanager


class Timer:
    """Класс с __enter__ и __exit__ — свой контекстный менеджер."""

    def __init__(self, label: str):
        self.label = label

    def __enter__(self):
        print(f"[{self.label}] начали")
        return self

    def __exit__(self, exc_type, exc, traceback):
        print(f"[{self.label}] закончили")
        if exc_type is not None:
            print(f"[{self.label}] ошибка подавлена: {exc_type.__name__}")
        return True  # подавляем исключение внутри блока


@contextmanager
def section(title: str):
    print(f"--- {title} ---")
    try:
        yield title
    finally:
        print(f"--- /{title} ---")


def main() -> None:
    with Timer("загрузка"):
        print("работаем")

    with Timer("риск"):
        raise RuntimeError("что-то пошло не так")

    with section("JSON"):
        print("читаем файл")
        print("пишем файл")


if __name__ == "__main__":
    main()
