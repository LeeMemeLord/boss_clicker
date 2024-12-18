import Phaser from 'phaser';
import elec2 from '../../assets/elc2.png';
import Knight from "../../characters/classes/Knight";
import Rogue from "../../characters/classes/Rogue";
import Boss from "../../characters/bosses/Boss";
import {generateRandomLoot} from "../../characters/loot/loot";

class BossStageScene extends Phaser.Scene {
    constructor() {
        super({key: 'BossStageScene'});
        this.boss = null;
    }

    init(data) {
        this.scene.stop('CharacterMenuScene');
        this.scene.stop('MainMenu');
        this.character = null;
        this.skin = null;
        this.number = null;
        if (data.character) {
            console.log('Données du personnage reçues:', data.character);
            if (data.character.skin.includes('Knight')) {
                this.character = new Knight();
            } else if (data.character.skin.includes('Elf')) {
                this.character = new Rogue();
            }
            let dataPerso = null;
            try {
                const storedData = sessionStorage.getItem(data.character.name);
                if (storedData) {
                    dataPerso = JSON.parse(storedData);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données du sessionStorage:', error);
            }
            if (dataPerso && data.character.name === dataPerso.name) {
                Object.assign(this.character, dataPerso);
            }
            console.log('Données récupérées depuis sessionStorage:', dataPerso);
            console.log('État final du personnage:', this.character);
            this.number = this.character.skin.match(/\d+/)?.[0] || null;
            this.skin = this.character.skin.replace(`_${this.number}`, '');
            this.character.attackBoost = null;
            this.character.attackBoostActive = false;
            this.character.expBoost = null;
            this.character.expBoostActive = false;
        }
    }

    preload() {
        this.load.image('background3', require('../../assets/forest.png'));
        this.load.image('particle', elec2);

        for (let i = 1 ; i <11; i++ ){
            this.load.image(`s${i}`, require(`../../assets/swords/s/s${i}.png`));
            this.load.image(`b${i}`, require(`../../assets/bows/b/b${i}.png`));
        }

        for (let i = 1; i <= 30; i++) {
            if (i === 6 || i === 16 || i === 26) {
                continue;
            }
            this.load.image(`gold${i}`, require(`../../assets/coins/PNG/Gold/Gold_${i}.png`));
        }
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
                this.load.image(
                    `Boss${bossId}_attack_${i}`,
                    require(`../../assets/sprite_Boss/_PNG/${bossId}_TROLL/Troll_0${bossId}_1_ATTACK_00${i}.png`)
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
        this.addOrReplacePlaceholder(width, height);
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
        this.createExpBar();
        if (this.character) {
            this.initializeInteraction(counter, particles, lineEmitter);
            this.checkGameOver(counter, particles, lineEmitter);
        }
        this.spawnNewBoss(this.character);
        this.addCoin();
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
        this.tweens.add({
            targets: title,
            y: 70,
            duration: 1000,
            ease: 'Bounce.easeOut',
            yoyo: true,
            repeat: -1,
        });
        let colorToggle = false;
        this.time.addEvent({
            delay: 500,
            callback: () => {
                title.setFill(colorToggle ? '#ffcc00' : '#ffffff');
                colorToggle = !colorToggle;
            },
            loop: true,
        });
        this.tweens.add({
            targets: title,
            scale: 1.2,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
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

    addOrReplacePlaceholder(width, height) {
        const placeholderWidth = 100;
        const placeholderHeight = 100;
        const margin = 10;
        const rarityColors = {
            common: 0xaaaaaa,
            rare: 0x0000ff,
            epic: 0x800080,
            legendary: 0xffd700,
        };
        let rarityColor = 0xff0000;
        if (this.character && this.character.weapon && this.character.weapon.rarity) {
            const rarity = this.character.weapon.rarity.toLowerCase();
            rarityColor = rarityColors[rarity] || rarityColor;
        }
        if (this.placeholder) {
            this.placeholder.destroy();
        }
        if (this.placeholderImage) {
            this.placeholderImage.destroy();
        }
        this.placeholder = this.add.graphics();
        this.placeholder.fillStyle(rarityColor, 1);
        this.placeholder.fillRect(
            margin,
            height - placeholderHeight - margin - 50,
            placeholderWidth,
            placeholderHeight
        );
        const weapomName = this.character.weapon ? this.character.weapon.name : null;
        this.placeholderImage = this.add.image(
            margin + placeholderWidth / 2,
            height - placeholderHeight / 2 - margin - 50,
            weapomName
        ).setDisplaySize(placeholderWidth * 0.8, placeholderHeight * 0.8).setOrigin(0.5);
    }

    addCoin() {
        this.anims.create({
            key: 'goldSpin',
            frames: Array.from({length: 30}, (_, i) => i + 1)
                .filter(frame => ![6, 16, 26].includes(frame))
                .map(frame => ({
                    key: `gold${frame}`
                })),
            frameRate: 15,
            repeat: -1
        });
        const {width, height} = this.sys.game.config;
        const goldSprite = this.add.sprite(25, 150, 'gold1');
        goldSprite.setScale(0.1);
        goldSprite.play('goldSpin');
        const coinText = this.add.text(
            goldSprite.x + 30,
            goldSprite.y,
            `${this.character.coins}`,
            {
                fontSize: '20px',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 2
            }
        ).setOrigin(0, 0.5);
        this.updateCoinText = () => {
            coinText.setText(`${this.character.coins}`);
            sessionStorage.setItem(this.character.name, JSON.stringify(this.character));
        };
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
        this.healthBarBackground = this.add.graphics();
        this.healthBarBackground.fillStyle(0xff0000, 1);
        this.healthBarBackground.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        this.healthBar = this.add.graphics();
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        this.updateHealthBar = () => {
            const healthPercentage = Math.min(Math.max(this.character.currentHp / maxHealth, 0), 1);
            this.healthBar.clear();
            this.healthBar.fillStyle(0x00ff00, 1);
            this.healthBar.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight);
        };
    }

    createExpBar() {
        const expBarWidth = 200;
        const expBarHeight = 10;
        const expBarX = this.characterSprite.x - expBarWidth / 2;
        const expBarY = this.characterSprite.y + 70;
        this.expBarBackground = this.add.graphics();
        this.expBarBackground.fillStyle(0x444444, 1);
        this.expBarBackground.fillRect(expBarX, expBarY, expBarWidth, expBarHeight);
        this.expBar = this.add.graphics();
        this.expBar.fillStyle(0x0000ff, 1);
        this.expBar.fillRect(expBarX, expBarY, expBarWidth * this.character.exp / this.character.getExpToLevelUp(), expBarHeight);
        this.updateExpBar = () => {
            const expPercentage = Math.min(this.character.exp / this.character.getExpToLevelUp(), 1);
            this.expBar.clear();
            this.expBar.fillStyle(0x0000ff, 1);
            this.expBar.fillRect(expBarX, expBarY, expBarWidth * expPercentage, expBarHeight);
        };
    }

    showDamageText(x, y, damage, whoIsAttacking) {
        let dps;

        if (whoIsAttacking === this.character) {
            const weaponDamage = this.character.weapon ? this.character.weapon.damage : 0;
            dps = this.character.stats.atk + weaponDamage;
        } else if (whoIsAttacking === this.boss) {
            dps = this.boss.stats.atk || 0;
        } else {
            console.error("Attaquant inconnu. Impossible de calculer le DPS.");
            dps = 0;
        }
        const roundedDamage = Math.round(damage);

        const isCritical = roundedDamage > dps;
        const textColor = isCritical ? '#ffcc00' : '#ff0000';
        const fontSize = isCritical ? '52px' : '42px';
        const text = isCritical ? `CRIT! -${roundedDamage}` : `-${roundedDamage}`;

        if (!this.add) {
            console.error("Le contexte de la scène est invalide. Impossible d'ajouter du texte.");
            return;
        }

        console.log(text);

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


    showHealText(x, y, heal) {
        const textColor = '#00ff00';
        const fontSize = '42px';
        const text = `+${heal}`;
        if (!this.add) {
            console.error("Le contexte de la scène est invalide. Impossible d'ajouter du texte.");
            return;
        }
        const healText = this.add.text(x, y, text, {
            fontSize: fontSize,
            fill: textColor,
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);
        const animationDuration = 1000;
        const targetY = y - 50;
        this.tweens.add({
            targets: healText,
            y: targetY,
            alpha: 0,
            duration: animationDuration,
            ease: 'Power1',
            onComplete: () => healText.destroy(),
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
        if (counter === 0) {
            this.playAttackAnimation();
        }
        this.createParticleEffect(pointer, lineEmitter, particles);
    }

    playAttackAnimation() {
        if (this.character.currentHp <= 0) {
            return;
        }
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
                particles.setVisible(false);
                lineEmitter.stop();
                counter++;
                this.handleCharacterDeath();
            }
        });
    }

    handleCharacterDeath() {
        this.characterSprite.play(`${this.skin}${this.number}_dead`).once('animationcomplete', () => {
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
                clearInterval(this.autoAttackInterval);
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

    spawnNewBoss(target) {
        if (this.bossSprite) {
            clearInterval(this.autoAttackInterval);
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
        this.createBossHealthBar(this.boss.stats.hp, 400, 30, this.bossSprite.x - 200, this.bossSprite.y - 150);
        this.bossSprite.setInteractive();
        if (this.boss.currentHp > 0 && target.currentHp > 0) {
            this.bossSprite.on('pointerdown', () => {
                this.attackBoss();
            });
        }
        if (target && target.isAlive()) {
            this.chargeAttack(target);
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
        this.attackFrames = Array.from({length: 10}, (_, i) => ({
            key: `Boss${this.boss.id}_attack_${i}`,
        }));
        this.anims.create({
            key: `Boss${this.boss.id}_attack`,
            frames: this.attackFrames,
            frameRate: 20,
            repeat: 0,
        })
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

    chargeAttack(target) {
        const interval = 10000 / this.boss.speed;
        this.autoAttackInterval = setInterval(() => {
            if (!this.bossSprite || !this.bossSprite.scene || !target || !target.isAlive()) {
                clearInterval(this.autoAttackInterval);
                this.autoAttackInterval = null;
                console.log("Attaque automatique arrêtée : scène ou sprites invalides.");
                return;
            }
            if (target.isAlive()) {
                this.bossSprite.play(`Boss${this.boss.id}_attack`).once('animationcomplete', () => {
                    if (this.bossSprite) {
                        this.bossSprite.play(`Boss${this.boss.id}_idle`);
                    }
                });
                const dps = this.boss.attackEnemy(target);
                this.updateHealthBar();
                this.showDamageText(this.characterSprite.x, this.characterSprite.y - 100, dps, this.boss);
                if (target.currentHp <= 0) {
                    this.handleCharacterDeath();
                }
            } else {
                clearInterval(this.autoAttackInterval);
                this.autoAttackInterval = null;
                console.log("Attaque automatique arrêtée. Soit le boss, soit la cible est mort.");
            }
        }, interval);
    }

    attackBoss() {
        if (this.boss.currentHp <= 0) {
            return;
        }
        if (this.character.currentHp <= 0) {
            return;
        }
        const currentHp = this.character.currentHp;
        const damage = this.character.attackEnemy(this.boss);
        this.boss.currentHp -= damage;
        this.bossSprite.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            this.bossSprite.clearTint();
        });
        this.updateBossHealthBar();
        this.showDamageText(this.bossSprite.x, this.bossSprite.y - 100, damage, this.character);
        if (currentHp < this.character.currentHp) {
            this.showHealText(this.characterSprite.x, this.characterSprite.y - 100, this.character.currentHp - currentHp);
            this.updateHealthBar()
        }
        if (this.boss.currentHp <= 0) {
            this.bossSprite.play(`Boss${this.boss.id}_dead`).once('animationcomplete', () => {
                this.giveExpToCharacter();
                this.generateLoot();
                this.spawnNewBoss(this.character);
            });
        }
    }

    generateLoot() {
        const loot = generateRandomLoot(this.character.level);
        console.log('Loot généré:', loot);
        const coin = loot[0]?.value || 0;
        if (coin > 0) {
            this.character.gainGold(coin);
            console.log(`Coins gagnés: ${coin}`);
            this.updateCoinText();
        }
        const item = loot[1];
        if (item) {
            if (item.name === "Coin") {
                this.character.gainGold(item.value);
                console.log(`Coins additionnels gagnés: ${item.value}`);
                this.updateCoinText();
            } else if (item.type === "sword" && this.character.skin.includes("Knight")) {
                if (this.character.weapon.damage < item.damage) {
                    this.character.changeWeapon(item);
                    console.log('Nouvelle épée équipée:', item);
                    this.addOrReplacePlaceholder(this.scale.width, this.scale.height);
                }
            } else if (this.character.skin.includes("Elf") && item.type === "bow") {
                if (this.character.weapon.damage < item.damage) {
                    this.character.changeWeapon(item);
                    console.log('Nouvel arc équipé:', item);
                    this.addOrReplacePlaceholder(this.scale.width, this.scale.height);
                }
            }
            else if(item.name === "Boost"){
                if(item.effect === "experience"){
                    this.character.expBoost = item
                    this.addExpBoost(item);
                }
                else if (item.effect === "attack"){
                    console.log('Boost d\'attaque:', item);
                    this.addAttackBoost(item);
                }
            }
            else {
                console.log('Loot non applicable pour ce personnage:', item);
            }
        } else {
            console.log('Aucun item supplémentaire dans le loot.');
        }
    }

    giveExpToCharacter() {
        const currentLevel = this.character.level;
        const exp = this.boss.expDrop
        this.character.gainExp(exp, 'character');
        this.updateExpBar();
        if (currentLevel < this.character.level) {
            this.updateBossHealthBar();
        }
        this.createLvLindicator(this.characterSprite.x, this.characterSprite.y - 150, this.character.level, 'character');
    }

    setUpLevel() {
        const levelDifference = Phaser.Math.Between(0, 2);
        console.log('levelDifference:', levelDifference);
        const nmbLevels = this.character.level + levelDifference;
        console.log('nmbLevels:', nmbLevels);
        this.boss.setLevel(nmbLevels, 'boss');
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
        this.tweens.add({
            targets: this[levelIndicatorKey],
            y: y - 20,
            duration: 1000,
            ease: 'Power1',
            yoyo: true,
            repeat: -1,
        });
    }

    addAttackBoost(item) {
        if (this.character.attackBoostActive) {
            console.log('Un boost d\'attaque est déjà actif.');
            return;
        }

        this.character.attackBoostActive = true;
        this.character.attackBoost = item;

        const attackBoost = this.character.weapon.damage * (item.effectValue / 100);
        console.log(`Boost d'attaque appliqué : +${attackBoost} (Effect: ${item.effectValue}%)`);
        this.character.weapon.damage += attackBoost;

        const textX = 220;
        const textY = 300;

        const {width, height} = this.sys.game.config;


        const timeRemainingText = this.add.text(width / 2, height - 120, `Boost atk: ${item.duration}s (+${item.effectValue}% dps gain)`, {
            fontSize: '24px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);

        let remainingTime = item.duration;
        const timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                remainingTime--;
                timeRemainingText.setText(`Boost atk: ${remainingTime}s (+${item.effectValue}% dps gain)`);

                if (remainingTime <= 0) {
                    timeRemainingText.destroy();
                }
            },
            repeat: item.duration - 1,
        });

        this.time.delayedCall(item.duration * 1000, () => {
            this.character.weapon.damage -= attackBoost;
            this.character.attackBoostActive = false;
            this.character.attackBoost = null;
            console.log(`Boost d'attaque terminé. L'attaque est revenue à : ${this.character.stats.atk}`);
        });
    }

    addExpBoost(item) {
        console.log(item + " Exp Boost appliqué");

        if (this.character.expBoostActive) {
            console.log('Un boost d\'expérience est déjà actif.');
            return;
        }

        this.character.expBoostActive = true;
        this.character.expBoost = item;

        const expBoost = this.character.exp * (item.effectValue / 100);
        console.log(`Boost d'expérience appliqué : +${expBoost} (Effect: ${item.effectValue}%)`);

        const {width, height} = this.sys.game.config;

        const textX = 220;
        const textY = 330;

        const expBoostText = this.add.text(width/ 2, height - 100 , `Boost exp: ${item.duration}s (+${item.effectValue}% exp gain)`, {
            fontSize: '24px',
            fill: '#00FF00',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);

        let remainingTime = item.duration;
        const timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                remainingTime--;
                expBoostText.setText(`Boost exp: ${remainingTime}s (+${item.effectValue}% exp gain)`);

                if (remainingTime <= 0) {
                    expBoostText.destroy();
                }
            },
            repeat: item.duration - 1,
        });

        this.time.delayedCall(item.duration * 1000, () => {
            this.character.expBoostActive = false;
            this.character.expBoost = null;
            console.log('Boost d\'expérience terminé.');
        });
    }




}

export default BossStageScene;
