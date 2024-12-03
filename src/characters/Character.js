class Character {
    constructor(name, description, baseStats) {
        this.name = name;
        this.description = description;
        this.level = 1;
        this.exp = 0;
        this.skin = baseStats.skin || "";
        this.stats = {
            hp: baseStats.hp,
            atk: baseStats.atk,
            def: baseStats.def,
            crit: baseStats.crit,
            lifeSteal: baseStats.lifeSteal,
        };
        this.currentHp = this.stats.hp;
    }

    attackEnemy(enemy) {
        const isCrit = Math.random() < this.stats.crit;
        const damage = isCrit
            ? this.stats.atk * 2
            : this.stats.atk;

        const finalDamage = Math.max(damage - enemy.stats.def, 0);
        enemy.currentHp = Math.max(enemy.currentHp - finalDamage, 0);

        console.log(`${enemy.name} HP restant: ${enemy.currentHp}`);

        if (enemy.currentHp === 0) {
            console.log(`${enemy.name} est vaincu !`);
        }
        // Vol de vie aleatoire du pourcentage de vieSteal
        const isLifeSteal = Math.random() < this.stats.lifeSteal;
        const lifeStealAmount = isLifeSteal ? finalDamage * this.stats.lifeSteal : 0;
        this.currentHp = Math.min(this.currentHp + lifeStealAmount, this.stats.hp);

        console.log(
            `${this.name} attaque ${enemy.name} pour ${finalDamage} dégâts ${
                isCrit ? '(CRITIQUE)' : ''
            }. Vol de vie : ${lifeStealAmount.toFixed(2)}.`
        );

        return finalDamage;
    }


    gainExp(amount) {
        this.exp += amount;
        console.log(`${this.name} gagne ${amount} EXP.`);

        while (this.exp >= this.getExpToLevelUp()) {
            this.levelUp();
        }
    }

    levelUp() {
        this.exp -= this.getExpToLevelUp();
        this.level += 1;

        console.log(`${this.name} monte au niveau ${this.level}!`);

        this.stats.hp += 10;
        this.stats.atk += 2;
        this.stats.def += 2;
        this.stats.crit = Math.min(this.stats.crit + 0.01, 1);
        this.stats.lifeSteal = Math.min(this.stats.lifeSteal + 0.01, 1);
        this.currentHp = this.stats.hp;
    }

    getExpToLevelUp() {
        return this.level * 100;
    }

    isAlive() {
        return this.currentHp > 0;
    }
}

export default Character;
