import Character from "../Character";

class Boss extends Character {
    constructor() {
        super(
            "Boss",
            "Un ennemi puissant qui garde le trésor.",
            {
                hp: 200,
                atk: 25,
                defense: 15,
                crit: 0.2,
                lifeSteal: 0.1,
                skin: "Boss_1",
            }
        );
        this.speed = 1;
    }
}