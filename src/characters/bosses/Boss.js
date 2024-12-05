import Character from "../Character";

class Boss extends Character {
    constructor(name = "Boss", description = "Un ennemi puissant qui garde le trésor.", baseStats = {}) {
        super(
            name,
            description,
            {
                hp: baseStats.hp || 600,
                atk: baseStats.atk || 25,
                def: baseStats.def || 0,
                crit: baseStats.crit || 0.2,
                lifeSteal: baseStats.lifeSteal || 0,
                skin: baseStats.skin || "Boss_1",
            },
            baseStats.weapon || null
        );
        this.currentHp = this.stats.hp;
        this.expDrop  = 0;
        this.calculateExpDrop();

    }

    calculateExpDrop() {
        const baseExp = 50;
        const levelMultiplier = 10;
        this.expDrop =  baseExp + this.level * levelMultiplier;
        console.log("expDrop", this.expDrop);
    }

}

export default Boss;
