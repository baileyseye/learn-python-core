"""Наследование, super() и полиморфизм."""


class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        return "..."

    def introduce(self) -> str:
        return f"Я {self.name}, говорю: {self.speak()}"


class Dog(Animal):
    def speak(self) -> str:
        return "гав"


class Cat(Animal):
    def __init__(self, name: str, indoor: bool = True):
        super().__init__(name)
        self.indoor = indoor

    def speak(self) -> str:
        return "мяу"


class GuideDog(Dog):
    def __init__(self, name: str, owner: str):
        super().__init__(name)
        self.owner = owner

    def introduce(self) -> str:
        return f"{super().introduce()} Мой хозяин — {self.owner}."


def main() -> None:
    animals: list[Animal] = [Dog("Рекс"), Cat("Мурка"), GuideDog("Джек", "Анна")]
    for animal in animals:
        print(animal.introduce())

    print(isinstance(animals[0], Animal))
    print(isinstance(animals[0], Cat))
    print(issubclass(GuideDog, Dog))


if __name__ == "__main__":
    main()
