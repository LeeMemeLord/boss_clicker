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
        this.scene.stop('CharacterMenuScene');
        this.scene.stop('MainMenu');
        if (data.character) {
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

            Object.assign(this.character, data.character);
        } else {
            console.error('No character data provided.');
            this.character = null;
        }

        console.log('Character initialized:', this.character);

        if (this.character && this.character.skin) {
            this.number = this.character.skin.match(/\d+/)[0];
            this.skin = this.character.skin.replace(`_${this.number}`, '');
        }
    }

    preload() {
        this.load.image('background3', require('../../assets/forest.png'));
        this.load.image('particle', elec2);

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
        const yPosition8 = (height / totalNumbers) * 8;

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

            this.anims.create({
                key: `${this.skin}_idle`,
                frames: idleFrames,
                frameRate: 20,
                repeat: -1,
            });

            const attackFrames = Array.from({ length: 10 }, (_, i) => ({
                key: `${this.skin}_attack_${i}`,
            }));

            this.anims.create({
                key: `${this.skin}_attack`,
                frames: attackFrames,
                frameRate: 20,
                repeat: 0,
            });

            const characterSprite = this.add.sprite(width / 2, yPosition8 - 75, `${this.skin}_idle_0`)
                .play(`${this.skin}_idle`)
                .setDisplaySize(400, 500)
                .setOrigin(0.5);

            const maxHealth = this.character.stats.hp;

            const healthBarWidth = 200;
            const healthBarHeight = 20;
            const healthBarX = characterSprite.x - healthBarWidth / 2;
            const healthBarY = characterSprite.y - 200;
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
                    fontSize: '42px',
                    fill: '#ff0000',
                    stroke: '#000000',
                    strokeThickness: 2,
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: damageText,
                    y: y - 50,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power1',
                    onComplete: () => damageText.destroy(),
                });
            };

            this.input.on('pointerdown', (pointer) => {
                characterSprite.play(`${this.skin}_attack`);

                characterSprite.on('animationcomplete', (animation) => {
                    if (animation.key === `${this.skin}_attack`) {
                        characterSprite.play(`${this.skin}_idle`);
                    }
                });

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

                lineEmitter.setPosition(characterSprite.x, characterSprite.y);
                lineEmitter.setEmitZone({
                    type: 'edge',
                    source: new Phaser.Geom.Line(characterSprite.x, characterSprite.y, pointer.x, pointer.y),
                    quantity: 50,
                });
                lineEmitter.start();

                this.time.delayedCall(500, () => {
                    emitter.stop();
                    lineEmitter.stop();
                });
                let damage = this.character.attackEnemy(this.character);

                updateHealthBar();

                showDamageText(characterSprite.x, characterSprite.y - 100, damage);

                if (!this.character.isAlive()) {
                    console.log(`${this.character.name} est KO !`);
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
