import * as Phaser from 'phaser'
import Chest from '../items/Chest';
import { sceneEvents } from '../events/EventsCenter'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            faune(x: number, y: number, texture: string, frame?: string | number): Faune
        }
    }
}
enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}
export default class Faune extends Phaser.Physics.Arcade.Sprite {
    private healthState = HealthState.IDLE
    private damageTime = 0

    private _health = 3
    private _coins = 0

    private knives?: Phaser.Physics.Arcade.Group
    private activeChest?: Chest
    private openedChests = 0;  // Track the number of opened chests

    private moveCounter = 0
    private moveDirection: Phaser.Math.Vector2 | null = null
    private targetDistance = 0

    private lastDirection: string | null = null

    private commandQueue: { direction: Phaser.Math.Vector2, distance: number, animation: string, scaleX: number }[] = []

    get health() {
        return this._health
    }
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.anims.play('faune-idle-down');
    }
    setKnives(knives: Phaser.Physics.Arcade.Group)
    {
        this.knives = knives
    }

    setChest(chest: Chest)
    {
        this.activeChest = chest
    }
    handleDamage(dir: Phaser.Math.Vector2) {
        if (this._health <= 0) {
            return
        }

        if (this.healthState === HealthState.DAMAGE) {
            return
        }

        --this._health

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD
            this.anims.play('faune-faint')
            this.setVelocity(0, 0)
        }
        else {
            this.setVelocity(dir.x, dir.y)
            this.setTint(0xff0000)
            this.healthState = HealthState.DAMAGE
            this.damageTime = 0
        }
    }
    private throwKnife() {
        console.log('Throwing knife');
        if (!this.knives) {
            return
        }

        const knife = this.knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image
        if (!knife) {
            console.log('No knife available');
            return
        }

        knife.setActive(true)
        knife.setVisible(true)
        knife.setPosition(this.x, this.y)

        const parts = this.anims.currentAnim?.key.split('-')
        if (!parts) {
            return;
        }
        const direction = parts[2]

        const vec = new Phaser.Math.Vector2(0, 0)

        switch (direction) {
            case 'up':
                vec.y = -1
                break
            case 'down':
                vec.y = 1
                break
            default:
            case 'side':
                if (this.scaleX < 0) {
                    vec.x = -1
                }
                else {
                    vec.x = 1
                }
                break
        }

        const angle = vec.angle()
        knife.setRotation(angle)
        knife.x += vec.x * 16
        knife.y += vec.y * 16
        knife.setVelocity(vec.x * 300, vec.y * 300)
    }
    openChest() {
        if (this.activeChest) {
            const coins = this.activeChest.open();
            this._coins += coins;
            this.openedChests += 1;
            // sceneEvents.emit('player-coins-changed', this._coins);
            console.log(`Chests opened: ${this.openedChests}`);
            if (this.openedChests >= 3) {
                // console.log('All chests opened!');
                sceneEvents.emit('all-chests-opened');
            }
        }
    }
    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)

        switch (this.healthState) {
            case HealthState.IDLE:
                break
            case HealthState.DAMAGE:
                this.damageTime += dt
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE
                    this.setTint(0xffffff)
                    this.damageTime = 0
                }
                break
        }

        if (this.moveDirection) {
            const speed = 100;
            const distance = (speed * dt) / 1000; // distance moved in pixels during this update

            this.moveCounter += distance;

            if (this.moveCounter >= this.targetDistance) {
                this.setVelocity(0, 0);
                this.moveDirection = null;
                this.moveCounter = 0;
                this.targetDistance = 0;

                if (this.commandQueue.length > 0) {
                    const nextCommand = this.commandQueue.shift()!;
                    this.moveDirection = nextCommand.direction;
                    this.targetDistance = nextCommand.distance;
                    this.anims.play(nextCommand.animation, true);
                    this.scaleX = nextCommand.scaleX;
                } else {
                    // Set the appropriate idle animation based on the last direction
                    switch (this.lastDirection) {
                        case 'L':
                            this.anims.play('faune-idle-side');
                            this.scaleX = -1;
                            break;
                        case 'R':
                            this.anims.play('faune-idle-side');
                            this.scaleX = 1;
                            break;
                        case 'U':
                            this.anims.play('faune-idle-up');
                            break;
                        case 'D':
                            this.anims.play('faune-idle-down');
                            break;
                    }
                }
            } else {
                this.setVelocity(this.moveDirection.x * speed, this.moveDirection.y * speed);
            }
        } else if (this.commandQueue.length > 0) {
            const nextCommand = this.commandQueue.shift()!;
            this.moveDirection = nextCommand.direction;
            this.targetDistance = nextCommand.distance;
            this.anims.play(nextCommand.animation, true);
            this.scaleX = nextCommand.scaleX;
        }
    }

    handleMovementCommand(command: string) {
        console.log(`Handling movement command: ${command}`);
        const speed = 100;
        const stepDistance = 32; // assuming 32 pixels per step
        this.setVelocity(0, 0);  // Ensure velocity is reset before applying new velocity

        if (command.includes('A')) {
            this.throwKnife();
            return;
        }

        if (command.includes('O')) {
            this.openChest();
            return;
        }

        let currentChar = command[0];
        let count = 0;

        for (let char of command) {
            if (char === currentChar) {
                count++;
            } else {
                this.queueMovement(currentChar, count, stepDistance);
                currentChar = char;
                count = 1;
            }
        }

        this.queueMovement(currentChar, count, stepDistance);

        if (!this.moveDirection && this.commandQueue.length > 0) {
            const nextCommand = this.commandQueue.shift()!;
            this.moveDirection = nextCommand.direction;
            this.targetDistance = nextCommand.distance;
            this.anims.play(nextCommand.animation, true);
            this.scaleX = nextCommand.scaleX;
        }
    }

    private queueMovement(direction: string, steps: number, stepDistance: number) {
        let moveDirection: Phaser.Math.Vector2;
        let animation: string;
        let scaleX = 1;

        switch (direction) {
            case 'L':
                moveDirection = new Phaser.Math.Vector2(-1, 0);
                animation = 'faune-run-side';
                scaleX = -1;
                if (this.body instanceof Phaser.Physics.Arcade.Body) {
                    this.body.offset.x = 24;
                }
                this.lastDirection = 'L';
                console.log('Queueing movement: left');
                break;
            case 'R':
                moveDirection = new Phaser.Math.Vector2(1, 0);
                animation = 'faune-run-side';
                scaleX = 1;
                if (this.body instanceof Phaser.Physics.Arcade.Body) {
                    this.body.offset.x = 8;
                }
                this.lastDirection = 'R';
                console.log('Queueing movement: right');
                break;
            case 'U':
                moveDirection = new Phaser.Math.Vector2(0, -1);
                animation = 'faune-run-up';
                this.lastDirection = 'U';
                console.log('Queueing movement: up');
                break;
            case 'D':
                moveDirection = new Phaser.Math.Vector2(0, 1);
                animation = 'faune-run-down';
                this.lastDirection = 'D';
                console.log('Queueing movement: down');
                break;
            default:
                return;
        }

        this.commandQueue.push({
            direction: moveDirection,
            distance: steps * stepDistance,
            animation: animation,
            scaleX: scaleX
        });
    }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    var sprite = new Faune(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    if (sprite.body) {
        sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);
    }

    return sprite
})
