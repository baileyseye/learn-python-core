"""*args, **kwargs и распаковка аргументов."""


def total(*numbers: int) -> int:
    """*args собирает позиционные аргументы в кортеж."""
    return sum(numbers)


def build_profile(**fields: object) -> dict[str, object]:
    """**kwargs собирает именованные аргументы в словарь."""
    return {"type": "profile", **fields}


def log_call(message: str, *args: object, level: str = "INFO", **extra: object) -> None:
    """Порядок: обычные, *args, именованные, **kwargs."""
    print(f"[{level}] {message}", args or "", extra or "")


def forward(*args: object, **kwargs: object) -> None:
    print("args:", args)
    print("kwargs:", kwargs)


def main() -> None:
    print(total(1, 2, 3, 4))
    print(total())

    print(build_profile(name="Анна", role="admin", active=True))

    log_call("запуск", 1, 2, level="DEBUG", user="anna")
    log_call("старт")

    values = [10, 20, 30]
    options = {"level": "WARN", "service": "api"}
    log_call("распаковка", *values, **options)
    forward(*values, **options)


if __name__ == "__main__":
    main()
