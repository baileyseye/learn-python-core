"""async/await: конкурентные операции ввода-вывода."""

import asyncio


async def fetch_user(user_id: int) -> dict[str, object]:
    await asyncio.sleep(0.01)  # имитация сетевого запроса
    return {"id": user_id, "name": f"user-{user_id}"}


async def fetch_all(ids: list[int]) -> list[dict[str, object]]:
    """gather запускает задачи конкурентно, а не по очереди."""
    tasks = [fetch_user(user_id) for user_id in ids]
    return await asyncio.gather(*tasks)


async def with_timeout(coro, seconds: float):
    try:
        return await asyncio.wait_for(coro, timeout=seconds)
    except TimeoutError:
        return {"error": "timeout"}


async def slow_operation() -> str:
    await asyncio.sleep(1)
    return "готово"


async def main_async() -> None:
    users = await fetch_all([1, 2, 3])
    print("пользователи:", users)
    print("timeout:", await with_timeout(slow_operation(), 0.01))


def main() -> None:
    asyncio.run(main_async())


if __name__ == "__main__":
    main()
