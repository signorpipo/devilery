import { FSM, GamepadButtonID, Globals, quat_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class GameState {
    constructor() {
        this._myPlayerStart = Globals.getScene().pp_getObjectByName("Player Start");

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "  Game");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");
        this._myFSM.addState("game", this._gameUpdate.bind(this));
        this._myFSM.addState("lost", this._lostUpdate.bind(this));

        this._myFSM.addTransition("init", "idle", "start");
        this._myFSM.addTransition("idle", "game", "start");
        this._myFSM.addTransition("game", "lost", "end", this._lostStart.bind(this));
        this._myFSM.addTransition("lost", "idle", "end", this._gameEnding.bind(this));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myParentFSM = null;

    }

    start(fsm) {
        this._myParentFSM = fsm;

        GameGlobals.myBlackFade.fadeOut(true);

        GameGlobals.myPlayerLocomotion.setIdle(false);

        let playerStartPosition = this._myPlayerStart.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward([0, 0, 1]);
        GameGlobals.myPlayerTransformManager.teleportAndReset(playerStartPosition, rotationQuat);

        GameGlobals.myBlackFade.fadeIn();

        this._myFSM.perform("start");
    }

    end() {
        GameGlobals.myWhiteFade.fadeOut(true);
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    _gameUpdate(dt, fsm) {
        if (Globals.getLeftGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart(2)) {
            fsm.perform("end");
        }
    }

    _lostUpdate(dt, fsm) {
        if (!GameGlobals.myWhiteFade.isFading()) {
            fsm.perform("end");
        }
    }

    _lostStart() {
        GameGlobals.myWhiteFade.fadeOut();
    }

    _gameEnding() {
        this._myParentFSM.perform("end");
    }
}