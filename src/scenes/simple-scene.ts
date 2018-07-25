import '../global_vars'
import {
    BLOCK_X_COUNT,
    BLOCK_Y_COUNT,
    FALL_TIME_INTERVAL,
    GAME_STATE_READY,
    GAME_STATE_GAMEOVER,
    BC_RAINBOW,
    GAME_STATE_CLEAN_PLAYGROUND,
    GAME_STATE_PLAYING
} from '../global_vars'
import {
    Brick
} from '../tetris_compoment/tetris_brick'

class SimpleScene extends Phaser.Scene {
    player: Phaser.GameObjects.Sprite
    cursors: any
    tetris_layer: Phaser.Tilemaps.DynamicTilemapLayer
    tetris_map: Phaser.Tilemaps.Tilemap

    tetris_brick: Brick

    tetris_blocks: number[][]

    last_roll_timestamp: number
    last_fall_timestamp: number
    last_move_timestamp: number

    brick_fall_speed_level: number

    game_state: number

    constructor() {
        super({
            key: 'SimpleScene'
        })
    }

    preload() {
        this.load.tilemapTiledJSON('map', '/assets/tetris_tilemap/tetris_map.json')
        this.load.image('tetris_blocks', '/assets/tetris_tilemap/tetris_blocks.jpg')
        this.load.image('player', '/assets/sprites/mushroom.png')
    }

    create() {
        this.tetris_map = this.make.tilemap({
            key: 'map',
        })
        let tileset: Phaser.Tilemaps.Tileset = this.tetris_map.addTilesetImage('tetris_blocks')
        this.tetris_layer = this.tetris_map.createDynamicLayer(0, tileset, 0, 0)

        /// IATS-TEST
        /// IATS-END
        this.cursors = this.input.keyboard.createCursorKeys()
        //this.cameras.main.setBounds(0, 0, this.tetris_map.widthInPixels, this.tetris_map.heightInPixels)
        //this.sys.game.events.on('resize', this.resize, this)
        //this.resize()

        this.tetris_blocks = new Array(BLOCK_X_COUNT)
        for (let i = 0; i < BLOCK_X_COUNT; ++i) {
            this.tetris_blocks[i] = new Array(BLOCK_Y_COUNT)
            for (let j = 0; j < BLOCK_Y_COUNT; ++j) {
                this.tetris_blocks[i][j] = 0
            }
        }

        //this.tetris_brick = new Brick(this.tetris_map, BLOCK_X_COUNT / 2, -2)
        this.tetris_brick = new Brick(this.tetris_map, this.tetris_blocks, BLOCK_X_COUNT / 2, -2)

        this.last_fall_timestamp = 0
        this.last_move_timestamp = 0
        this.last_roll_timestamp = 0

        this.brick_fall_speed_level = 0

        this.game_state = GAME_STATE_PLAYING
        //this.resize()
    }

    update(time: number, delta: number) {
        if (this.game_state == GAME_STATE_GAMEOVER) {
            this.game_over(time);
        }

        if(this.game_state == GAME_STATE_READY) {
            this.game_ready(time);
        }

        if (this.game_state == GAME_STATE_PLAYING) {
            this.game_playing(time)
        }
    }
    
    game_ready(time: number) {
    }

    game_playing(time: number) {
        // roll the brick
        if (this.cursors.up.isDown) {
            if (time - this.last_roll_timestamp > 100) {
                this.tetris_brick.roll()
                this.last_roll_timestamp = time
            }
            this.cursors.up.isDown = false
        }

        // move brick left & right
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
            let x_offset = this.cursors.left.isDown ? -1 : 0
            x_offset += this.cursors.right.isDown ? 1 : 0

            if (time - this.last_move_timestamp > 55) {
                this.tetris_brick.move_to(this.tetris_brick.x + x_offset, this.tetris_brick.y)
                this.last_move_timestamp = time
            }
            this.cursors.left.isDown = this.cursors.right.isDown = false
        }

        // speed up the brick fall
        let cur_loop_fall_speed_level = this.brick_fall_speed_level
        if (this.cursors.down.isDown) {
            cur_loop_fall_speed_level = FALL_TIME_INTERVAL.length - 1
            this.cursors.down.isDown = false
        }

        // fall eternity...
        if (time - this.last_fall_timestamp > FALL_TIME_INTERVAL[cur_loop_fall_speed_level]) {
            let not_collide = this.tetris_brick.move_to(this.tetris_brick.x, this.tetris_brick.y + 1)
            // which mean time to glue the brick
            if (not_collide == false) {
                // glue the brick & move the brick to top of the playground & random shift the brick 
                not_collide = this.tetris_brick.move_to(BLOCK_X_COUNT / 2, -1, true, true)
                // which means we meet the [GAMEOVER]
                if (not_collide == false) {
                    this.game_state = GAME_STATE_GAMEOVER
                }
            }
            this.last_fall_timestamp = time
        }

    }

    game_over(time: number) {
        let y = BLOCK_Y_COUNT - 1
        let y_offset = -1
        this.game_state = GAME_STATE_CLEAN_PLAYGROUND

        this.time.addEvent({
            loop: true,
            callback: function () {
                if (y == -1) {
                    y_offset = 1
                }
                if (y == BLOCK_Y_COUNT) {
                    // IATS-TODO
                    this.time.removeAllEvents()
                    this.game_state = GAME_STATE_READY
                }
                for (let x = 0; x < BLOCK_X_COUNT; ++x) {
                    if (y_offset == -1) {
                        if (this.tetris_blocks[x][y] == 0) {
                            this.tetris_map.putTileAt(BC_RAINBOW, x, y)
                        }
                    } else {
                        this.tetris_map.removeTileAt(x, y)
                    }
                }
                y += y_offset
            },
            callbackScope: this,
            delay: 55 
        })
    }

    resize() {
        let cam = this.cameras.main
        console.log('cam.zoom : ' + cam.zoom)
        console.log('map_width:' + this.tetris_map.widthInPixels + ' map_height:' + this.tetris_map.heightInPixels)
        console.log('map_w:' + this.tetris_map.width + ' map_h:' + this.tetris_map.height)
        console.log('window w:' + window.innerWidth + ' h:' + window.innerHeight)

        console.log('layer w:' + this.tetris_layer.width + ' h:' + this.tetris_layer.height)
        console.log('layer display w:' + this.tetris_layer.displayHeight + ' h:' + this.tetris_layer.displayHeight)
    }
}

export default SimpleScene