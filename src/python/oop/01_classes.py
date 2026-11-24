"""Классы и объекты: поля, методы и состояние."""


class BankAccount:
    """Простой банковский счёт."""

    bank_name = "Python Bank"  # атрибут класса, общий для всех

    def __init__(self, owner: str, balance: int = 0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: int) -> None:
        if amount <= 0:
            raise ValueError("сумма должна быть положительной")
        self.balance += amount

    def withdraw(self, amount: int) -> None:
        if amount > self.balance:
            raise ValueError("недостаточно средств")
        self.balance -= amount

    def describe(self) -> str:
        return f"{self.owner}: {self.balance} ₽ в {self.bank_name}"


def main() -> None:
    account = BankAccount("Анна", 1000)
    account.deposit(500)
    account.withdraw(300)
    print(account.describe())

    second = BankAccount("Борис")
    print(second.describe())
    print("атрибут класса:", BankAccount.bank_name)
    print("атрибут объекта:", account.owner)


if __name__ == "__main__":
    main()
