import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
    fire?: Phaser.Input.Keyboard.Key;
    left?: Phaser.Input.Keyboard.Key;
    right?: Phaser.Input.Keyboard.Key;
    forward?: Phaser.Input.Keyboard.Key;

    starfield?: Phaser.GameObjects.TileSprite;
    spinner?: Phaser.GameObjects.Shape;

    rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

    constructor() {
        super("play");
    }

    preload() {
        this.load.image("starfield", starfieldUrl);
    }

    #addKey(name: keyof typeof Phaser.Input.Keyboard.KeyCodes): Phaser.Input.Keyboard.Key {
        return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
    }

    create() {
        this.creationOfKeys();
        this.starfield = this.add
            .tileSprite(
                0,
                0,
                this.game.config.width as number,
                this.game.config.height as number,
                "starfield",
            )
            .setOrigin(0, 0);

        this.spinner = this.add.rectangle(100, 100, 50, 50, 0xc81b71);
    }
    creationOfKeys() {
        this.fire = this.#addKey("F");
        this.left = this.#addKey("LEFT");
        this.right = this.#addKey("RIGHT");
        this.forward = this.#addKey("UP");
    }

    update(_timeMs: number, delta: number) {
        this.receiveInput(delta);
    }
    receiveInput(delta: number) {
        this.starfield!.tilePositionX -= 4;
        if (this.left!.isDown) {
            this.spinner!.rotation -= delta * this.rotationSpeed;
        }
        if (this.right!.isDown) {
            this.spinner!.rotation += delta * this.rotationSpeed;
        }
        if (this.fire!.isDown) {
            this.tweens.add({
                targets: this.spinner,
                scale: { from: 1.5, to: 1 },
                duration: 300,
                ease: Phaser.Math.Easing.Sine.Out,
            });
        }
        if (this.forward!.isDown) {
            // Isn't there some way to bundle and reassign two properties at once?
            this.spinner!.x += Math.cos(this.spinner!.rotation) * 6;
            this.spinner!.y += Math.sin(this.spinner!.rotation) * 6;
        }
    }
}
