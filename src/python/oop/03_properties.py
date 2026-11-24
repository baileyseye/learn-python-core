"""Свойства: контролируемый доступ к атрибутам."""


class Temperature:
    def __init__(self, celsius: float = 0):
        self._celsius = 0
        self.celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("ниже абсолютного нуля")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:
        return self._celsius * 9 / 5 + 32


class User:
    def __init__(self, email: str):
        self._email = ""
        self.email = email

    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, value: str) -> None:
        if "@" not in value:
            raise ValueError("некорректный email")
        self._email = value.lower()


def main() -> None:
    temperature = Temperature(25)
    print(temperature.celsius, temperature.fahrenheit)
    temperature.celsius = 100
    print(temperature.celsius, temperature.fahrenheit)

    try:
        temperature.celsius = -300
    except ValueError as error:
        print("ошибка:", error)

    user = User("ANNA@EXAMPLE.COM")
    print(user.email)
    try:
        user.email = "wrong"
    except ValueError as error:
        print("ошибка:", error)


if __name__ == "__main__":
    main()
