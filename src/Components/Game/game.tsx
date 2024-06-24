import * as Phaser from 'phaser';
import { createLizardAnims } from './anims/EnemyAnims';
import { createCharacterAnims } from './anims/CharacterAnims';
import Lizard from './enemies/Lizard';
import './characters/Faune';
import Faune from './characters/Faune';
import { sceneEvents } from './events/EventsCenter';
import { createChestAnims } from './anims/TreasureAnims';
import Chest from './items/Chest';

export default class Game extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private faune!: Faune;
    private knives!: Phaser.Physics.Arcade.Group;
    private lizards!: Phaser.Physics.Arcade.Group;
    private playerLizardsCollider?: Phaser.Physics.Arcade.Collider;
    private lizardsKilled = 0; // Track the number of lizards killed

    constructor() {
        super('game');
    }

    setMovementCallback(callback: (movement: string) => void) {
    }
    

    handleMovementCommand(command: string) {
        console.log('Movement command received:', command);

        if (this.faune) {
            this.faune.handleMovementCommand(command);
        }
    }

    preload() {
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
    }

    create() {
        this.scene.run('game-ui');
        const map = this.make.tilemap({ key: 'dungeon' });
        const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2);

        map.createLayer('Ground', tileset as Phaser.Tilemaps.Tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;

        const wallsLayer = map.createLayer('Walls', tileset as Phaser.Tilemaps.Tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
        wallsLayer.setCollisionByProperty({ collides: true });
        createChestAnims(this.anims);
        createLizardAnims(this.anims);
        createCharacterAnims(this.anims);

        this.knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 3
        });

        this.faune = this.add.faune(128, 128, 'faune');
        this.faune.setKnives(this.knives);

        const chests = this.physics.add.staticGroup({
            classType: Chest
        });
        const chestsLayer = map.getObjectLayer('Chests');
        if (chestsLayer) {
            chestsLayer.objects.forEach(chestObj => {
                chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, 'treasure');
            });
        }

        this.cameras.main.startFollow(this.faune, true);

        this.lizards = this.physics.add.group({
            classType: Lizard,
            createCallback: (go) => {
                const lizGo = go as Lizard;
                if (lizGo.body) {
                    lizGo.body.onCollide = true;
                }
            }
        });
        this.lizards.get(256, 128, 'lizard');
        this.physics.add.collider(this.faune, wallsLayer);

        this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this);
        this.physics.add.collider(this.knives, this.lizards, this.handleKnifeLizardCollision, undefined, this);

        this.physics.add.collider(this.lizards, wallsLayer);
        this.playerLizardsCollider = this.physics.add.collider(this.lizards, this.faune, this.handlePlayerLizardCollision, undefined, this);
        this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this);

        const lizardsLayer = map.getObjectLayer('Lizards');
        if (lizardsLayer) {
            lizardsLayer.objects.forEach(lizObj => {
                this.lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard');
            });
        }

        this.events.emit('create'); // Emit create event after the scene is created
    }

    private handlePlayerLizardCollision(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
        const lizard = obj2 as Lizard;

        const dx = this.faune.x - lizard.x;
        const dy = this.faune.y - lizard.y;

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
        this.faune.handleDamage(dir);
        sceneEvents.emit('player-health-changed', this.faune.health);

        if (this.faune.health <= 0) {
            this.playerLizardsCollider?.destroy();
            this.time.delayedCall(2000, () => {
                this.scene.start('game');
            });
        }
    }

    private handlePlayerChestCollision(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
        const chest = obj2 as Chest;
        this.faune.setChest(chest);
    }

    private handleKnifeWallCollision(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
        const knife = obj1 as Phaser.GameObjects.GameObject;
        this.knives.killAndHide(knife);
    }

    private handleKnifeLizardCollision(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
        const knife = obj1 as Phaser.GameObjects.GameObject;
        const lizard = obj2 as Lizard;
        this.knives.killAndHide(knife);
        this.lizards.killAndHide(lizard);

        this.lizardsKilled += 1; // Increment lizards killed count
        if (this.lizardsKilled >= 2) {
            sceneEvents.emit('two-lizards-killed');
        }
    }

    update() {
        if (this.faune) {
            this.faune.update(this.cursors);
        }
    }
}
