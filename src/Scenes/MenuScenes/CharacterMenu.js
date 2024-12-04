import Phaser from 'phaser';
import Knight from "../../characters/classes/Knight";
import Rogue from "../../characters/classes/Rogue";
import fireSpark from '../../assets/sprite/flame2.png';
import cursor from '../../assets/sprite/Normal.cur';
import swordLogo from '../../assets/sword_logo.png';
import {Bow, Sword} from "../../characters/loot/loot";

class CharacterMenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'CharacterMenuScene'});
    }

    init() {
        this.characters = [
            {id: 1, name: 'Guerrier', description: 'Un combattant robuste avec une épée.'},
            {id: 2, name: 'Elf', description: 'Un tireur agile avec une grande portée.'},
        ];

        this.currentKnightSkin = 1;
        this.currentElfSkin = 1;
        this.selectedCharacter = null;
    }

    preload() {
        for (let skin = 1; skin <= 3; skin++) {
            for (let i = 0; i <= 9; i++) {
                this.load.image(`Knight_${skin}_idle_${i}`, require(`../../assets/sprite/_PNG/${skin}_KNIGHT/Knight_0${skin}__IDLE_00${i}.png`));
            }
        }
        for (let skin = 1; skin <= 3; skin++) {
            for (let i = 0; i <= 9; i++) {
                this.load.image(`Elf_${skin}_idle_${i}`, require(`../../assets/sprite/_PNG/${skin}_ELF/Elf_0${skin}__IDLE_00${i}.png`));
            }
        }
        // this.load.image('spark', sparkBleu);
        this.load.image('fire', fireSpark);
        // this.load.image('background', background2);
        this.load.image('sword_logo', swordLogo);
    }

    create() {
        const {width, height} = this.sys.game.config;
        this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        this.addInteractiveParticles();

        this.add.text(width / 2, 40, 'Menu de Sélection de Personnage', {
            font: '32px Arial',
            color: '#ffffff',
        }).setOrigin(0.5);

        for (let skin = 1; skin <= 3; skin++) {
            const frames = Array.from({length: 10}, (_, i) => ({key: `Knight_${skin}_idle_${i}`}));
            this.anims.create({
                key: `Knight_idle_${skin}`,
                frames: frames,
                frameRate: 20,
                repeat: -1,
            });
        }

        for (let skin = 1; skin <= 3; skin++) {
            const frames = Array.from({length: 10}, (_, i) => ({key: `Elf_${skin}_idle_${i}`}));
            this.anims.create({
                key: `Elf_idle_${skin}`,
                frames: frames,
                frameRate: 20,
                repeat: -1,
            });
        }

        if (Object.keys(localStorage).length > 0) {
            this.addSwordLogo();
        }

        this.createCharacterCards(width, height);

        this.input.setDefaultCursor(`url(${cursor}), pointer`);
    }

    addSwordLogo() {
        const logo = this.add.image(50, 600, 'sword_logo')
            .setInteractive()
            .setScale(0.5)
            .setOrigin(0.5);

        this.add.text(165, 550, 'GO TO BALTE !!!', {
            font: '24px Arial',
            color: '#ffffff',
        }).setOrigin(0.5);

        logo.on('pointerover', () => {
            logo.setScale(0.6);
        });

        logo.on('pointerout', () => {
            logo.setScale(0.5);
        });

        logo.on('pointerdown', () => {
            console.log('Loading MainMenu scene...');
            this.scene.start('MainMenu');
        });
    }

    createCharacterCards(width, height) {
        const cardWidth = 400;
        const cardHeight = 600;
        const totalWidth = this.characters.length * cardWidth + (this.characters.length - 1) * 40;
        const startX = (width - totalWidth) / 2 + cardWidth / 2;
        const y = height / 2;

        this.characters.forEach((character, index) => {
            const x = startX + index * (cardWidth + 40);

            const card = this.add.rectangle(x, y, cardWidth, cardHeight, 0x8B4513, 1)
                .setInteractive()
                .setAlpha(0.7)
                .on('pointerdown', () => {
                    this.tweens.add({
                        targets: card,
                        scaleX: 0.9,
                        scaleY: 0.9,
                        duration: 100,
                        yoyo: true,
                        onComplete: () => this.selectCharacter(character, card),
                    });
                });

            if (character.name === 'Guerrier') {
                this.knightSprite = this.add.sprite(x, y - 30, `Knight_1_idle_0`)
                    .play(`Knight_idle_${this.currentKnightSkin}`)
                    .setDisplaySize(cardWidth - 50, cardHeight / 2)
                    .setOrigin(0.5);

                this.add.text(x, y + 100, 'Skins', {
                    font: '24px Arial',
                    color: '#000000',
                }).setOrigin(0.5);

                this.add.text(x - cardWidth / 2 + 40, y, '<', {
                    font: '48px Arial',
                    color: '#000000',
                })
                    .setInteractive()
                    .on('pointerdown', () => this.changeKnightSkin(-1));

                this.add.text(x + cardWidth / 2 - 40, y, '>', {
                    font: '48px Arial',
                    color: '#000000',
                })
                    .setInteractive()
                    .on('pointerdown', () => this.changeKnightSkin(1));
            }
            if (character.name === 'Elf') {
                this.elfSprite = this.add.sprite(x, y - 30, `Elf_1_idle_0`)
                    .play(`Elf_idle_${this.currentElfSkin}`)
                    .setDisplaySize(cardWidth - 50, cardHeight / 2)
                    .setOrigin(0.5);

                this.add.text(x, y + 100, 'Skins', {
                    font: '24px Arial',
                    color: '#000000',
                }).setOrigin(0.5);

                this.add.text(x - cardWidth / 2 + 40, y, '<', {
                    font: '48px Arial',
                    color: '#000000',
                })
                    .setInteractive()
                    .on('pointerdown', () => this.changeElfSkin(-1));

                this.add.text(x + cardWidth / 2 - 40, y, '>', {
                    font: '48px Arial',
                    color: '#000000',
                })
                    .setInteractive()
                    .on('pointerdown', () => this.changeElfSkin(1));
            }

            this.add.text(x, y - cardHeight / 2 + 40, character.name, {
                font: '24px Arial',
                color: '#ffffff',
            }).setOrigin(0.5);

            this.add.text(x, y + 150, character.description, {
                font: '16px Arial',
                color: '#ffffff',
                align: 'center',
                wordWrap: {width: cardWidth - 20},
            }).setOrigin(0.5);

            character.card = card;
        });

        const confirmButton = this.add.rectangle(width / 2, height - 50, 150, 50, 0xDAA520)
            .setInteractive()
            .on('pointerdown', this.confirmSelection.bind(this))
            .on('pointerover', () => {
                console.log('pointerover');
                confirmButton.setScale(1.1);
            })
            .on('pointerout', () => {
                confirmButton.setScale(1);
            });

        this.add.text(width / 2, height - 50, 'Confirmer', {
            font: '20px Arial',
            color: '#000000',
        }).setOrigin(0.5);
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

    changeKnightSkin(direction) {
        this.currentKnightSkin = Phaser.Math.Wrap(this.currentKnightSkin + direction, 1, 4);

        this.knightSprite.play(`Knight_idle_${this.currentKnightSkin}`);

        const knightCharacter = this.characters.find((char) => char.name === 'Guerrier');

        knightCharacter.skin = `Knight_${this.currentKnightSkin}`;

        this.selectCharacter(knightCharacter, knightCharacter.card);
    }

    changeElfSkin(direction) {
        this.currentElfSkin = Phaser.Math.Wrap(this.currentElfSkin + direction, 1, 4);

        this.elfSprite.play(`Elf_idle_${this.currentElfSkin}`);

        const elfCharacter = this.characters.find((char) => char.name === 'Elf')

        elfCharacter.skin = `Elf_${this.currentElfSkin}`; // Met à jour le skin du personnage

        this.selectCharacter(elfCharacter, elfCharacter.card);
    }

    selectCharacter(character, card) {
        this.characters.forEach((char) => char.card.setFillStyle(0x8B4513));

        this.selectedCharacter = character;

        card.setFillStyle(0xDAA520);
    }

    confirmSelection() {
        if (this.selectedCharacter) {
            let characterInstance;
            if (this.selectedCharacter.name === 'Guerrier') {
                const sword = new Sword();
                characterInstance = new Knight(sword);

                characterInstance.skin = `Knight_${this.currentKnightSkin}`;
            } else if (this.selectedCharacter.name === 'Elf') {
                const bow = new Bow();
                characterInstance = new Rogue(bow);

                characterInstance.skin = `Elf_${this.currentElfSkin}`;
            }
            this.showNameInputDialog(characterInstance);
        } else {
            alert('Veuillez sélectionner un personnage avant de continuer.');
        }
    }

    showNameInputDialog(characterInstance) {
        const { width, height } = this.sys.game.config;

        const interactionBlocker = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
            .setOrigin(0.5)
            .setInteractive();

        const dialogBackground = this.add.rectangle(width / 2, height / 2, 400, 200, 0x000000, 0.8)
            .setOrigin(0.5);

        const dialogBox = this.add.rectangle(width / 2, height / 2, 380, 180, 0xffffff, 1)
            .setOrigin(0.5);

        const instructionText = this.add.text(width / 2, height / 2 - 50, 'Entrez le nom de votre personnage :', {
            font: '18px Arial',
            color: '#000000',
        }).setOrigin(0.5);

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'Nom du personnage';
        inputElement.style.position = 'absolute';
        inputElement.style.left = `${width / 2 - 150}px`;
        inputElement.style.top = `${height / 2 - 20}px`;
        inputElement.style.width = '300px';
        inputElement.style.fontSize = '18px';
        inputElement.style.padding = '5px';
        document.body.appendChild(inputElement);

        const errorMessage = this.add.text(width / 2, height / 2 + 30, '', {
            font: '16px Arial',
            color: '#ff0000',
        }).setOrigin(0.5);

        const confirmButton = this.add.rectangle(width / 2, height / 2 + 60, 100, 40, 0x00aa00, 1)
            .setInteractive()
            .on('pointerdown', () => {
                const name = inputElement.value.trim();

                if (name) {
                    if (localStorage.getItem(name)) {
                        errorMessage.setText('Ce nom est déjà pris. Essayez un autre.');
                    } else {
                        characterInstance.name = name;

                        localStorage.setItem(name, JSON.stringify(characterInstance));
                        sessionStorage.setItem(name, JSON.stringify(characterInstance));

                        console.log('Personnage sauvegardé :', characterInstance);

                        document.body.removeChild(inputElement);

                        interactionBlocker.destroy();
                        dialogBackground.destroy();
                        dialogBox.destroy();
                        instructionText.destroy();
                        confirmButton.destroy();
                        errorMessage.destroy();
                        this.scene.stop('CharacterMenuScene');
                        this.scene.stop('MainMenu');
                        this.scene.start('BossStageScene', { character: characterInstance });
                    }
                } else {
                    errorMessage.setText('Veuillez entrer un nom valide.');
                }
            });

        this.add.text(width / 2, height / 2 + 60, 'Valider', {
            font: '16px Arial',
            color: '#ffffff',
        }).setOrigin(0.5);
    }
}

export default CharacterMenuScene;