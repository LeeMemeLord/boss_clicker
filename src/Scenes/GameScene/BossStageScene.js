import Phaser from 'phaser';

import elec2 from '../../assets/elc2.png';
import Knight from "../../characters/classes/Knight";
import Rogue from "../../characters/classes/Rogue";
import Character from "../../characters/Character";

class BossStageScene extends Phaser.Scene {
    constructor() {
        super({key: 'BossStageScene'});
    }

    init(data) {

        this.scene.stop('CharacterMenuScene');
        this.scene.stop('MainMenu');

        this.character = null;
        this.skin = null;
        this.number = null;

        if (data.character) {
            if (data.character.skin.includes('Knight')) {
                this.character = new Knight(data.character.name, data.character.description, data.character.stats);
            } else if (data.character.skin.includes('Elf')) {
                this.character = new Rogue(data.character.name, data.character.description, data.character.stats);
            }
            Object.assign(this.character, data.character);

            this.number = this.character.skin.match(/\d+/)[0];
            this.skin = this.character.skin.replace(`_${this.number}`, '');
        }
    }

    preload() {
        this.load.image('background3', require('../../assets/forest.png'));
        this.load.image('particle', elec2);
        console.log(this.skin);
        console.log(this.number);
        if (this.character) {
            for (let i = 0; i <= 9; i++) {
                this.load.image(
                    `${this.skin}${this.number}_idle_${i}`,
                    require(`../../assets/sprite/_PNG/${this.number}_${this.skin.toUpperCase()}/${this.skin}_0${this.number}__IDLE_00${i}.png`)
                );

                this.load.image(
                    `${this.skin}${this.number}_attack_${i}`,
                    require(`../../assets/sprite/_PNG/${this.number}_${this.skin.toUpperCase()}/${this.skin}_0${this.number}__ATTACK_00${i}.png`)
                );

                this.load.image(
                    `${this.skin}${this.number}_hurt_${i}`,
                    require(`../../assets/sprite/_PNG/${this.number}_${this.skin.toUpperCase()}/${this.skin}_0${this.number}__HURT_00${i}.png`)
                );

                this.load.image(
                    `${this.skin}${this.number}_dead_${i}`,
                    require(`../../assets/sprite/_PNG/${this.number}_${this.skin.toUpperCase()}/${this.skin}_0${this.number}__DIE_00${i}.png`)
                );
            }
        }
    }

