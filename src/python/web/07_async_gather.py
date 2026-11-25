"""async: gather и таймауты."""

import asyncio


async def fetch(name: str, delay: float = 0) -> dict:
    await asyncio.sleep(delay)
    return {"name": name}


async def fetch_all(names: list[str]) -> list[dict]:
    return await asyncio.gather(*(fetch(name) for name in names))


async def fetch_with_timeout(name: str, timeout: float):
    try:
        return await asyncio.wait_for(fetch(name, delay=0.05), timeout)
    except asyncio.TimeoutError:
        return None


async def main() -> None:
    print(await fetch_all(["a", "b"]))
    print(await fetch_with_timeout("slow", 0.001))


if __name__ == "__main__":
    asyncio.run(main())
