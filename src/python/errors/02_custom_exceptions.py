"""Свои исключения и цепочки причин."""


class AppError(Exception):
    """Базовое исключение приложения."""


class ValidationError(AppError):
    """Ошибка входных данных."""


class UserNotFoundError(AppError):
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"Пользователь {user_id} не найден")


def validate_username(name: str) -> str:
    if not name.strip():
        raise ValidationError("имя не может быть пустым")
    if len(name) < 3:
        raise ValidationError("имя короче трёх символов")
    return name.strip()


def find_user(users: dict[int, str], user_id: int) -> str:
    try:
        return users[user_id]
    except KeyError as error:
        raise UserNotFoundError(user_id) from error


def main() -> None:
    for name in ("Анна", "  ", "Ли"):
        try:
            print("ок:", validate_username(name))
        except ValidationError as error:
            print("ошибка:", error)

    try:
        find_user({1: "Анна"}, 99)
    except AppError as error:
        print(type(error).__name__, "—", error)
        print("причина:", type(error.__cause__).__name__)


if __name__ == "__main__":
    main()
