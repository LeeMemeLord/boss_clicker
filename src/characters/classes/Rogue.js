import { Bow } from '../loot/loot.js';
import Character from '../Character.js';

class Rogue extends Character {
    constructor(weapon = new Bow()) {
        // Appel au constructeur parent
        super(
            'Rogue',
            'Un guerrier agile maîtrisant les arcs.',
            {
                hp: 100,
                atk: 15,
                def: 10,
                crit: 0.15,
                lifeSteal: 0.05,
                skin: 'Rogue_1',
            },
            weapon
        );

        if (!(weapon.type === 'bow')){
            throw new Error('Les Rogues ne peuvent utiliser que des arcs.');
        }

    }

    changeWeapon(newWeapon) {
        if (!(newWeapon instanceof Bow)) {
            console.error('Cette arme est incompatible avec les Rogues.');
            return;
        }

        // Retirer les dégâts de l'ancienne arme
        if (this.weapon) {
            this.stats.atk -= this.weapon.damage;
        }

        // Assignation de la nouvelle arme
        this.weapon = newWeapon;
        this.stats.atk += newWeapon.damage;

        console.log(`${this.name} a équipé une nouvelle arme : ${newWeapon.name}`);
    }

    dodge() {
        console.log(`${this.name} utilise Esquive ! Réduit les dégâts reçus temporairement.`);
        this.stats.def += 5;
        setTimeout(() => {
            this.stats.def -= 5;
            console.log(`${this.name} a perdu l'effet Esquive.`);
        }, 5000);
    }
}

export default Rogue;
