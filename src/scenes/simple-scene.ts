import '../global_vars'
import {
    BLOCK_X_COUNT,
    BLOCK_Y_COUNT,
    FALL_TIME_INTERVAL,
    GAME_STATE_READY,
    GAME_STATE_GAMEOVER,
    BC_RAINBOW,
    GAME_STATE_CLEAN_PLAYGROUND,
    GAME_STATE_PLAYING,
    GAME_BLOCK_FOR_FUN_COUNT,
    BRICK_COLORS,
    DESIGN_WIDTH,
    DESIGN_HEIGHT
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
    brick_for_fun: Brick[]
    brick_for_fun_speed: number[]

    tetris_blocks: number[][]

    game_state: number
    game_state_change_init: boolean

    game_ready_line: Phaser.GameObjects.DynamicBitmapText

    constructor() {
        super({
            key: 'SimpleScene'
        })
    }

    preload() {
        this.load.tilemapTiledJSON('map', '/assets/tetris_tilemap/tetris_map.json')
        this.load.image('tetris_blocks', '/assets/tetris_tilemap/tetris_blocks.jpg')
        this.load.image('player', '/assets/sprites/mushroom.png')

        this.load.bitmapFont(
            'hyperdrive',
            '/assets/fonts/hyperdrive.png',
            '/assets/fonts/hyperdrive.xml'
        )
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

        this.tetris_brick = new Brick(this.tetris_map, this.tetris_blocks, Math.floor(BLOCK_X_COUNT / 2), -2)

        this.brick_for_fun = new Array(GAME_BLOCK_FOR_FUN_COUNT)
        for (let i = 0; i < GAME_BLOCK_FOR_FUN_COUNT; ++i) {
            this.brick_for_fun[i] = new Brick(this.tetris_map, this.tetris_blocks, i, -2)
            this.brick_for_fun[i].color = BRICK_COLORS[Math.floor(Math.random() * BRICK_COLORS.length)]
            this.brick_for_fun[i].fall_speed_level = 5 + Math.floor(Math.random() * FALL_TIME_INTERVAL.length / 2)
        }

        // show text in game ready screen
        this.game_ready_line = this.add.dynamicBitmapText(
            DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2 - 100,
            'hyperdrive',
            "Press Space \n   To Start"
        ).setFontSize(250).setOrigin(0.5)

        this.game_ready_line.setDisplayCallback((data) => {
            data.x = Phaser.Math.Between(data.x - 2, data.x + 2)
            data.y = Phaser.Math.Between(data.y - 4, data.y + 4)
            return data
        })
        this.game_ready_line.setVisible(false)

        this.game_state_change_init = true
        this.game_state = GAME_STATE_READY
    }

    update(time: number, delta: number) {
        if (this.game_state == GAME_STATE_GAMEOVER) {
            this.game_over(time);
        }

        if (this.game_state == GAME_STATE_READY) {
            this.game_ready(time);
        }

        if (this.game_state == GAME_STATE_PLAYING) {
            this.game_playing(time)
        }
    }

    game_ready(time: number) {
        // fall eternity...
        if (this.game_state_change_init === true) {
            this.clean_playground()
            for(let i = 0; i < GAME_BLOCK_FOR_FUN_COUNT; ++ i) {
                this.brick_for_fun[i].y = -2
            }
            this.game_ready_line.setVisible(true)
            this.input.keyboard.once("keydown_SPACE", () => {
                this.game_ready_line.setVisible(false)
                this.game_state = GAME_STATE_PLAYING
                this.game_state_change_init = true
            })
            this.game_state_change_init = false
        }
        this.game_ready_line.setVisible(true)

        for (let i = 0; i < GAME_BLOCK_FOR_FUN_COUNT; ++i) {
            if (time - this.brick_for_fun[i].last_fall_timestamp > FALL_TIME_INTERVAL[this.brick_for_fun[i].fall_speed_level]) {
                let not_collide = this.brick_for_fun[i].move_to(this.brick_for_fun[i].x, this.brick_for_fun[i].y + 1, true, false, false)
                if (this.brick_for_fun[i].y >= BLOCK_Y_COUNT) {
                    this.brick_for_fun[i].set_color(BRICK_COLORS[Math.floor(Math.random() * BRICK_COLORS.length)])
                    this.brick_for_fun[i].fall_speed_level = Math.floor(Math.random() * FALL_TIME_INTERVAL.length)
                    not_collide = this.brick_for_fun[i].move_to(this.brick_for_fun[i].x, -2, true, false, false)

                }
                this.brick_for_fun[i].last_fall_timestamp = time
            }
        }
    }

    clean_playground() {
        for(let x = 0; x < BLOCK_X_COUNT; x ++) {
            for(let y = 0; y < BLOCK_Y_COUNT; y ++) {
                this.tetris_map.removeTileAt(x, y)
                this.tetris_blocks[x][y] = 0
            }
        }
    }

    game_playing(time: number) {
        if (this.game_state_change_init === true) {
            this.clean_playground()
            this.tetris_brick.x = -2
            this.game_state_change_init = false
        }

        // roll the brick
        if (this.cursors.up.isDown) {
            if (time - this.tetris_brick.last_roll_timestamp > 100) {
                this.tetris_brick.roll()
                this.tetris_brick.last_roll_timestamp = time
            }
            this.cursors.up.isDown = false
        }

        // move brick left & right
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
            let x_offset = this.cursors.left.isDown ? -1 : 0
            x_offset += this.cursors.right.isDown ? 1 : 0

            if (time - this.tetris_brick.last_move_timestamp > 55) {
                this.tetris_brick.move_to(this.tetris_brick.x + x_offset, this.tetris_brick.y, false, false, true)
                this.tetris_brick.last_move_timestamp = time
            }
            this.cursors.left.isDown = this.cursors.right.isDown = false
        }

        // speed up the brick fall
        let cur_loop_fall_speed_level = this.tetris_brick.fall_speed_level
        if (this.cursors.down.isDown) {
            cur_loop_fall_speed_level = FALL_TIME_INTERVAL.length - 1
            this.cursors.down.isDown = false
        }

        // fall eternity...
        if (time - this.tetris_brick.last_fall_timestamp > FALL_TIME_INTERVAL[cur_loop_fall_speed_level]) {
            let not_collide = this.tetris_brick.move_to(this.tetris_brick.x, this.tetris_brick.y + 1)
            // which mean time to glue the brick
            if (not_collide == false) {
                // blink the lines...
                this.blink_lines()
                // glue the brick & move the brick to top of the playground & random shift the brick 
                not_collide = this.tetris_brick.move_to(BLOCK_X_COUNT / 2, -2, true, true)
                
                // which means we meet the [GAMEOVER]
                if (not_collide == false) {
                    this.game_state = GAME_STATE_GAMEOVER
                    this.game_state_change_init = true
                }
            }
            this.tetris_brick.last_fall_timestamp = time
        }
    }

    game_over(time: number) {
        if (this.game_state_change_init === true) {
            let y = BLOCK_Y_COUNT - 1
            let y_offset = -1

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
                        this.game_state_change_init = true
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
            this.game_state_change_init = false
        }
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

    blink_lines() {
        let not_empty_lines = []
        let need_repos_blocks = false
        // clean the filled lines ...
        for(let y = BLOCK_Y_COUNT - 1; y >= 0; y --) {
            let line_filled = true
            let line_empty = true

            for(let x = 0; x < BLOCK_X_COUNT; x ++) {
                if(this.tetris_blocks[x][y] === 0) {
                    line_filled = false
                } else {
                    line_empty = false
                }
            }

            if(line_empty) {
                break
            }
            if(line_filled) {
                need_repos_blocks = true
                for(let x = 0; x < BLOCK_X_COUNT; x ++) {
                    this.tetris_map.removeTileAt(x, y)
                    this.tetris_blocks[x][y] = 0
                }
            } else {
                not_empty_lines.push(y)
            }
        }
        // move down the lines
        if(need_repos_blocks) {
            not_empty_lines = not_empty_lines.reverse()
            let bottom_line = BLOCK_Y_COUNT - 1
            while(not_empty_lines.length !== 0) {
                let cur_line = not_empty_lines.pop()

                if(cur_line === bottom_line) {
                    bottom_line -= 1
                    continue
                }

                for(let x = 0; x < BLOCK_X_COUNT; ++ x) {
                    if(this.tetris_blocks[x][cur_line] != 0) {
                        this.tetris_map.putTileAt(this.tetris_map.getTileAt(x, cur_line).index, x, bottom_line)
                        this.tetris_map.removeTileAt(x, cur_line)
                    } else {
                        this.tetris_map.removeTileAt(x, bottom_line)
                    }
                    this.tetris_blocks[x][bottom_line] = this.tetris_blocks[x][cur_line]
                    this.tetris_blocks[x][cur_line] = 0
                }
                bottom_line -= 1
            }
        }
        // done!
    }
}

export default SimpleScene