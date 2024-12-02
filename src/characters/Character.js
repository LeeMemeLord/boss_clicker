class Character {
    constructor(name, description, baseStats) {
        this.name = name;
        this.description = description;
        this.level = 1;
        this.exp = 0;
        this.skin = baseStats.skin || ""; // Utilise le skin si fourni
        this.stats = {
            hp: baseStats.hp,
            atk: baseStats.atk,
            def: baseStats.def,
            crit: baseStats.crit, // En pourcentage (0.1 = 10%)
            lifeSteal: baseStats.lifeSteal, // En pourcentage (0.05 = 5%)
        };
        this.currentHp = this.stats.hp; // Initialise les HP actuels à leur maximum
    }

    // Méthode pour infliger des dégâts à un ennemi
    attackEnemy(enemy) {
        console.log(` attaque ${enemy}!`);
        console.log(`${this.name} attaque ${enemy.name}!`);
        const isCrit = Math.random() < this.stats.crit; // Détermine si c'est un coup critique
        const damage = isCrit
            ? this.stats.atk * 2 // Dégâts critiques (double attaque)
            : this.stats.atk;

        const finalDamage = Math.max(damage - enemy.stats.def, 0);
        enemy.currentHp = Math.max(enemy.currentHp - finalDamage, 0); // Réduit les HP de l'ennemi sans descendre sous 0

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
        this.stats.crit = Math.min(this.stats.crit + 0.01, 1); // Limite à 100% de critique
        this.stats.lifeSteal = Math.min(this.stats.lifeSteal + 0.01, 1); // Limite à 100% de vol de vie
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
