import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Llama al constructor de Phaser.Sprite ('ovni' es la textura)
        super(scene, x, y, 'ovni');

        // Añadir este objeto a la escena y a las físicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configuración visual y físicas
        this.setScale(3);
        const radioOvni = this.width * 0.35;
        this.setCircle(radioOvni, (this.width / 2) - radioOvni, (this.height / 2) - radioOvni);

        this.isDead = false;

        // Sistema de partículas (Propulsor)
        this.rastro = scene.add.particles(0, 0, 'particula', {
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Ellipse(0, 0, 30, 12)
            },
            speedY: { min: 30, max: 70 },
            speedX: { min: -25, max: 25 },
            scale: { start: 2.5, end: 0 },
            alpha: { start: 0.35, end: 0 },
            lifespan: { min: 300, max: 500 },
            blendMode: 'ADD',
            tint: 0xFFEA00,
            frequency: 120
        }).setDepth(10);

        // El rastro sigue a esta misma clase (this)
        this.rastro.startFollow(this, 0, 33);
    }

    // Método que  se llamar;a desde el update() de PlayScene
    actualizarMovimiento() {
        if (this.isDead) return;

        // Movimiento con el ratón
        const pointer = this.scene.input.activePointer;

        // USAMOS worldX y worldY PARA IGNORAR EL ZOOM
        if (pointer.isDown || (pointer.worldX > 0 && pointer.worldY > 0)) {
            const distanciaX = pointer.worldX - this.x;
            const distanciaY = pointer.worldY - this.y;
            const distanciaTotal = Phaser.Math.Distance.Between(this.x, this.y, pointer.worldX, pointer.worldY);

            // Aumentamos un poquito el umbral muerto (de 5 a 10) para evitar que el ovni tiemble
            // Ajustamos el umbral a 8 para que frene un poco antes de "temblar"
            if (distanciaTotal < 8) {
                this.setVelocity(0, 0);
            } else {
                // Subimos el multiplicador de 10 a 25. 
                // Esto hará que la nave vuele hacia el cursor con mucha más fuerza, eliminando la inercia.
                this.setVelocity(distanciaX * 25, distanciaY * 25);
            }
        }

        // Dinámica del propulsor
        const nuevaFrecuencia = this.body.speed > 15 ? 15 : 120;
        if (this.rastro.frequency !== nuevaFrecuencia) {
            this.rastro.frequency = nuevaFrecuencia;
        }
    }

    // Método que ejecutará la cinemática de muerte
    morir(enemigo) {
        this.isDead = true;
        this.setTint(0xff0000);
        this.rastro.emitting = false; // Apaga el propulsor

        // Rebote
        const anguloImpacto = Phaser.Math.Angle.Between(enemigo.x, enemigo.y, this.x, this.y);
        const velocidadRebote = 800;

        this.setVelocity(
            Math.cos(anguloImpacto) * velocidadRebote,
            Math.sin(anguloImpacto) * velocidadRebote
        );
        this.setAngularVelocity(1000); // Gira rápidamente
    }
}