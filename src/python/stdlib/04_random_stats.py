"""random и statistics: воспроизводимые случайности и описательная статистика."""

import random
import statistics


def demonstrate_random() -> None:
    rng = random.Random(42)  # seed делает результат воспроизводимым
    print("выбор:", rng.choice(["камень", "ножницы", "бумага"]))
    print("3 из 10:", rng.sample(range(1, 11), 3))
    print("перемешали:", (lambda items: (rng.shuffle(items), items)[1])([1, 2, 3, 4]))


def simulate_dice(rolls: int = 10) -> dict[int, int]:
    rng = random.Random(7)
    counts = {face: 0 for face in range(1, 7)}
    for _ in range(rolls):
        counts[rng.randint(1, 6)] += 1
    return counts


def demonstrate_statistics() -> None:
    values = [7, 3, 9, 3, 5, 10]
    print("mean:", statistics.mean(values))
    print("median:", statistics.median(values))
    print("mode:", statistics.mode(values))
    print("stdev:", round(statistics.stdev(values), 3))
    print("quantiles:", statistics.quantiles(values, n=4))


def main() -> None:
    demonstrate_random()
    print("кубик:", simulate_dice())
    demonstrate_statistics()


if __name__ == "__main__":
    main()
