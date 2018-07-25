import 'phaser'

import SimpleScene from './scenes/simple-scene'
import { DESIGN_WIDTH, DESIGN_HEIGHT } from './global_vars';

const gameConfig = {
    type: Phaser.CANVAS,
    width: DESIGN_WIDTH,//window.innerWidth,
    height: DESIGN_HEIGHT,//window.innerHeight,
    scene: SimpleScene,
    resolution: 1,
    backgroundColor: "#EDEEC9",

    ///design_width: 15 * 128,
    ///design_height: 20 * 128
}

const tetris_game = new Phaser.Game(gameConfig)
/*
window.onresize = function() {
    tetris_game.renderer.resize(window.innerWidth, window.innerHeight)
    tetris_game.events.emit('resize')
}
*/

