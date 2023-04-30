import { Globals } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class IntroState {
    constructor() {
        this._myBlackRoom = Globals.getScene().pp_getObjectByName("Black Room");
    }

    start(fsm) {

    }

    update(dt, fsm) {
        if (GameGlobals.mySkipIntro) {
            // prepare black face out
            fsm.perform("end")
        } else {

        }
    }
}