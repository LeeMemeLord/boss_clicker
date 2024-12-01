import Phaser from 'phaser';

import elec2 from '../../assets/elc2.png';

class BossStageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossStageScene' });
    }

    init(data) {
        this.character = data.character || null;

        if (this.character && this.character.skin) {
            // Extraire le numéro et le skin
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

        // Ajouter l'image d'arrière-plan
        this.add.image(width / 2, height / 2, 'background3').setDisplaySize(width, height);

        // Ajouter le titre pour la scène
        this.add.text(width / 2, 20, 'Boss Stage', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const barHeight = 50;
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, height - barHeight, width, barHeight);

        // Ajouter des numéros le long du côté gauche
        const totalNumbers = 10;
        const yPosition8 = (height / totalNumbers) * 8; // Position verticale du numéro 8

        // Configurer les particules
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

        // Ajouter et jouer l'animation du personnage
        if (this.character) {
            // Créer les frames pour l'animation idle
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
                    rotate: { start: 0, end: 360, },
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
            });
        }

        // Ajouter le texte avec animation de montagne russe
        const baseY = height - 50 / 2;
        const text = 'Réalisé par LeeMemeLord';
        const fontSize = 20;
        const letterSpacing = 20; // Espacement entre les lettres
        const totalTextWidth = text.length * letterSpacing; // Largeur totale du texte
        const startX = (width - totalTextWidth) / 2; // Position X de départ pour centrer le texte
        const letters = [];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const letter = this.add.text(startX + i * letterSpacing, baseY, char, {
                fontSize: `${fontSize}px`,
                fill: '#fff',
            }).setOrigin(0.5);
            letters.push(letter);
        }

        // Animer les lettres en montagne russe
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
