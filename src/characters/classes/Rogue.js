import Character from '../Character.js';

class Rogue extends Character {
    constructor() {
        super('Rogue', 'Un combattant agile et rapide, spécialisé dans les attaques furtives.', {
            hp: 100,
            atk: 18,
            def: 10,
            crit: 0.25,
            lifeSteal: 0.05,
            skin: "Elf_1",
        });
    }

    stealth() {
        console.log(`${this.name} utilise Furtivité ! Devient invisible temporairement.`);
        this.isInvisible = true;
        setTimeout(() => {
            this.isInvisible = false;
            console.log(`${this.name} n'est plus invisible.`);
        }, 5000);
    }
}

export default Rogue;