"""Один короткий взгляд внутрь Python.

Здесь нет глубокой теории. Цель — узнать слова, которые встретятся
в документации и на собеседованиях: GIL, сборка мусора, дескриптор,
метакласс.
"""

import gc


class Positive:
    """Дескриптор: правило для одного атрибута.

    __get__ вызывается при чтении, __set__ — при записи.
    """

    def __set_name__(self, owner, name: str) -> None:
        self.name = f"_{name}"

    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        return getattr(instance, self.name, 0)

    def __set__(self, instance, value: int) -> None:
        if value < 0:
            raise ValueError("значение должно быть >= 0")
        setattr(instance, self.name, value)


class Wallet:
    balance = Positive()

    def __init__(self, balance: int = 0) -> None:
        self.balance = balance


class ModelMeta(type):
    """Метакласс создаёт классы. Здесь он просто добавляет имя таблицы."""

    def __new__(mcls, name, bases, namespace):
        cls = super().__new__(mcls, name, bases, namespace)
        cls.table = name.lower() + "s"
        return cls


class User(metaclass=ModelMeta):
    pass


def same_object() -> bool:
    """Две переменные могут указывать на один и тот же объект."""
    first = [1, 2, 3]
    second = first
    return first is second


def memory_demo() -> None:
    """del убирает одну ссылку; объект жив, пока есть другие."""
    items = [1, 2, 3]
    alias = items
    del alias
    print("после del alias список жив:", items)


def main() -> None:
    wallet = Wallet(100)
    print("баланс:", wallet.balance)
    try:
        wallet.balance = -1
    except ValueError as error:
        print("ошибка:", error)

    print("таблица User:", User.table)
    print("first is second:", same_object())
    memory_demo()
    print("сборка мусора прошла:", gc.collect() >= 0)
    print("GIL: в каждый момент байт-код исполняет один поток.")


if __name__ == "__main__":
    main()
