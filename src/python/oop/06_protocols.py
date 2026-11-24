"""Протоколы, ABC и утиная типизация."""

from abc import ABC, abstractmethod
from typing import Protocol


class PaymentProvider(Protocol):
    """Структурный тип: достаточно иметь метод pay."""

    def pay(self, amount: int) -> str: ...


class CardPayment:
    def pay(self, amount: int) -> str:
        return f"карта: списано {amount} ₽"


class CashPayment:
    def pay(self, amount: int) -> str:
        return f"наличные: принято {amount} ₽"


def checkout(provider: PaymentProvider, amount: int) -> None:
    print(provider.pay(amount))


class Repository(ABC):
    @abstractmethod
    def save(self, item: str) -> None: ...

    @abstractmethod
    def all(self) -> list[str]: ...


class MemoryRepository(Repository):
    def __init__(self) -> None:
        self._items: list[str] = []

    def save(self, item: str) -> None:
        self._items.append(item)

    def all(self) -> list[str]:
        return list(self._items)


def main() -> None:
    checkout(CardPayment(), 1500)
    checkout(CashPayment(), 300)

    repository: Repository = MemoryRepository()
    repository.save("Python")
    repository.save("FastAPI")
    print(repository.all())

    try:
        Repository()
    except TypeError as error:
        print("ABC:", error)


if __name__ == "__main__":
    main()
