import Phaser from 'phaser';

import elec2 from '../../assets/elc2.png';
import Knight from "../../characters/classes/Knight";
import Rogue from "../../characters/classes/Rogue";
import Boss from "../../characters/bosses/Boss";
import {generateRandomLoot} from "../../characters/loot/loot";
import character from "../../characters/Character";

class BossStageScene extends Phaser.Scene {
    constructor() {
        super({key: 'BossStageScene'});
        this.boss = null; // Stocke l'instance actuelle du boss

    }

    init(data) {

        this.scene.stop('CharacterMenuScene');
        this.scene.stop('MainMenu');

        this.character = null;
        this.skin = null;
        this.number = null;
        if (data.character) {
            console.log('Données du personnage hghgfhgf:', data.character);
            if (data.character.skin.includes('Knight')) {
                this.character = new Knight();

            } else if (data.character.skin.includes('Elf')) {
                this.character = new Rogue();
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
        for (let bossId = 1; bossId <= 3; bossId++) {
            for (let i = 0; i <= 9; i++) {
                this.load.image(
                    `Boss${bossId}_idle_${i}`,
                    require(`../../assets/sprite_Boss/_PNG/${bossId}_TROLL/Troll_0${bossId}_1_IDLE_00${i}.png`)
                );

                this.load.image(
                    `Boss${bossId}_dead_${i}`,
                    require(`../../assets/sprite_Boss/_PNG/${bossId}_TROLL/Troll_0${bossId}_1_DIE_00${i}.png`)
                );
            }
        }


    }

    create() {
        const {width, height} = this.sys.game.config;

        let counter = 0;

        this.addBackground(width, height);
        this.addTitle(width);
        this.addBackButton();
        this.addBottomBar(width, height);
        this.addImagePlaceholder(width, height);

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

        this.createAnimations();
        this.initializeCharacterSprite(yPosition8);
        this.createHealthBar();

        if (this.character) {
            this.initializeInteraction(counter, particles, lineEmitter);
            this.checkGameOver(counter, particles, lineEmitter);
        }
        this.spawnNewBoss();


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


    addBackground(width, height) {
        this.add.image(width / 2, height / 2, 'background3').setDisplaySize(width, height);
    }

    addTitle(width) {
        const title = this.add.text(width / 2, 50, 'CLICK THE TROLL', {
            fontSize: '48px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Animation de rebond
        this.tweens.add({
            targets: title,
            y: 70, // Position de fin (oscillation verticale)
            duration: 1000, // Durée de l'animation
            ease: 'Bounce.easeOut', // Effet de rebond
            yoyo: true, // Retour à la position initiale
            repeat: -1, // Animation infinie
        });

        // Animation de changement de couleur
        let colorToggle = false;
        this.time.addEvent({
            delay: 500, // Changer la couleur toutes les 500ms
            callback: () => {
                title.setFill(colorToggle ? '#ffcc00' : '#ffffff'); // Alternance des couleurs
                colorToggle = !colorToggle;
            },
            loop: true,
        });

        // Animation de zoom
        this.tweens.add({
            targets: title,
            scale: 1.2, // Agrandissement
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true, // Retour à la taille initiale
            repeat: -1,
        });
    }

    addBackButton() {
        console.log('addBackButton called');

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
    }


    addBottomBar(width, height) {
        const barHeight = 50;
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, height - barHeight, width, barHeight);
    }

    addImagePlaceholder(width, height) {
        const placeholderWidth = 100;
        const placeholderHeight = 100;
        const margin = 10;

        const placeholder = this.add.graphics();
        placeholder.fillStyle(0xff0000, 1);
        placeholder.fillRect(margin, height - placeholderHeight - margin - 50, placeholderWidth, placeholderHeight);

        this.add.text(
            margin + placeholderWidth / 2,
            height - placeholderHeight / 2 - margin - 1 -50,
            'Image',
            {
                fontSize: '16px',
                fill: '#fff',
                align: 'center',
            }
        ).setOrigin(0.5);
    }



    createAnimations() {
        this.createIdleAnimation();
        this.createAttackAnimation();
        this.createHurtAnimation();
        this.createDeadAnimation();
    }

    createIdleAnimation() {
        const idleFrames = Array.from({length: 10}, (_, i) => ({
            key: `${this.skin}${this.number}_idle_${i}`,
        }));

        this.anims.create({
            key: `${this.skin}${this.number}_idle`,
            frames: idleFrames,
            frameRate: 20,
            repeat: -1,
        });
    }

    createAttackAnimation() {
        const attackFrames = Array.from({length: 10}, (_, i) => ({
            key: `${this.skin}${this.number}_attack_${i}`,
        }));

        this.anims.create({
            key: `${this.skin}${this.number}_attack`,
            frames: attackFrames,
            frameRate: 20,
            repeat: 0,
        });
    }

    createHurtAnimation() {
        const hurtFrames = Array.from({length: 10}, (_, i) => ({
            key: `${this.skin}${this.number}_hurt_${i}`,
        }));

        this.anims.create({
            key: `${this.skin}${this.number}_hurt`,
            frames: hurtFrames,
            frameRate: 20,
            repeat: 0,
        });
    }

    createDeadAnimation() {
        const deadFrames = Array.from({length: 10}, (_, i) => ({
            key: `${this.skin}${this.number}_dead_${i}`,
        }));

        this.anims.create({
            key: `${this.skin}${this.number}_dead`,
            frames: deadFrames,
            frameRate: 20,
            repeat: 0,
        });
    }

    initializeCharacterSprite(yPosition8) {
        if (this.characterSprite) {
            this.characterSprite.destroy();
        }

        const spriteKey = `${this.skin}${this.number}_idle_0`;
        const spritePosition = this.character.skin.includes('Knight')
            ? {x: 200, y: yPosition8 - 75}
            : {x: 200, y: yPosition8 - 145};

        this.characterSprite = this.add.sprite(spritePosition.x, spritePosition.y, spriteKey)
            .play(`${this.skin}${this.number}_idle`)
            .setDisplaySize(400, 500)
            .setOrigin(0.5);

        this.createLvLindicator(this.characterSprite.x, this.characterSprite.y - 150, this.character.level, 'character')
    }

    createHealthBar() {
        const maxHealth = this.character.stats.hp;

        const healthBarWidth = 200;
        const healthBarHeight = 20;
        const healthBarX = this.characterSprite.x - healthBarWidth / 2;
        const healthBarY = this.characterSprite.y - 150;

        // Fond rouge pour la barre de santé
        this.healthBarBackground = this.add.graphics();
        this.healthBarBackground.fillStyle(0xff0000, 1);
        this.healthBarBackground.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // Barre de santé verte
        this.healthBar = this.add.graphics();
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // Fonction pour mettre à jour la barre de santé
        this.updateHealthBar = () => {
            const healthPercentage = this.character.currentHp / maxHealth;
            this.healthBar.clear();
            this.healthBar.fillStyle(0x00ff00, 1);
            this.healthBar.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight);
        };
    }

    showDamageText(x, y, damage, whoIsAttacking) {
        let dps;
        if (whoIsAttacking === this.character) {
            console.log(this.character.stats.atk)
            dps = this.character.stats.atk + this.character.weapon.damage;
        } else {
            dps = this.boss.stats.atk;
        }

        const isCritical = damage > dps;
        const textColor = isCritical ? '#ffcc00' : '#ff0000';
        const fontSize = isCritical ? '52px' : '42px';
        const text = isCritical ? `CRIT! -${damage}` : `-${damage}`;

        const damageText = this.add.text(x, y, text, {
            fontSize: fontSize,
            fill: textColor,
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);


        const animationDuration = isCritical ? 1500 : 1000;
        const targetY = isCritical ? y - 70 : y - 50;

        this.tweens.add({
            targets: damageText,
            y: targetY,
            alpha: 0,
            duration: animationDuration,
            ease: 'Power1',
            onComplete: () => damageText.destroy(),
        });
    }


    initializeInteraction(counter, particles, lineEmitter) {
        if (this.character.currentHp > 0 && counter === 0) {
            this.input.on('pointerdown', (pointer) => {
                this.handlePointerDown(pointer, counter, particles, lineEmitter);
            });
        }
    }

    handlePointerDown(pointer, counter, particles, lineEmitter) {
        console.log(counter);

        if (counter === 0) {
            this.playAttackAnimation();
        }


        this.createParticleEffect(pointer, lineEmitter, particles);

    }

    playAttackAnimation() {
        this.characterSprite.play(`${this.skin}${this.number}_attack`);
        this.characterSprite.on('animationcomplete', (animation) => {
            if (animation.key === `${this.skin}${this.number}_attack`) {
                this.characterSprite.play(`${this.skin}${this.number}_idle`);
            }
        });
    }

    createParticleEffect(pointer, lineEmitter, particles) {
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
    }

    checkGameOver(counter, particles, lineEmitter) {
        this.input.on('pointerdown', () => {
            if (this.character.currentHp <= 0 && counter === 0) {
                counter++;
                this.handleCharacterDeath(particles, lineEmitter);
            }

        });
    }

    handleCharacterDeath(particles, lineEmitter) {
        this.characterSprite.play(`${this.skin}${this.number}_dead`).once('animationcomplete', () => {
            particles.setVisible(false);
            lineEmitter.stop();
            this.showGameOverUI();
        });
    }

    showGameOverUI() {
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

        this.createRetryButton();
        this.createBackButton();
    }

    createRetryButton() {
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
    }

    createBackButton() {
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
    }

    spawnNewBoss() {
        // Détruit l'ancien boss s'il existe
        if (this.bossSprite) {
            this.bossSprite.destroy();
        }

        const bossId = Phaser.Math.Between(1, 3);
        this.boss = new Boss();
        this.boss.id = bossId;
        this.setUpLevel();

        this.createBossAnimations(bossId);

        this.bossSprite = this.add.sprite(
            this.scale.width - 200,
            this.scale.height / 2 - 20,
            `Boss${bossId}_idle_0`
        )
            .play(`Boss${bossId}_idle`)
            .setDisplaySize(600, 800)
            .setOrigin(0.5);

        this.bossSprite.scaleX = -1;

        this.createLvLindicator(this.bossSprite.x, this.bossSprite.y - 150, this.boss.level, 'boss');

        // Crée la barre de vie du boss
        this.createBossHealthBar(this.boss.stats.hp, 400, 30, this.bossSprite.x - 200, this.bossSprite.y - 150);

        // Ajoute l'interaction pour attaquer le boss
        this.bossSprite.setInteractive();
        if (this.boss.currentHp > 0) {
            this.bossSprite.on('pointerdown', () => {
                this.attackBoss();
            });
        }

    }

    createBossAnimations() {
        const bossFrames = Array.from({length: 10}, (_, i) => ({
            key: `Boss${this.boss.id}_idle_${i}`,
        }));

        this.anims.create({
            key: `Boss${this.boss.id}_idle`,
            frames: bossFrames,
            frameRate: 20,
            repeat: -1,
        });

        const hurtFrames = Array.from({length: 10}, (_, i) => ({
            key: `Boss${this.boss.id}_hurt_${i}`,
        }));

        this.anims.create({
            key: `Boss${this.boss.id}_hurt`,
            frames: hurtFrames,
            frameRate: 20,
            repeat: 0,
        });

        const deadFrames = Array.from({length: 10}, (_, i) => ({
            key: `Boss${this.boss.id}_dead_${i}`,
        }));

        this.anims.create({
            key: `Boss${this.boss.id}_dead`,
            frames: deadFrames,
            frameRate: 20,
            repeat: 0,
        });
    }

    createBossHealthBar(maxHp, width, height, x, y) {
        if (this.bossHealthBarBackground) {
            this.bossHealthBarBackground.destroy();
        }
        if (this.bossHealthBar) {
            this.bossHealthBar.destroy();
        }

        this.bossHealthBarBackground = this.add.graphics();
        this.bossHealthBarBackground.fillStyle(0xff0000, 1);
        this.bossHealthBarBackground.fillRect(x, y, width, height);

        this.bossHealthBar = this.add.graphics();
        this.bossHealthBar.fillStyle(0x00ff00, 1);
        this.bossHealthBar.fillRect(x, y, width, height);

        this.updateBossHealthBar = () => {
            const healthPercentage = this.boss.currentHp / maxHp;
            const adjustedWidth = Math.max(width * healthPercentage, 0);

            this.bossHealthBar.clear();
            this.bossHealthBar.fillStyle(0x00ff00, 1);
            this.bossHealthBar.fillRect(x, y, adjustedWidth, height);
        };

        this.updateBossHealthBar();
    }


    attackBoss() {
        if (this.boss.currentHp <= 0) {
            return;
        }
        const damage = this.character.attackEnemy(this.boss);
        this.boss.currentHp -= damage;

        this.bossSprite.setTint(0xff0000);

        // Supprime la teinte après 0.1 seconde
        this.time.delayedCall(100, () => {
            this.bossSprite.clearTint();
        });

        this.updateBossHealthBar();
        this.showDamageText(this.bossSprite.x, this.bossSprite.y - 100, damage, this.character);

        if (this.boss.currentHp <= 0) {
            this.bossSprite.play(`Boss${this.boss.id}_dead`).once('animationcomplete', () => {
                this.giveExpToCharacter();
                this.generateLoot();
                this.spawnNewBoss();
            });
        }
    }

    generateLoot() {
        const loot = generateRandomLoot(this.character.level);
        const coin = loot[0];
        const iteam = loot[1];
        console.log(this.character);
        if ( this.character.skin.includes('Knight')) {
            console.log('Knight');
        }
        if ( this.character.skin.includes('Elf')) {
            console.log('Rogue');
        }

    }

    giveExpToCharacter() {
        const exp = this.boss.expDrop;
        this.character.gainExp(exp);
        this.createLvLindicator(this.characterSprite.x, this.characterSprite.y - 150, this.character.level, 'character');
    }

    setUpLevel(){
        const levelDifference = Phaser.Math.Between(0, 2);
        console.log('levelDifference:', levelDifference);
        const nmbLevels = this.character.level + levelDifference;
        console.log('nmbLevels:', nmbLevels);
        this.boss.setLevel(nmbLevels);
        this.boss.calculateExpDrop(this.boss.level)
        console.log('this.boss.level:', this.boss);
    }


    createLvLindicator(x, y, level, whoIsCalling) {
        let levelIndicatorKey;

        if (whoIsCalling === 'character') {
            levelIndicatorKey = 'levelIndicatorChar';
        } else if (whoIsCalling === 'boss') {
            levelIndicatorKey = 'levelIndicatorBoss';
        } else {
            console.error(`Invalid whoIsCalling: ${whoIsCalling}`);
            return;
        }

        if (this[levelIndicatorKey]) {
            this[levelIndicatorKey].destroy();
        }

        this[levelIndicatorKey] = this.add.text(x, y, `Level: ${level}`, {
            fontSize: '24px',
            fill: '#fff',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);

        // Ajoute une animation à l'indicateur de niveau
        this.tweens.add({
            targets: this[levelIndicatorKey],
            y: y - 20,
            duration: 1000,
            ease: 'Power1',
            yoyo: true,
            repeat: -1,
        });
    }


}

export default BossStageScene;
