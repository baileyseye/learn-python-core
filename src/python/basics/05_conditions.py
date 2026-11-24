"""Условия, truthiness и match/case."""


def classify_score(score: int) -> str:
    """Возвращает словесную оценку по баллам."""
    if score >= 90:
        return "отлично"
    if score >= 75:
        return "хорошо"
    if score >= 60:
        return "зачёт"
    return "нужно повторить"


def describe_truthiness() -> None:
    values = [0, 1, "", "текст", [], [0], None, False, True]
    for value in values:
        print(repr(value), "→", bool(value))


def describe_day(day: str) -> str:
    match day.lower():
        case "пн" | "вт" | "ср" | "чт" | "пт":
            return "рабочий день"
        case "сб" | "вс":
            return "выходной"
        case _:
            return "неизвестный день"


def main() -> None:
    for score in (95, 80, 61, 40):
        print(score, classify_score(score))
    describe_truthiness()
    for day in ("ср", "сб", "луна"):
        print(day, "—", describe_day(day))


if __name__ == "__main__":
    main()
