import { Bow } from '../loot/loot.js';
import Character from '../Character.js';

class Rogue extends Character {
    constructor(weapon = null) {
        const defaultWeapon = weapon || new Bow('b10', 'common', 1, 10,"bow");

        super(
            'Rogue',
            'Un guerrier agile maîtrisant les arcs.',
            {
                hp: 80,
                atk: 15,
                def: 6,
                crit: 0.15,
                lifeSteal: 0.35,
                skin: 'Rogue_1',
            },
            defaultWeapon
        );

        if (defaultWeapon.type !== 'bow') {
            throw new Error('Les Rogues ne peuvent utiliser que des arcs.');
        }
    }
}

export default Rogue;
