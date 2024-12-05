// Exporter les classes individuellement
 class Loot {
    constructor(name, rarity, value) {
        this.name = name;
        this.rarity = rarity;
        this.value = value;
    }
}

 export class Weapon extends Loot {
    constructor(name, rarity, value, damage, type,levelMultiplier) {
        super(name, rarity, value);
        this.damage = damage;
        this.type = type;
        this.crit = 0.1;
        levelMultiplier = levelMultiplier || 1;
    }
}

export class Sword extends Weapon {
    constructor(name = 'Rusty Sword',
                rarity = 'common',
                value = 1,
                damage = 1,
                type = 'sword',
                levelMultiplier) // Niveau du personnage
    {

        if (levelMultiplier){
            const generatedRarity = randomRarity();
            const adjustedValue = randomValue(100, 500, generatedRarity) * levelMultiplier;
            const adjustedDamage = randomDamage(20, 50, generatedRarity) * levelMultiplier;

            super(
                'Sword',
                generatedRarity,
                adjustedValue, // Ajuste la valeur
                adjustedDamage, // Ajuste les dégâts
                'sword'
            );
        }
        else{
            super(name, rarity, value, damage, type);
        }

    }
}



export class Bow extends Weapon {
    constructor(name = 'Wooden Bow',
                rarity = 'common',
                value = 1,
                damage = 1,
                type = 'bow',
                levelMultiplier) // Niveau du personnage
    {
        if (levelMultiplier){
            const generatedRarity = randomRarity();
            const adjustedValue = randomValue(100, 500, generatedRarity) * levelMultiplier;
            const adjustedDamage = randomDamage(20, 40, generatedRarity) * levelMultiplier;

            super(
                'Bow',
                generatedRarity,
                adjustedValue, // Ajuste la valeur
                adjustedDamage, // Ajuste les dégâts
                'bow'
            );
        }
        else{
            super(name, rarity, value, damage, type);
        }
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
        const value = randomValue(50, 200, rarity);
        const effectValue = generateEffectValue(effect, rarity);
        super('Boost', rarity, value);
        this.effect = effect;
        this.effectValue = effectValue;
        this.duration = calculateDuration(rarity);
    }
}


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
    const weights = [70, 20, 8, 2];

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;

    let accumulatedWeight = 0;
    for (let i = 0; i < rarities.length; i++) {
        accumulatedWeight += weights[i];
        if (random < accumulatedWeight) {
            return rarities[i];
        }
    }
}


function randomValue(min, max, rarity) {
    const rarityMultiplier = {
        common: 1,
        rare: 2,
        epic: 3,
        legendary: 5,
    };

    const multiplier = rarityMultiplier[rarity] || 1; // Par défaut, multiplier = 1 si la rareté est inconnue
    return Math.floor((Math.random() * (max - min + 1) + min) * multiplier);

}

function randomDamage(min, max, rarity) {
    const rarityMultiplier = {
        common: 1,
        rare: 1.5,
        epic: 2,
        legendary: 3,
    };

    const multiplier = rarityMultiplier[rarity] || 1; // Par défaut, multiplier = 1 si la rareté est inconnue
    return Math.floor((Math.random() * (max - min + 1) + min) * multiplier);
}

export function generateRandomLoot(levelMultiplier = 1) {
    const lootTypes = [Sword, Bow, Coin, Boost];

    const loot = [new Coin()]; // Toujours ajouter un Coin

    const LootClass = lootTypes[Math.floor(Math.random() * lootTypes.length)];

    if (LootClass === Sword || LootClass === Bow) {
        loot.push(new LootClass(null, null, null, null, null, levelMultiplier)); // Passe le niveau
    } else {
        loot.push(new LootClass());
    }

    return loot;
}


