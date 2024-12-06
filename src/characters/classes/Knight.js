import { Sword } from '../loot/loot.js';
import Character from '../Character.js';

class Knight extends Character {
    constructor(weapon = null) {
        const defaultWeapon = weapon || new Sword('Rusty Sword', 'common', 1, 10, 'sword');

        super(
            'Knight',
            'Un guerrier robuste avec une armure lourde.',
            {
                hp: 150,
                atk: 12,
                def: 18,
                crit: 0.1,
                lifeSteal: 0.3,
                skin: 'Knight_1',
            },
            defaultWeapon
        );

        // Vérification pour s'assurer que l'arme est une épée
        if (defaultWeapon.type !== 'sword') {
            throw new Error('Les Knights ne peuvent utiliser que des épées.');
        }
    }
}

export default Knight;
