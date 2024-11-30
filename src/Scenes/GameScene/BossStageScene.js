import Phaser from 'phaser';

class BossStageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BossStageScene' });
  }

  init(data) {
    this.character = data.character || null; // Données du personnage transmises
  }

  create() {
    const { width, height } = this.sys.game.config;

    // Fond d'écran (par défaut ou personnalisé)
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a1a);

    // Titre de la scène
    this.add.text(width / 2, 20, 'Boss Stage', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    // Affichage des informations du personnage
    if (this.character) {
      this.add.text(50, 80, `Nom : ${this.character.name}`, { fontSize: '20px', fill: '#fff' });
      this.add.text(50, 120, `Niveau : ${this.character.level}`, { fontSize: '20px', fill: '#fff' });
      this.add.text(50, 160, `Classe : ${this.character.skin}`, { fontSize: '20px', fill: '#fff' });
    } else {
      this.add.text(50, 100, 'Aucun personnage sélectionné.', { fontSize: '20px', fill: '#ff0000' });
    }
  }
}

export default BossStageScene;
