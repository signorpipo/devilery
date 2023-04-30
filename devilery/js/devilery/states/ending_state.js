import { Globals, Timer, quat_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class EndingState {
    constructor() {
        this._myWhiteRoom = Globals.getScene().pp_getObjectByName("White Room");

        this._myTimer = new Timer(1);
    }

    start(fsm) {
        GameGlobals.myPlayerLocomotion.setIdle(true);

        let whiteRoomPosition = this._myWhiteRoom.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward([0, 0, 1]);
        GameGlobals.myPlayerTransformManager.teleportAndReset(whiteRoomPosition, rotationQuat);

        GameGlobals.myWhiteFade.fadeIn(true);

        this._myTimer.start();
    }

    end() {
        GameGlobals.myBlackFade.fadeOut(true);
    }

    update(dt, fsm) {
        if (GameGlobals.mySkipIntro) {
            fsm.perform("end");
        } else {
            this._myTimer.update(dt);
            if (this._myTimer.isJustDone()) {
                fsm.perform("end");
            }
        }
    }
}