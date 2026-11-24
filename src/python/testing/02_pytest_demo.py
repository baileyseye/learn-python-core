"""Тесты: assert, pytest-стиль и параметризация.

Файл запускается и без pytest: функция run_self_tests сама проверяет
результаты и печатает отчёт. При установленном pytest его можно запустить
командой: pytest src/python/testing/02_pytest_demo.py
"""


def slugify(title: str) -> str:
    return "-".join(title.lower().split())


def parse_price(text: str) -> int:
    digits = "".join(char for char in text if char.isdigit())
    if not digits:
        raise ValueError("в строке нет цены")
    return int(digits)


def test_slugify_simple() -> None:
    assert slugify("Learn Python") == "learn-python"


def test_slugify_single_word() -> None:
    assert slugify("Python") == "python"


def test_parse_price() -> None:
    assert parse_price("1 200 ₽") == 1200


def test_parse_price_error() -> None:
    try:
        parse_price("бесплатно")
    except ValueError:
        return
    raise AssertionError("ожидалось ValueError")


def run_self_tests() -> None:
    tests = [
        test_slugify_simple,
        test_slugify_single_word,
        test_parse_price,
        test_parse_price_error,
    ]
    passed = 0
    for test in tests:
        try:
            test()
        except AssertionError as error:
            print(f"FAIL {test.__name__}: {error}")
        else:
            passed += 1
            print(f"ok   {test.__name__}")
    print(f"итого: {passed}/{len(tests)}")


def main() -> None:
    print(slugify("Learn Python Core"))
    print(parse_price("4 900 ₽"))
    run_self_tests()


if __name__ == "__main__":
    main()
