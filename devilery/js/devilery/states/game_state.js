import { GameGlobals } from "../cauldron/game_globals";

export class GameState {
    constructor() {

    }

    start(fsm) {
        GameGlobals.myPlayerLocomotion.setIdle(false);
    }

    update(dt, fsm) {

    }
}