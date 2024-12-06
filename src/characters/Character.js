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
        this.coins = 0;
        this.attackBoost = null;
        this.expBoost = null;
        this.attackBoostActive = false;
        this.expBoostActive = false;
    }

    gainGold(amount) {
        this.coins += amount;
        console.log(`${this.name} a gagné ${amount} pièces d'or.`);
    }

    attackEnemy(enemy) {
        if (!enemy || !enemy.isAlive()) {
            console.log(`${enemy ? enemy.name : 'Cible'} n'est pas valide ou est déjà mort.`);
            return 0;
        }

        const weaponCrit = this.weapon ? this.weapon.crit : 0;
        const weaponDamage = this.weapon ? this.weapon.damage : 0;

        const isCrit = Math.random() < this.stats.crit || Math.random() < weaponCrit;

        const baseDamage = this.stats.atk + weaponDamage;
        const damage = isCrit ? baseDamage * 2 : baseDamage;

        const finalDamage = Math.max(damage - enemy.stats.def, 0);
        enemy.currentHp = Math.max(enemy.currentHp - finalDamage, 0);

        console.log(`${enemy.name} HP restant: ${enemy.currentHp}`);

        if (enemy.currentHp === 0) {
            console.log(`${enemy.name} est vaincu !`);
        }


        const isLifeSteal = Math.random() < this.stats.lifeSteal;
        const lifeStealAmount = isLifeSteal ? finalDamage * this.stats.lifeSteal : 0;
        this.currentHp = Math.min(Math.floor(this.currentHp + lifeStealAmount), this.stats.hp);


        console.log(
            `${this.name} attaque ${enemy.name} pour ${finalDamage} dégâts ${
                isCrit ? '(CRITIQUE)' : ''
            }. Vol de vie : ${lifeStealAmount.toFixed(2)}.`
        );

        return finalDamage;
    }




    changeWeapon(newWeapon) {
        this.weapon = newWeapon;
        sessionStorage.setItem(this.name, JSON.stringify(this));
        console.log(`${this.name} a équipé une nouvelle arme : ${newWeapon.name}`);
    }


    gainExp(amount, type = "character") {
        this.exp += amount;
        console.log(`${this.name} gagne ${amount} EXP.`);

        while (this.exp >= this.getExpToLevelUp()) {
            this.levelUp(type);
        }
        console.log(`${this.name} EXP: ${this.exp}/${this.getExpToLevelUp()}`);
    }

    levelUp(type) {
        this.exp -= this.getExpToLevelUp();
        this.level += 1;

        console.log(`${this.name} monte au niveau ${this.level}!`);
        if(type === "character"){
            this.stats.hp += 15;
            this.stats.atk += 3;
            this.stats.def += 1;
            this.stats.crit = Math.min(this.stats.crit + 0.005, 1);
            this.stats.lifeSteal = Math.min(this.stats.lifeSteal + 0.01, 1);
            this.currentHp = this.stats.hp;
            sessionStorage.setItem(this.name, JSON.stringify(this));
            localStorage.setItem(this.name, JSON.stringify(this));
        }
        else if (type ==="boss"){
            this.stats.hp += 200;
            this.stats.atk += 10;
            this.stats.def += 5;
            this.stats.crit = Math.min(this.stats.crit + 0.00, 1);
            this.stats.lifeSteal = Math.min(this.stats.lifeSteal + 0.00, 1);
            this.currentHp = this.stats.hp;
        }

    }

    setLevel(level, type = "character") {
        this.level = level;
        this.exp = 0;

        if (type === "character") {
            this.stats.hp += 10 * (level - 1);
            this.stats.atk += 2 * (level - 1);
            this.stats.def += 2 * (level - 1);
            this.stats.crit = Math.min(this.stats.crit + 0.01 * (level - 1), 1);
            this.stats.lifeSteal = Math.min(this.stats.lifeSteal + 0.01 * (level - 1), 1);
        } else if (type === "boss") {
            this.stats.hp += 200 * (level - 1);
            this.stats.atk += 10 * (level - 1);
            this.stats.def += 4 * (level - 1);
            this.stats.crit = Math.min(this.stats.crit + 0.01 * (level - 1), 1);
            this.stats.lifeSteal = Math.min(this.stats.lifeSteal + 0.01 * (level - 1), 1);
        }

        this.currentHp = this.stats.hp;

        console.log(`${this.name} a été mis à niveau vers le niveau ${this.level} (${type}).`);
    }


    getExpToLevelUp() {
        return this.level * 100;
    }

    isAlive() {
        return this.currentHp > 0;
    }
}

export default Character;
