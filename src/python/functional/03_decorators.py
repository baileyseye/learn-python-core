"""Декораторы: обёртки, functools.wraps и параметры."""

import functools
import time


def logged(function):
    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        print(f"→ {function.__name__}{args}")
        result = function(*args, **kwargs)
        print(f"← {function.__name__}: {result!r}")
        return result

    return wrapper


def retry(times: int = 2):
    """Декоратор с параметрами: нужен ещё один уровень вложенности."""

    def decorator(function):
        @functools.wraps(function)
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(1, times + 1):
                try:
                    return function(*args, **kwargs)
                except ValueError as error:
                    last_error = error
                    print(f"попытка {attempt}: {error}")
            raise last_error

        return wrapper

    return decorator


def timed(function):
    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        started = time.perf_counter()
        result = function(*args, **kwargs)
        elapsed = time.perf_counter() - started
        print(f"{function.__name__}: {elapsed:.4f} с")
        return result

    return wrapper


@logged
def add(a: int, b: int) -> int:
    return a + b


@retry(times=3)
def unstable(attempt: list[int]) -> str:
    attempt[0] += 1
    if attempt[0] < 3:
        raise ValueError("пока не готово")
    return "готово"


@timed
def work() -> int:
    return sum(range(100_000))


def main() -> None:
    add(2, 3)
    print(logged.__name__, add.__name__)
    print(unstable([0]))
    # work() измеряет реальное время; в учебном выводе оно зависит от машины,
    # поэтому декоратор показан в коде, но не вызывается в main.


if __name__ == "__main__":
    main()
