import React, { useEffect } from 'react';
import Phaser from 'phaser';
import CharacterMenuScene from '../Scenes/MenuScenes/CharacterMenu';
import MainMenu from '../Scenes/MenuScenes/MainMenu';
import BossStageScene from '../Scenes/GameScene/BossStageScene';

const MainGame = () => {
    useEffect(() => {
        let initialScene = 'MainMenu';
        let characterData = null;

        if (Object.keys(sessionStorage).length > 0) {
            const firstKey = Object.keys(sessionStorage)[0];
            characterData = JSON.parse(sessionStorage.getItem(firstKey));
            initialScene = 'BossStageScene';
        } else if (Object.keys(localStorage).length === 0) {
            initialScene = 'CharacterMenuScene';
        }

        console.log(`Scène initiale : ${initialScene}`);
        console.log('Données du personnage :', characterData);

        const config = {
            type: Phaser.WEBGL,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'phaser-container',
            backgroundColor: '#2d2d2d',
            scene: [MainMenu, CharacterMenuScene, BossStageScene],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
        };

        const game = new Phaser.Game(config);


        if (characterData) {
            const updatedCharacter = JSON.parse(sessionStorage.getItem(characterData.name));
            game.scene.stop('MainMenu');
            game.scene.stop('CharacterMenuScene');
            game.scene.start('BossStageScene', { character: updatedCharacter });
        }
        else {
            game.scene.start(initialScene);
        }

        const handleResize = () => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            game.destroy(true);
        };
    }, []);

    return <div id="phaser-container" />;
};

export default MainGame;
