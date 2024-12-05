import {Sword} from "./loot/loot";

class Character {
    constructor(name, description, baseStats, weapon) {
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
        this.weapon = weapon;
        this.currentHp = this.stats.hp;
    }

    attackEnemy(enemy) {
        if (!this.weapon) {
            console.error('Aucune arme équipée. Impossible d’attaquer.');
            return 0;
        }

        const isCrit =
            Math.random() < this.stats.crit || Math.random() < this.weapon.crit;

        const baseDamage = this.stats.atk + this.weapon.damage;
        const damage = isCrit ? baseDamage * 2 : baseDamage;

        const finalDamage = Math.max(damage - enemy.stats.def, 0);
        enemy.currentHp = Math.max(enemy.currentHp - finalDamage, 0);

        console.log(`${enemy.name} HP restant: ${enemy.currentHp}`);

        if (enemy.currentHp === 0) {
            console.log(`${enemy.name} est vaincu !`);
        }

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



    changeWeapon(newWeapon) {
        this.weapon = newWeapon;
        console.log(`${this.name} a équipé une nouvelle arme : ${newWeapon.name}`);
    }


    gainExp(amount) {
        this.exp += amount;
        console.log(`${this.name} gagne ${amount} EXP.`);

        while (this.exp >= this.getExpToLevelUp()) {
            this.levelUp();
        }
        console.log(`${this.name} EXP: ${this.exp}/${this.getExpToLevelUp()}`);
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
        sessionStorage.setItem(this.name, JSON.stringify(this));
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    setLevel(level) {
        this.level = level;
        this.exp = 0;
        this.stats.hp += 10 * level;
        this.stats.atk += 2 * level;
        this.stats.def += 2 * level;
        this.stats.crit = Math.min(this.stats.crit + 0.01 * level, 1);
        this.stats.lifeSteal = Math.min(this.stats.lifeSteal + 0.01 * level, 1);
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
