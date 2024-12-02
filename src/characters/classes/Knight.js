import Character from '../Character.js';

class Knight extends Character {
    constructor() {
        super('Knight', 'Un guerrier robuste avec une armure lourde.', {
            hp: 150,
            atk: 12,
            def: 18,
            crit: 0.1,
            lifeSteal: 0.02,
            skin: "Knight_1",
        });
    }

    shieldBlock() {
        console.log(`${this.name} utilise Bouclier Protecteur ! Augmente la défense temporairement.`);
        this.stats.def += 10;
        setTimeout(() => {
            this.stats.def -= 10;
            console.log(`${this.name} a perdu l'effet Bouclier Protecteur.`);
        }, 5000);
    }
}

export default Knight;
