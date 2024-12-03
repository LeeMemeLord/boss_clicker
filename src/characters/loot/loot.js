class Loot {
    constructor(name, rarity, value) {
        this.name = name;
        this.rarity = rarity;
        this.value = value;
    }
}

class Weapon extends Loot {
    constructor(name, rarity, value, damage, type) {
        super(name, rarity, value);
        this.damage = damage;
        this.type = type;
        this.crit = 0.1;
    }
}

class Sword extends Weapon {
    constructor() {
        super('Sword', randomRarity(), randomValue(100, 500), randomDamage(20, 50), 'sword');
    }
}

class Bow extends Weapon {
    constructor() {
        super('Bow', randomRarity(), randomValue(100, 500), randomDamage(15, 45), 'bow');
    }
}

class Coin extends Loot {
    constructor() {
        super('Coin', 'common', randomValue(1, 100));
    }
}

class Boost extends Loot {
    constructor() {
        const effects = ['attack', 'experience'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        super('Boost', randomRarity(), randomValue(50, 200), effect, randomEffectValue());
        this.effect = effect;
        this.effectValue = randomEffectValue();
    }
}

function randomRarity() {
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    return rarities[Math.floor(Math.random() * rarities.length)];
}

function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomEffectValue() {
    return Math.random() * (0.5 - 0.1) + 0.1;
}

function generateRandomLoot() {
    const lootTypes = [Sword, Bow, Coin, Boost];
    const LootClass = lootTypes[Math.floor(Math.random() * lootTypes.length)];
    return new LootClass();
}

for (let i = 0; i < 10; i++) {
    console.log(generateRandomLoot());
}
