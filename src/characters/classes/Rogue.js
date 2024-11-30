import Character from '../Character.js';

// Classe Rogue (Voleur)
class Rogue extends Character {
    constructor() {
        super('Rogue', 'Un combattant agile et rapide, spécialisé dans les attaques furtives.', {
            hp: 100,
            atk: 18,
            def: 10,
            crit: 0.25, // 25% de chance de critique
            lifeSteal: 0.05, // 5% de vol de vie
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