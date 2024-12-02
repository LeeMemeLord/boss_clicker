import Phaser from 'phaser';

import elec2 from '../../assets/elc2.png';
import Knight from "../../characters/classes/Knight";
import Rogue from "../../characters/classes/Rogue";
import Character from "../../characters/Character";

class BossStageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossStageScene' });
    }

    init(data) {
        if (data.character) {
            // Si le personnage n'est pas une instance valide, réinstancier la classe correcte
            if (data.character.skin.includes('Knight')) {
                this.character = new Knight(
                    data.character.name,
                    data.character.description,
                    data.character.stats
                );
                console.log('Character data provided111111:', this.character);
            } else if (data.character.skin.includes('Rogue')) {
                this.character = new Rogue(
                    data.character.name,
                    data.character.description,
                    data.character.stats
                );
            } else {
                console.error('Unknown character type, cannot instantiate.');
                return;
            }

            // Copier les propriétés du personnage passé dans la nouvelle instance
            Object.assign(this.character, data.character);
        } else {
            console.error('No character data provided.');
            this.character = null;
        }

        console.log('Character initialized:', this.character);

        // Extraire le numéro et le skin si la classe est bien définie
        if (this.character && this.character.skin) {
            this.number = this.character.skin.match(/\d+/)[0]; // Extraire le premier nombre
            this.skin = this.character.skin.replace(`_${this.number}`, ''); // Enlever le numéro pour obtenir le skin
        }
    }

    preload() {
        this.load.image('background3', require('../../assets/forest.png'));
        this.load.image('particle', elec2); // Assurez-vous de charger une particule

        // Charger les frames d'animation du personnage
        if (this.character) {
            for (let i = 0; i <= 9; i++) {
                this.load.image(
                    `${this.skin}_idle_${i}`,
                    require(`../../assets/sprite/_PNG/${this.number}_${this.skin.toUpperCase()}/${this.skin}_0${this.number}__IDLE_00${i}.png`)
                );

                this.load.image(
                    `${this.skin}_attack_${i}`,
                    require(`../../assets/sprite/_PNG/${this.number}_${this.skin.toUpperCase()}/${this.skin}_0${this.number}__ATTACK_00${i}.png`)
                );
            }
        }
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.add.image(width / 2, height / 2, 'background3').setDisplaySize(width, height);

        this.add.text(width / 2, 20, 'Boss Stage', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);



        const barHeight = 50;
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, height - barHeight, width, barHeight);

        const enemy = new Character('Boss', 'Un boss puissant', {
            hp: 200,
            atk: 15,
            def: 5,
            crit: 0.1,
            lifeSteal: 0,
        });

        const totalNumbers = 10;
        const yPosition8 = (height / totalNumbers) * 8; // Position verticale du numéro 8

        const particles = this.add.particles('particle');
        const lineEmitter = particles.createEmitter({
            x: 0,
            y: 0,
            speed: 200,
            scale: { start: 0.06, end: 0 },
            lifespan: 500,
            rotate: { start: 0, end: 360 },
            blendMode: 'ADD',
            active: false,

        });

        if (this.character) {
            const idleFrames = Array.from({ length: 10 }, (_, i) => ({
                key: `${this.skin}_idle_${i}`,
            }));

            // Créer l'animation idle
            this.anims.create({
                key: `${this.skin}_idle`,
                frames: idleFrames,
                frameRate: 20,
                repeat: -1,
            });

            // Créer les frames pour l'animation d'attaque
            const attackFrames = Array.from({ length: 10 }, (_, i) => ({
                key: `${this.skin}_attack_${i}`,
            }));

            // Créer l'animation d'attaque
            this.anims.create({
                key: `${this.skin}_attack`,
                frames: attackFrames,
                frameRate: 20,
                repeat: 0, // Jouer une seule fois
            });

            // Ajouter le sprite du personnage
            const characterSprite = this.add.sprite(width / 2, yPosition8 - 75, `${this.skin}_idle_0`)
                .play(`${this.skin}_idle`)
                .setDisplaySize(400, 500)
                .setOrigin(0.5);

            const maxHealth = this.character.stats.hp;


            // Barre de vie
            const healthBarWidth = 200;
            const healthBarHeight = 20;
            const healthBarX = characterSprite.x - healthBarWidth / 2;
            const healthBarY = characterSprite.y - 280;
            const healthBarBackground = this.add.graphics();
            healthBarBackground.fillStyle(0xff0000, 1);
            healthBarBackground.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

            const healthBar = this.add.graphics();
            healthBar.fillStyle(0x00ff00, 1);
            healthBar.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

            const updateHealthBar = () => {
                healthBar.clear();
                const healthPercentage = this.character.currentHp / maxHealth;
                healthBar.fillStyle(0x00ff00, 1);
                healthBar.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight);
            };

            const showDamageText = (x, y, damage) => {
                const damageText = this.add.text(x, y, `-${damage}`, {
                    fontSize: '24px',
                    fill: '#ff0000',
                    stroke: '#000000',
                    strokeThickness: 2,
                }).setOrigin(0.5);

                // Animation de montée et de disparition
                this.tweens.add({
                    targets: damageText,
                    y: y - 50,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power1',
                    onComplete: () => damageText.destroy(), // Supprime le texte après l'animation
                });
            };

            // Ajouter un événement pour l'attaque sur clic de la souris
            this.input.on('pointerdown', (pointer) => {
                // Jouer l'animation d'attaque
                characterSprite.play(`${this.skin}_attack`);

                // Revenir à l'animation idle après la fin de l'attaque
                characterSprite.on('animationcomplete', (animation) => {
                    if (animation.key === `${this.skin}_attack`) {
                        characterSprite.play(`${this.skin}_idle`);
                    }
                });

                // Activer les particules pour représenter l'attaque
                const emitter = particles.createEmitter({
                    x: pointer.x,
                    y: pointer.y,
                    speed: { min: 100, max: 200 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.1, end: 0 },
                    lifespan: 300,
                    rotate: { start: 0, end: 360 },
                    blendMode: 'ADD',
                });

                // Activer les particules en "ligne"
                lineEmitter.setPosition(characterSprite.x, characterSprite.y);
                lineEmitter.setEmitZone({
                    type: 'edge',
                    source: new Phaser.Geom.Line(characterSprite.x, characterSprite.y, pointer.x, pointer.y),
                    quantity: 50,
                });
                lineEmitter.start();

                // Arrêter les émetteurs après un délai
                this.time.delayedCall(500, () => {
                    emitter.stop();
                    lineEmitter.stop();
                });
                this.character.attackEnemy(this.character);

                // const damage = this.character.stats.atk * 2;

                updateHealthBar();

                // Afficher les dégâts infligés au-dessus du personnage
                // Les dégâts sont calculés par `attackEnemy`
                // showDamageText(characterSprite.x, characterSprite.y - 100, damage);

                // Vérifier si le personnage est toujours en vie
                if (!this.character.isAlive()) {
                    console.log(`${this.character.name} est KO !`);
                    // Vous pouvez ajouter une logique supplémentaire ici (ex. redémarrer la scène, afficher un écran de défaite, etc.)
                }
            });

        }


        const baseY = height - 50 / 2;
        const text = 'Réalisé par LeeMemeLord';
        const fontSize = 20;
        const letterSpacing = 20;
        const totalTextWidth = text.length * letterSpacing;
        const startX = (width - totalTextWidth) / 2;
        const letters = [];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const letter = this.add.text(startX + i * letterSpacing, baseY, char, {
                fontSize: `${fontSize}px`,
                fill: '#fff',
            }).setOrigin(0.5);
            letters.push(letter);
        }


        this.tweens.addCounter({
            from: 0,
            to: 360,
            duration: 2000,
            repeat: -1,
            onUpdate: (tween) => {
                const value = tween.getValue();
                letters.forEach((letter, index) => {
                    const offset = Math.sin((value + index * 20) * Phaser.Math.DEG_TO_RAD) * 10;
                    letter.y = baseY + offset;
                });
            },
        });
    }
}

export default BossStageScene;
