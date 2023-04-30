import { Globals, Timer, quat_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class IntroState {
    constructor() {
        this._myBlackRoom = Globals.getScene().pp_getObjectByName("Black Room");

        this._myTimer = new Timer(1);
    }

    start(fsm) {
        GameGlobals.myPlayerLocomotion.setIdle(true);

        let blackRoomPosition = this._myBlackRoom.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward([0, 0, 1]);
        GameGlobals.myPlayerTransformManager.teleportAndReset(blackRoomPosition, rotationQuat);

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