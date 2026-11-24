"""Валидация данных: ручная проверка и идея Pydantic."""

from dataclasses import dataclass


class ValidationProblem(Exception):
    pass


@dataclass
class UserCreate:
    email: str
    age: int
    name: str = ""


def validate_user(email: str, age: int, name: str = "") -> UserCreate:
    """Ручная валидация — то, что Pydantic делает по аннотациям типов."""
    if "@" not in email:
        raise ValidationProblem("email должен содержать @")
    if not 0 < age < 150:
        raise ValidationProblem("возраст должен быть от 1 до 149")
    if not name.strip():
        raise ValidationProblem("имя не может быть пустым")
    return UserCreate(email=email.lower(), age=age, name=name.strip())


def try_pydantic() -> None:
    try:
        from pydantic import BaseModel, Field, ValidationError
    except ImportError:
        print("Pydantic не установлен — ручная валидация выше всё равно работает")
        return

    class UserModel(BaseModel):
        email: str
        age: int = Field(gt=0, lt=150)
        name: str

    try:
        user = UserModel(email="ANNA@EXAMPLE.COM", age=27, name="Анна")
        print("Pydantic:", user.model_dump())
        UserModel(email="wrong", age=200, name="")
    except ValidationError as error:
        print("Pydantic нашёл ошибок:", error.error_count())


def main() -> None:
    print(validate_user("Anna@Example.com", 27, " Анна "))
    for email, age, name in [("wrong", 20, "Анна"), ("a@b.c", 200, "Анна")]:
        try:
            validate_user(email, age, name)
        except ValidationProblem as error:
            print("ошибка:", error)

    try_pydantic()


if __name__ == "__main__":
    main()
