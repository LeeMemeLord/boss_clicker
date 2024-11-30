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
            initialScene = 'BossStageScene'; // Si sessionStorage contient des données
        } else if (Object.keys(localStorage).length === 0) {
            initialScene = 'CharacterMenuScene'; // Si localStorage est vide
        }

        console.log(`Scène initiale : ${initialScene}`);
        console.log('Données du personnage :', characterData);

        // Configuration de Phaser
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

        // Démarrer la scène initiale
        if (characterData) {
            game.scene.start('BossStageScene', { character: characterData });
        } else {
            game.scene.start(initialScene);
        }

        // Gérer la redimension de la fenêtre
        const handleResize = () => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Nettoyage lors de la destruction du composant
        return () => {
            window.removeEventListener('resize', handleResize);
            game.destroy(true);
        };
    }, []);

    return <div id="phaser-container" />;
};

export default MainGame;