    create() {
        const {width, height} = this.sys.game.config;

        this.time.delayedCall(10000, () => {

            this.cameras.main.shake(500, 0.02);

            this.time.delayedCall(500, () => {
                this.add.text(width / 2, height / 2, 'Attention!', {
                    fontSize: '48px',
                    fill: '#ff0000',
                    stroke: '#000',
                    strokeThickness: 4,
                }).setOrigin(0.5);
            });
        });

        let counter = 0;

        this.add.image(width / 2, height / 2, 'background3').setDisplaySize(width, height);

        this.add.text(width / 2, 20, 'Boss Stage', {fontSize: '32px', fill: '#fff'}).setOrigin(0.5);

        const backButton = this.add.text(10, 10, 'Retour', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: {x: 10, y: 5},
            borderRadius: 5,
        })
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                sessionStorage.clear();
                this.scene.stop('BossStageScene');
                this.scene.start('MainMenu');
            })
            .on('pointerover', () => {
                backButton.setStyle({fill: '#ff0'});
            })
            .on('pointerout', () => {
                backButton.setStyle({fill: '#fff'});
            });

        backButton.setOrigin(0, 0);

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
            scale: {start: 0.06, end: 0},
            lifespan: 500,
            rotate: {start: 0, end: 360},
            blendMode: 'ADD',
            active: false,

        });

        if (this.character) {
            const idleFrames = Array.from({length: 10}, (_, i) => ({
                key: `${this.skin}${this.number}_idle_${i}`,
            }));

            this.anims.create({
                key: `${this.skin}${this.number}_idle`,
                frames: idleFrames,
                frameRate: 20,
                repeat: -1,
            });

            const attackFrames = Array.from({length: 10}, (_, i) => ({
                key: `${this.skin}${this.number}_attack_${i}`,
            }));

            this.anims.create({
                key: `${this.skin}${this.number}_attack`,
                frames: attackFrames,
                frameRate: 20,
                repeat: 0,
            });

            const hurtFrames = Array.from({length: 10}, (_, i) => ({
                key: `${this.skin}${this.number}_hurt_${i}`,
            }));

            this.anims.create({
                key: `${this.skin}${this.number}_hurt`,
                frames: hurtFrames,
                frameRate: 20,
                repeat: 0,
            });

            const deadFrames = Array.from({length: 10}, (_, i) => ({
                key: `${this.skin}${this.number}_dead_${i}`,
            }));

            this.anims.create({
                key: `${this.skin}${this.number}_dead`,
                frames: deadFrames,
                frameRate: 20,
                repeat: 0,
            });

            if (this.characterSprite) {
                this.characterSprite.destroy(); // Supprime l'ancien sprite s'il existe
            }

            if (this.character.skin.includes('Knight')) {
                this.characterSprite = this.add.sprite(200, yPosition8 - 75, `${this.skin}${this.number}_idle_0`)
                    .play(`${this.skin}${this.number}_idle`)
                    .setDisplaySize(400, 500)
                    .setOrigin(0.5);
            }
            else if (this.character.skin.includes('Elf')) {
                this.characterSprite = this.add.sprite(200, yPosition8 - 145, `${this.skin}${this.number}_idle_0`)
                    .play(`${this.skin}${this.number}_idle`)
                    .setDisplaySize(400, 500)
                    .setOrigin(0.5);
            }




            const maxHealth = this.character.stats.hp;

            const healthBarWidth = 200;
            const healthBarHeight = 20;
            const healthBarX = this.characterSprite.x - healthBarWidth / 2;
            const healthBarY = this.characterSprite.y - 200;
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

            if (!this.character.currentHp <= 0 || counter === 0) {
                this.input.on('pointerdown', (pointer) => {

                    console.log(counter)
                    if (counter === 0) {
                        this.characterSprite.play(`${this.skin}${this.number}_attack`);
                        this.characterSprite.on('animationcomplete', (animation) => {
                            if (animation.key === `${this.skin}${this.number}_attack`) {
                                this.characterSprite.play(`${this.skin}${this.number}_idle`);
                            }
                        });
                    }

                    const emitter = particles.createEmitter({
                        x: pointer.x,
                        y: pointer.y,
                        speed: {min: 100, max: 200},
                        angle: {min: 0, max: 360},
                        scale: {start: 0.1, end: 0},
                        lifespan: 300,
                        rotate: {start: 0, end: 360},
                        blendMode: 'ADD',
                    });

                    lineEmitter.setPosition(this.characterSprite.x, this.characterSprite.y);
                    lineEmitter.setEmitZone({
                        type: 'edge',
                        source: new Phaser.Geom.Line(this.characterSprite.x, this.characterSprite.y, pointer.x, pointer.y),
                        quantity: 50,
                    });
                    lineEmitter.start();

                    this.time.delayedCall(500, () => {
                        emitter.stop();
                        lineEmitter.stop();
                    });
                    if (!this.character.currentHp <= 0) {
                        let damage = this.character.attackEnemy(this.character);

                        updateHealthBar();

                        showDamageText(this.characterSprite.x, this.characterSprite.y - 100, damage);
                    }

                    if (this.character.currentHp <= 0 && counter === 0) {
                        console.log(`${this.character.name} est KO !`);
                        counter++;
                        this.characterSprite.play(`${this.skin}${this.number}_dead`).once('animationcomplete', () => {
                            particles.setVisible(false);
                            lineEmitter.stop();

                            const gameOverText = this.add.text(
                                this.cameras.main.centerX,
                                this.cameras.main.centerY - 100,
                                'Game Over',
                                {
                                    fontSize: '64px',
                                    fill: '#ff0000',
                                    stroke: '#000000',
                                    strokeThickness: 4,
                                }
                            ).setOrigin(0.5);

                            // Bouton Retry
                            const retryButton = this.add.text(
                                this.cameras.main.centerX,
                                this.cameras.main.centerY,
                                'Retry',
                                {
                                    fontSize: '32px',
                                    fill: '#fff',
                                    backgroundColor: '#000',
                                    padding: {x: 20, y: 10},
                                    borderRadius: 5,
                                }
                            )
                                .setOrigin(0.5)
                                .setInteractive({useHandCursor: true})
                                .on('pointerdown', () => {
                                    this.scene.restart();
                                })
                                .on('pointerover', () => {
                                    retryButton.setStyle({fill: '#ff0'});
                                })
                                .on('pointerout', () => {
                                    retryButton.setStyle({fill: '#fff'});
                                });

                            // Bouton Retour
                            const backButton = this.add.text(
                                this.cameras.main.centerX,
                                this.cameras.main.centerY + 60,
                                'Retour',
                                {
                                    fontSize: '32px',
                                    fill: '#fff',
                                    backgroundColor: '#000',
                                    padding: {x: 20, y: 10},
                                    borderRadius: 5,
                                }
                            )
                                .setOrigin(0.5)
                                .setInteractive({useHandCursor: true})
                                .on('pointerdown', () => {
                                    sessionStorage.clear();
                                    this.scene.stop('BossStageScene');
                                    this.scene.start('MainMenu');
                                })
                                .on('pointerover', () => {
                                    backButton.setStyle({fill: '#ff0'});
                                })
                                .on('pointerout', () => {
                                    backButton.setStyle({fill: '#fff'});
                                });

                        });

                    }

                });
            }
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

    clearAnimations() {
        const animations = this.anims.anims.entries;
        Object.keys(animations).forEach((key) => {
            if (key.includes(this.skin)) {
                this.anims.remove(key);
            }
        });
        this.children.removeAll();
    }

}

export default BossStageScene;
