"""Композиция: объект содержит другой объект."""


class Engine:
    def __init__(self, power: int) -> None:
        self.power = power

    def start(self) -> str:
        return f"двигатель {self.power} л.с. запущен"


class Car:
    def __init__(self, name: str, engine: Engine) -> None:
        self.name = name
        self.engine = engine

    def start(self) -> str:
        return f"{self.name}: {self.engine.start()}"


def main() -> None:
    car = Car("Core", Engine(120))
    print(car.start())


if __name__ == "__main__":
    main()
