"""Тестирование чуть глубже — минимальное знакомство.

В pytest те же идеи выглядят так:
- @pytest.mark.parametrize — много случаев без копипасты;
- @pytest.fixture — общая подготовка данных;
- mock.patch — подмена внешнего сервиса в тесте;
- pytest-cov — отчёт о том, какие строки выполнились.
"""

from unittest.mock import patch


def discount(price: int, percent: int) -> int:
    """Скидка в целых рублях."""
    if not 0 <= percent <= 100:
        raise ValueError("percent: от 0 до 100")
    return price * percent // 100


def final_price(price: int, rate_provider) -> int:
    """rate_provider — функция без аргументов.

    В тесте можно передать lambda: 10 и не ходить в настоящий сервис.
    Это и есть идея mock без сложной настройки.
    """
    return price - discount(price, rate_provider())


def fetch_rate() -> int:
    """В реальном коде здесь был бы сетевой вызов."""
    return 15


def demo_mock() -> int:
    with patch(__name__ + ".fetch_rate", return_value=50):
        return discount(1000, fetch_rate())


def main() -> None:
    cases = [(10, 1000, 100), (25, 200, 50), (0, 500, 0)]
    print("параметры:", [discount(price, percent) for percent, price, _ in cases])
    print("со своим источником скидки:", final_price(1000, lambda: 10))
    print("mock подменил сервис:", demo_mock())
    print("без mock:", discount(1000, fetch_rate()))
    print("coverage показывает, какие строки не выполнились в тестах.")


if __name__ == "__main__":
    main()
