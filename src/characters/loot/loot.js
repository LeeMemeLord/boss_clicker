// Exporter les classes individuellement
export class Loot {
    constructor(name, rarity, value) {
        this.name = name;
        this.rarity = rarity;
        this.value = value;
    }
}

export class Weapon extends Loot {
    constructor(name, rarity, value, damage, type) {
        super(name, rarity, value);
        this.damage = damage;
        this.type = type;
        this.crit = 0.1;
    }
}

export class Sword extends Weapon {
    constructor(name = 'Rusty Sword',
                rarity = 'common',
                value = 1,
                damage = 1,
                type = 'sword',
                random = false)
    {
        if (random)
        {
            super(
                'Sword',
                randomRarity(),
                randomValue(100, 500),
                randomDamage(20, 50),
                'sword'
            );
        } else
        {
            super(name, rarity, value, damage, type);
        }
        this.type = 'sword';
    }
}

export class Bow extends Weapon {
    constructor(name = 'Wooden Bow',
                rarity = 'common',
                value = 1,
                damage = 1,
                type = 'bow',
                random = false)
    {
        if (random)
        {
            super(
                'Bow',
                randomRarity(),
                randomValue(100, 500),
                randomDamage(10, 40),
                'bow'
            );
        }
        else
        {
            super(name, rarity, value, damage, type);
        }
        this.type = 'bow';
    }

}

export class Coin extends Loot {
    constructor() {
        super('Coin', 'common', randomValue(1, 100));
    }
}

export class Boost extends Loot {
    constructor() {
        const effects = ['attack', 'experience'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        const rarity = randomRarity();
        const value = randomValue(50, 200);
        const effectValue = generateEffectValue(effect, rarity);
        super('Boost', rarity, value);
        this.effect = effect;
        this.effectValue = effectValue;
        this.duration = calculateDuration(rarity);
    }
}

// Fonctions utilitaires
function generateEffectValue(effect, rarity) {
    const baseEffect = effect === 'attack' ? 10 : 5;
    const rarityMultiplier = {
        common: 1,
        rare: 2,
        epic: 3,
        legendary: 5
    };
    return baseEffect * rarityMultiplier[rarity];
}

function calculateDuration(rarity) {
    const durations = {
        common: 10,
        rare: 20,
        epic: 50,
        legendary: 100
    };
    return durations[rarity];
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

export function generateRandomLoot() {
    const lootTypes = [Sword, Bow, Coin, Boost];
    const LootClass = lootTypes[Math.floor(Math.random() * lootTypes.length)];
    if (LootClass === Sword || LootClass === Bow) {
        return new LootClass(true);
    } else {
        return new LootClass();
    }
}
