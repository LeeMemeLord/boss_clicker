const fs = require('fs');
const path = require('path');

class TestCode {
    constructor(directoryPath) {
        this.directoryPath = directoryPath;
    }

    photoAleatoireDeRepertoire() {
        // Lire tous les fichiers du répertoire
        try {
            const files = fs.readdirSync(this.directoryPath);
            console.log("Liste des fichiers :", files);
            return files;
        } catch (err) {
            console.error("Erreur lors de la lecture du répertoire :", err);
            return [];
        }
    }
}

// Spécifiez le chemin vers le répertoire
const directoryPath = path.join(__dirname, '../../assets/swords/32 Free Weapon Icons/Icons');
const testCode = new TestCode(directoryPath);

// Affichez tous les fichiers
const files = testCode.photoAleatoireDeRepertoire();
console.log("Fichiers dans le répertoire :", files);
