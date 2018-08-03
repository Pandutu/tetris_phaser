import {
    BRICK_COLORS,
    BLOCK_MAP,
    BLOCK_X_COUNT,
    BLOCK_Y_COUNT,
    isFloat
} from "../global_vars";

export const NO_COLLIDE = 0
export const BORDER_COLLIDE = 1
export const BRICK_COLLIDE = 2

export class Brick {
    blocks: number[][]
    type: string
    posture: number
    color: number

    x: number
    y: number

    rng: Phaser.Math.RandomDataGenerator

    playground_view: Phaser.Tilemaps.Tilemap
    playground_model: number[][]

    last_move_timestamp: number
    last_roll_timestamp: number
    last_fall_timestamp: number

    fall_speed_level: number

    constructor(pay_ground_view: Phaser.Tilemaps.Tilemap, pay_ground_model: number[][], x: number, y: number) {
        this.playground_view = pay_ground_view
        this.playground_model = pay_ground_model
        this.blocks = []

        this.rng = new Phaser.Math.RandomDataGenerator()
        let seed_date = new Date()
        this.rng.init([
            seed_date.getHours().toString(),
            seed_date.getMinutes().toString(),
            seed_date.getSeconds().toString(),
            seed_date.getMilliseconds().toString()
        ])

        this.last_move_timestamp = 0
        this.last_roll_timestamp = 0
        this.last_fall_timestamp = 0
        this.fall_speed_level = 0

        this.type = 'o'
        this.posture = 0
        this.color = BRICK_COLORS[0]
        this.x = x
        this.y = y
    }

    set_block_shape(type: string, posture: number): any {
        this.type = type
        this.posture = posture
    }

    get_blocks_pos(x: number, y: number, type ? : string, posture ? : number): Object {
        let right_border = BLOCK_X_COUNT - 1
        let blocks_pos = []

        type = (type === undefined) ? this.type : type
        posture = (posture === undefined) ? this.posture : posture

        let move_left = 0
        let move_right = 0

        for (let offset of BLOCK_MAP[type][posture]) {

            let tmp_x = x + offset[0]

            if (tmp_x < 0) {
                move_right = Math.max(move_right, 0 - tmp_x)
            }
            if (tmp_x > right_border) {
                move_left = Math.min(move_left, right_border - tmp_x)
            }

            blocks_pos.push([x + offset[0], y + offset[1]])
        }

        let pos_x_adjust = move_left + move_right
        for (let pos of blocks_pos) {
            pos[0] += pos_x_adjust
        }
        return {
            'pos': blocks_pos,
            'x_adjust': pos_x_adjust
        }
    }

    is_collide(blocks_pos : number[][]): boolean {
        let result = false
        for (let pos of blocks_pos) {
            if (pos[0] < 0 || pos[0] >= BLOCK_X_COUNT) {
                result = true
                break
            }
            if (pos[1] >= BLOCK_Y_COUNT) {
                result = true
                break
            }
            if (pos[1] < 0) {
                continue
            }
            if (this.playground_model[pos[0]][pos[1]] != 0) {
                result = true
                break
            }
        }
        return result
    }

    roll() {
        this.hide()
        let posture_next = (this.posture + 1) % BLOCK_MAP[this.type].length
        let blocks_pos_new = this.get_blocks_pos(this.x, this.y, this.type, posture_next)
        if (!this.is_collide(blocks_pos_new['pos'])) {
            this.blocks = blocks_pos_new['pos']
            this.x += blocks_pos_new['x_adjust']
            this.posture = posture_next
        }
        this.show()
    }

    show() {
        for (let block_pos of this.blocks) {
            if (block_pos[0] >= 0 && block_pos[0] < BLOCK_X_COUNT && block_pos[1] >= 0 && block_pos[1] < BLOCK_Y_COUNT) {
                this.playground_view.putTileAt(this.color, block_pos[0], block_pos[1])
                this.playground_model[block_pos[0]][block_pos[1]] = this.color
            }
        }
    }

    hide() {
        for (let block_pos of this.blocks) {
            if (block_pos[0] >= 0 && block_pos[0] < BLOCK_X_COUNT && block_pos[1] >= 0 && block_pos[1] < BLOCK_Y_COUNT) {
                this.playground_view.removeTileAt(block_pos[0], block_pos[1])
                this.playground_model[block_pos[0]][block_pos[1]] = 0
            }
        }
    }

    move_to(x: number, y: number, stamp = false, wild_magic = false, check_collide = true, show = true): boolean {
        let _result = false

        if (stamp == false) {
            this.hide()
        }
        if (wild_magic == true) {
            this.random_type()
        }

        let blocks_pos_new = this.get_blocks_pos(x, y)
        if (check_collide == false || !this.is_collide(blocks_pos_new['pos'])) {
            this.x = x
            this.y = y
            this.blocks = blocks_pos_new['pos']
            this.x += blocks_pos_new['x_adjust']
            _result = true
        }
        if (show == true) {
            this.show()
        }

        return _result
    }

    random_type() {
        this.type = this.rng.pick(Object.keys(BLOCK_MAP))
        this.posture = this.rng.between(0, BLOCK_MAP[this.type].length - 1)
        this.color = this.rng.pick(BRICK_COLORS)
    }

    set_color(color: number) {
        this.color = color
    }
}