

class Loot {
    constructor(name, rarity, value) {
        this.name = name;
        this.rarity = rarity;
        this.value = value;
    }
}

export class Weapon extends Loot {
    constructor(name, rarity, value, damage, type, levelMultiplier) {
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

        if (levelMultiplier) {
            const name = generateName();
            const generatedRarity = randomRarity();
            const adjustedValue = randomValue(1, levelMultiplier, generatedRarity) + levelMultiplier;
            const adjustedDamage = randomDamage(levelMultiplier, generatedRarity);

            super(
                name, // Utiliser le nom du fichier comme nom de l'épée
                generatedRarity,
                adjustedValue, // Ajuste la valeur
                adjustedDamage, // Ajuste les dégâts
                'sword'
            );


        } else {
            super(name, rarity, value, damage, type);
        }
    }
}

function generateName() {
    // utiliser s1 a s11
    const swordNames = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'];

    return swordNames[Math.floor(Math.random() * swordNames.length)];


}


export class Bow extends Weapon {
    constructor(name = 'Wooden Bow',
                rarity = 'common',
                value = 1,
                damage = 1,
                type = 'bow',
                levelMultiplier) // Niveau du personnage
    {
        if (levelMultiplier) {
            const name = generateBowName();
            const generatedRarity = randomRarity();
            const adjustedValue = randomValue(1, levelMultiplier, generatedRarity) + levelMultiplier;
            const adjustedDamage = randomDamage(levelMultiplier, generatedRarity);

            super(
                name, // Nom généré pour l'arc
                generatedRarity, // Rareté générée
                adjustedValue, // Valeur ajustée
                adjustedDamage, // Dégâts ajustés
                'bow' // Type d'arme
            );
        } else {
            super(name, rarity, value, damage, type);
        }
    }
}

function generateBowName() {
    const bowNames = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'];
    return bowNames[Math.floor(Math.random() * bowNames.length)];
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
    const weights = [80, 15, 4, 1];

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

function randomDamage(level, rarity) {
    const rarityMultiplier = {
        common: 1,
        rare: 2,
        epic: 5,
        legendary: 10,
    };

    const baseDamage = level * 5;
    const multiplier = rarityMultiplier[rarity] || 1;
    const isDoubleDamage = Math.random() < 0.02;

    return Math.floor(baseDamage * multiplier * (isDoubleDamage ? 2 : 1));
}

export function generateRandomLoot(levelMultiplier = 1) {
    const lootTypes = [Sword, Bow, Boost, Coin];

    const loot = [new Coin()]; // Toujours ajouter un Coin

    const LootClass = lootTypes[Math.floor(Math.random() * lootTypes.length)];

    if (LootClass === Sword || LootClass === Bow) {
        loot.push(new LootClass(null, null, null, null, null, levelMultiplier)); // Passe le niveau
    } else {
        loot.push(new LootClass());
    }

    return loot;
}


