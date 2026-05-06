import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import PlayScene from './scenes/PlayScene';

const config = {
    type: Phaser.AUTO,
    pixelArt: true, 
    scale: {
        // Volvemos a RESIZE para que la pantalla mande
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Preloader, PlayScene] 
};

export default config;