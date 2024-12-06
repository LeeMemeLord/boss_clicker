import Character from '../Character.js';

class Boss extends Character {
    constructor(name = "Boss", description = "Un ennemi puissant qui garde le trésor.", baseStats = {}) {
        super(
            name,
            description,
            {
                hp: baseStats.hp || 800,
                atk: baseStats.atk || 25,
                def: baseStats.def || 2,
                crit: baseStats.crit || 0.05,
                lifeSteal: baseStats.lifeSteal || 0,
                skin: baseStats.skin || "Boss_1",
            },
            baseStats.weapon || null
        );
        this.speed = 2;
        this.currentHp = this.stats.hp;
        this.expDrop = 0;
        this.autoAttackInterval = null;
        this.calculateExpDrop();
    }

    calculateExpDrop() {
        const baseExp = 50;
        const levelMultiplier = 10;
        this.expDrop = baseExp + this.level * levelMultiplier;
        console.log("expDrop", this.expDrop);
    }

    setSpeedByLevel(level) {
        if (this.speed === 10) {
            this.speed = 1;
        }
        this.speed = level;
    }

}
export default Boss;