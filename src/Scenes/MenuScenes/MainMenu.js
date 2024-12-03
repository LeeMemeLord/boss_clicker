import Phaser from 'phaser';
import cursor from '../../assets/sprite/Normal.cur';
import cursor2 from '../../assets/scythe.cur';
import hammer from '../../assets/hammer.png';
import sparkBleu from "../../assets/sprite/blue_spark.png";
import Knight from "../../characters/classes/Knight";
import Rogue from "../../characters/classes/Rogue";

class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenu'});
    }

    init() {
    }

    preload() {
        this.load.image('guillotine', require('../../assets/GUIL.png'));
        this.load.image('background', require('../../assets/sprite/bg3png.jpg'));
        this.load.image('background2', require('../../assets/graveyard.png'));
        this.load.image('spark', sparkBleu);
        this.load.image('hammer', hammer);
        this.input.setDefaultCursor(`url(${cursor}), pointer`);
    }

    create() {
        const {width, height} = this.sys.game.config;

        const background = this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        const generalMessage = this.add.text(width / 2, 50, 'Select a character to play!', {
            fontSize: '24px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.animateTextSize(generalMessage);

        const keys = Object.keys(localStorage);
        const boxWidth = 300;
        const boxHeight = 40;
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const maxBoxesPerColumn = Math.floor((screenHeight - 100) / (boxHeight + 10));
        const columns = Math.ceil(keys.length / maxBoxesPerColumn);
        const horizontalSpacing = (screenWidth - columns * boxWidth) / (columns + 1);

        let column = 0;
        let row = 0;

        this.addInteractiveParticles();

        const boxes = [];
        let deleteEnabled = false;

        keys.forEach((key) => {
            const item = JSON.parse(localStorage.getItem(key));

            if (item && item.name) {
                const x = horizontalSpacing + column * (boxWidth + horizontalSpacing) + boxWidth / 2;
                const y = 100 + row * (boxHeight + 10) + boxHeight / 2;

                const box = this.add.rectangle(x, y, boxWidth, boxHeight, 0xDAA520).setOrigin(0.5, 0.5);
                const sprite = item.skin.split('_')[0];

                const text = this.add.text(x, y, `${item.name}: Level ${item.level} ${sprite}`, {
                    fontSize: '16px',
                    fill: '#fff',
                }).setOrigin(0.5);

                boxes.push({key, box, text, redness: 0});

                box.setInteractive();

                let holdStart = null;
                box.on('pointerdown', () => {
                    if (deleteEnabled) {
                        holdStart = this.time.now;
                    } else {
                        this.lancerLeJeu(item);
                    }
                });

                box.on('pointerup', () => {
                    if (holdStart !== null) {
                        holdStart = null;
                        box.fillColor = Phaser.Display.Color.GetColor(0, 255, 0);
                    }
                });

                box.on('pointerover', () => {
                    box.setScale(1.1);
                });

                box.on('pointerout', () => {
                    box.setScale(1);
                });

                this.time.addEvent({
                    delay: 50,
                    loop: true,
                    callback: () => {
                        if (holdStart !== null) {
                            const elapsed = this.time.now - holdStart;
                            const redness = Math.min(255, Math.floor((elapsed / 2000) * 255));
                            box.fillColor = Phaser.Display.Color.GetColor(255, 255 - redness, 255 - redness);

                            if (redness >= 255) {
                                holdStart = null;
                                box.destroy();
                                text.destroy();
                                localStorage.removeItem(key);
                            }
                        }
                    },
                });

                row++;
                if (row >= maxBoxesPerColumn) {
                    row = 0;
                    column++;
                }
            }
        });

        const hammerImage = this.add.image(100, screenHeight - 100, 'hammer');
        hammerImage.setInteractive();
        hammerImage.setScale(0.5);

        const createText = this.add.text(250, screenHeight - 50, 'Create Character', {
            fontSize: '16px',
            fill: '#fff',
        }).setOrigin(0.5);

        hammerImage.on('pointerover', () => {
            hammerImage.setScale(0.6);
        });

        hammerImage.on('pointerout', () => {
            hammerImage.setScale(0.5);
        });

        hammerImage.on('pointerdown', () => {
            console.log('Create Character button clicked!');
            this.scene.stop('MainMenu');
            this.scene.start('CharacterMenuScene');
        });

        const guillotineImage = this.add.image(screenWidth - 80, screenHeight - 150, 'guillotine');
        guillotineImage.setInteractive();
        guillotineImage.setScale(0.5);

        guillotineImage.on('pointerover', () => {
            guillotineImage.setScale(0.6);
        });

        guillotineImage.on('pointerout', () => {
            guillotineImage.setScale(0.5);
        });

        guillotineImage.on('pointerdown', () => {
            deleteEnabled = true;

            background.setTexture('background2');
            this.input.setDefaultCursor(`url(${cursor2}), pointer`);

            generalMessage.setText('HOLD TO DELETE');

            cancelButton.setVisible(true);
        });

        this.add.text(screenWidth - 250, screenHeight - 50, 'Delete Character', {
            fontSize: '16px',
            fill: '#fff',
        }).setOrigin(0.5);

        const cancelButton = this.add.text(screenWidth / 2, screenHeight - 50, 'Cancel', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#FF0000',
            padding: {x: 10, y: 5},
        })
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);

        cancelButton.on('pointerover', () => {
            cancelButton.setStyle({fill: '#FFD700'});
            cancelButton.setScale(1.1);
        });

        cancelButton.on('pointerout', () => {
            cancelButton.setStyle({fill: '#fff'});
            cancelButton.setScale(1);
        });

        cancelButton.on('pointerdown', () => {
            deleteEnabled = false;
            background.setTexture('background');
            this.input.setDefaultCursor(`url(${cursor}), pointer`);
            generalMessage.setText('Select a character to play!');
            cancelButton.setVisible(false);
        });
    }

    lancerLeJeu(item) {
        console.log('Character selected:', item);
        sessionStorage.setItem(item.name, JSON.stringify(item));

        let character;
        if (item.skin.includes("Knight")) {
            character = new Knight();
        } else if (item.skin.includes("Elf")) {
            character = new Rogue();
        } else {
            console.error("Unknown character type!");
            return;
        }

        console.log(`Character class: ${character.constructor.name}`);

        Object.assign(character, item);

        this.scene.stop('MainMenu');
        this.scene.stop('CharacterMenuScene');

        this.scene.start('BossStageScene', { character });
    }


    animateTextSize(text) {
        this.tweens.add({
            targets: text,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    addInteractiveParticles() {
        const particles = this.add.particles('spark');
        const emitter = particles.createEmitter({
            lifespan: 1000,
            speed: {min: 50, max: 150},
            angle: {min: 0, max: 360},
            quantity: 2,
            radial: true,
            scale: {start: 0.009, end: 0},
            alpha: {start: 1, end: 0},
            blendMode: Phaser.BlendModes.ADD,
        });

        this.input.on('pointermove', (pointer) => {
            emitter.setPosition(pointer.x, pointer.y);
        });
    }
}

export default MainMenu;
