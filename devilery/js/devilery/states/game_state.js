import { GamepadButtonID, Globals, quat_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class GameState {
    constructor() {
        this._myPlayerStart = Globals.getScene().pp_getObjectByName("Player Start");

    }

    start(fsm) {
        GameGlobals.myBlackFade.fadeOut(true);

        GameGlobals.myPlayerLocomotion.setIdle(false);

        let playerStartPosition = this._myPlayerStart.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward([0, 0, 1]);
        GameGlobals.myPlayerTransformManager.teleportAndReset(playerStartPosition, rotationQuat);

        GameGlobals.myBlackFade.fadeIn();
    }

    end() {
        GameGlobals.myWhiteFade.fadeOut(true);
    }

    update(dt, fsm) {
        if (Globals.getLeftGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart(2)) {
            fsm.perform("end");
        }
    }
}