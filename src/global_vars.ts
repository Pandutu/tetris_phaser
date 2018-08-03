export const BLOCK_SIZE = 128
export const BLOCK_X_COUNT = 10
export const BLOCK_Y_COUNT = 20
export const DESIGN_WIDTH = BLOCK_X_COUNT * BLOCK_SIZE
export const DESIGN_HEIGHT = BLOCK_Y_COUNT * BLOCK_SIZE
export const BRICK_COLORS = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12]

export const BC_BLUE = 1
export const BC_GREEN = 2
export const BC_AZURE = 3
export const BC_BLOOD = 4
export const BC_ORANGE = 5
export const BC_PINK = 6
export const BC_EMPTY = 7
export const BC_PURPLE = 8
export const BC_RAINBOW = 9
export const BC_RED = 10
export const BC_EMERALD = 11
export const BC_YELLOW = 12

export const ROLL_WAIT_TIME_THRESHOLD = 700 // ms
export const FALL_TIME_INTERVAL = [400, 300, 200, 100, 80, 70, 60, 50, 40, 30, 20, 10]

export const GAME_STATE_READY = 0
export const GAME_STATE_GAMEOVER = 1
export const GAME_STATE_PLAYING = 2
export const GAME_STATE_CLEAN_PLAYGROUND = 3

export const GAME_BLOCK_FOR_FUN_COUNT = 10

export const BLOCK_MAP = {
    'Z': [
        [
            [0, 0],
            [-1, 1],
            [0, -1],
            [-1, 0]
        ],
        [
            [0, 0],
            [1, 0],
            [0, -1],
            [-1, -1]
        ]
    ],
    'S': [
        [
            [0, 0],
            [-1, 0],
            [0, -1],
            [1, -1]
        ],
        [
            [0, 0],
            [-1, -1],
            [-1, 0],
            [0, 1]
        ]
    ],
    'L': [
        [
            [0, 0],
            [1, 0],
            [0, -1],
            [0, -2]
        ],
        [
            [0, 0],
            [-1, 0],
            [-2, 0],
            [0, -1]
        ],
        [
            [0, 0],
            [-1, 0],
            [0, 1],
            [0, 2]
        ],
        [
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1]
        ]
    ],
    'J': [
        [
            [0, 0],
            [-1, 0],
            [0, 1],
            [0, 2]
        ],
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [2, 0]
        ],
        [
            [0, 0],
            [1, 0],
            [0, -1],
            [0, -2]
        ],
        [
            [0, 0],
            [0, -1],
            [-1, 0],
            [-2, 0]
        ]
    ],
    'I': [
        [
            [0, 0],
            [0, -1],
            [0, 1],
            [0, 2]
        ],
        [
            [0, 0],
            [1, 0],
            [-1, 0],
            [-2, 0]
        ]
    ],
    'T': [
        [
            [0, 0],
            [0, -1],
            [-1, 0],
            [1, 0]
        ],
        [
            [0, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ],
        [
            [0, 0],
            [0, 1],
            [-1, 0],
            [1, 0]
        ],
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [0, -1]
        ],
    ],
    'O': [
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
        ]
    ],
    'o': [
        [
            [0, 0]
        ]
    ]
}

export function isFloat(n: number) {
    return n % 1 !== 0
}