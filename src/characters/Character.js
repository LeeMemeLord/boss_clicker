class Character {
    constructor(name, description, baseStats) {
        this.name = name;
        this.description = description;
        this.level = 1;
        this.exp = 0;
        this.skin = "";

        // Statistiques de base
        this.stats = {
            hp: baseStats.hp,
            atk: baseStats.atk,
            def: baseStats.def,
            crit: baseStats.crit, // En pourcentage (0.1 = 10%)
            lifeSteal: baseStats.lifeSteal, // En pourcentage (0.05 = 5%)
        };

        // HP actuel
        this.currentHp = this.stats.hp;
    }

    // Méthode pour infliger des dégâts à un ennemi
    attackEnemy(enemy) {
        const isCrit = Math.random() < this.stats.crit; // Détermine si c'est un coup critique
        const damage = isCrit
            ? this.stats.atk * 2 // Dégâts critiques (double attaque)
            : this.stats.atk;

        const finalDamage = Math.max(damage - enemy.stats.def, 0);
        enemy.currentHp -= finalDamage;

        // Vol de vie
        const lifeStealAmount = finalDamage * this.stats.lifeSteal;
        this.currentHp = Math.min(this.currentHp + lifeStealAmount, this.stats.hp); // Limité aux HP max

        console.log(
            `${this.name} attaque ${enemy.name} pour ${finalDamage} dégâts ${
                isCrit ? '(CRITIQUE)' : ''
            }. Vol de vie : ${lifeStealAmount.toFixed(2)}.`
        );
    }

    gainExp(amount) {
        this.exp += amount;
        console.log(`${this.name} gagne ${amount} EXP.`);

        // Vérifie si le joueur monte de niveau
        while (this.exp >= this.getExpToLevelUp()) {
            this.levelUp();
        }
    }

    levelUp() {
        this.exp -= this.getExpToLevelUp();
        this.level += 1;

        console.log(`${this.name} monte au niveau ${this.level}!`);

        // Augmente les statistiques à chaque niveau
        this.stats.hp += 10;
        this.stats.atk += 2;
        this.stats.def += 2;
        this.stats.crit += 0.01; // Augmente le crit de 1%
        this.stats.lifeSteal += 0.01; // Augmente le vol de vie de 1%
        this.currentHp = this.stats.hp; // Restaure la vie
    }

    // Calcul de l'EXP nécessaire pour monter de niveau
    getExpToLevelUp() {
        return this.level * 100; // Simple règle : 100 EXP par niveau
    }

    // Vérifie si le personnage est en vie
    isAlive() {
        return this.currentHp > 0;
    }
}

export default Character;