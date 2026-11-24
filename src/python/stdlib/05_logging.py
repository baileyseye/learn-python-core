"""Логирование: уровни, формат и логгеры."""

import logging
import sys


def configure(level: int = logging.INFO) -> logging.Logger:
    logger = logging.getLogger("course.demo")
    logger.setLevel(level)
    logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(levelname)s %(name)s: %(message)s"))
    logger.addHandler(handler)
    logger.propagate = False
    return logger


def process_order(logger: logging.Logger, order_id: int, amount: int) -> None:
    logger.debug("старт обработки заказа %s", order_id)
    if amount <= 0:
        logger.error("заказ %s: некорректная сумма %s", order_id, amount)
        return
    logger.info("заказ %s принят на %s ₽", order_id, amount)
    logger.warning("заказ %s: проверьте адрес доставки", order_id)


def main() -> None:
    logger = configure()
    process_order(logger, 101, 2500)
    process_order(logger, 102, 0)

    logger.setLevel(logging.DEBUG)
    process_order(logger, 103, 700)

    try:
        1 / 0
    except ZeroDivisionError as error:
        # В реальном коде здесь уместен logger.exception("...") — он добавит traceback.
        logger.error("пример ошибки: %s", error)


if __name__ == "__main__":
    main()
