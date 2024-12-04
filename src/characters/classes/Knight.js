import { Sword } from '../loot/loot.js';
import Character from '../Character.js';

class Knight extends Character {
    constructor(weapon = new Sword()) {
        super(
            'Knight',
            'Un guerrier robuste avec une armure lourde.',
            {
                hp: 150,
                atk: 12,
                def: 18,
                crit: 0.1,
                lifeSteal: 0.02,
                skin: 'Knight_1',
            },
            weapon
        );

        if (!weapon.type === 'sword') {
            throw new Error('Les Knights ne peuvent utiliser que des épées.');
        }

    }

}
export default Knight;