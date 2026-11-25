"""Пишем тесты: поведение, границы и ошибки."""


def slugify(title: str) -> str:
    return "-".join(title.lower().split())


def test_slugify_simple() -> None:
    assert slugify("Learn Python Core") == "learn-python-core"


def test_slugify_spaces() -> None:
    assert slugify("  A  B  ") == "a-b"


def test_slugify_empty() -> None:
    assert slugify("") == ""


def main() -> None:
    print(slugify("Learn Python Core"))


if __name__ == "__main__":
    main()
