import Character from '../Character.js';

class Knight extends Character {
    constructor() {
        super('Knight', 'Un guerrier robuste avec une armure lourde.', {
            hp: 150,
            atk: 12,
            def: 18,
            crit: 0.1, // 10% de chance de critique
            lifeSteal: 0.02, // 2% de vol de vie
            skin: "Knight_1",
        });
    }

    // Compétence spéciale : Bouclier Protecteur
    shieldBlock() {
        console.log(`${this.name} utilise Bouclier Protecteur ! Augmente la défense temporairement.`);
        this.stats.def += 10; // Augmente temporairement la défense
        setTimeout(() => {
            this.stats.def -= 10; // Restaure la défense initiale
            console.log(`${this.name} a perdu l'effet Bouclier Protecteur.`);
        }, 5000); // L'effet dure 5 secondes
    }
}

export default Knight;
