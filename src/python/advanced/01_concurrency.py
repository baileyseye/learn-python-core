"""Потоки, процессы и async — минимальное знакомство.

Правило большого пальца:
- ждём сеть или файлы -> async (или потоки);
- считаем на процессоре -> процессы;
- простой скрипт -> обычный последовательный код.

Важно: это только карта местности. Для конкурентных задач нужны
отдельные книги и практика.
"""

import asyncio
import threading
import time


def io_task(name: str, delay: float = 0.05) -> str:
    """Имитация ожидания: sleep не нагружает процессор."""
    time.sleep(delay)
    return f"{name}: готово"


def run_threads(names: list[str]) -> list[str]:
    """Потоки ждут одновременно, поэтому общее время меньше суммы."""
    results: list[str] = []

    def worker(name: str) -> None:
        results.append(io_task(name))

    threads = [threading.Thread(target=worker, args=(name,)) for name in names]
    started = time.perf_counter()
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    elapsed = time.perf_counter() - started
    return sorted(results) + [f"потоки: {elapsed:.2f} с"]


async def async_task(name: str, delay: float = 0.05) -> str:
    """Корутина: пока ждёт, event loop может выполнять другие задачи."""
    await asyncio.sleep(delay)
    return f"{name}: готово"


async def run_async(names: list[str]) -> list[str]:
    started = time.perf_counter()
    results = await asyncio.gather(*(async_task(name) for name in names))
    elapsed = time.perf_counter() - started
    return [*results, f"async: {elapsed:.2f} с"]


def pick_mode(kind: str) -> str:
    """Очень грубый совет: только чтобы запомнить идею."""
    if kind == "io":
        return "async или потоки"
    if kind == "cpu":
        return "процессы"
    raise ValueError("kind: ожидается 'io' или 'cpu'")


def main() -> None:
    print("потоки:", run_threads(["A", "B"]))
    print("async:", asyncio.run(run_async(["A", "B"])))
    print("сеть и файлы:", pick_mode("io"))
    print("тяжёлые расчёты:", pick_mode("cpu"))
    print("GIL: потоки не ускоряют чистый Python-код с вычислениями.")


if __name__ == "__main__":
    main()
