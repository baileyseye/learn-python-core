"""Декораторы с параметрами."""

import functools


def repeat(times: int):
    def decorator(function):
        @functools.wraps(function)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = function(*args, **kwargs)
            return result

        return wrapper

    return decorator


def retry(times: int):
    def decorator(function):
        @functools.wraps(function)
        def wrapper(*args, **kwargs):
            last_error = None
            for _ in range(times):
                try:
                    return function(*args, **kwargs)
                except Exception as error:
                    last_error = error
            raise last_error

        return wrapper

    return decorator


@repeat(2)
def shout(text: str) -> str:
    return text.upper()


def main() -> None:
    print(shout("python"))


if __name__ == "__main__":
    main()
