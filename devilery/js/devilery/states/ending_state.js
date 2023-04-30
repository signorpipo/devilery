import { FSM, Globals, TimerState, quat_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class EndingState {
    constructor() {
        this._myWhiteRoom = Globals.getScene().pp_getObjectByName("White Room");

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "  Ending");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");
        this._myFSM.addState("ending", new TimerState(1, "end"));
        this._myFSM.addState("fade_out", this._checkFade.bind(this));

        this._myFSM.addTransition("init", "idle", "start");
        this._myFSM.addTransition("idle", "ending", "start");
        this._myFSM.addTransition("ending", "fade_out", "end", this._fadeOutStart.bind(this));
        this._myFSM.addTransition("fade_out", "idle", "end", this._endEnding.bind(this));

        this._myFSM.addTransition("idle", "idle", "skip");
        this._myFSM.addTransition("ending", "idle", "skip", this._skipEnding.bind(this));
        this._myFSM.addTransition("fade_out", "idle", "skip", this._skipEnding.bind(this));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myParentFSM = null;
    }

    start(fsm) {
        GameGlobals.myShip.stopShip();
        GameGlobals.myDevileryBoss.stopDevileryBoss();

        GameGlobals.myWhiteFade.fadeIn(true);

        GameGlobals.myPlayerLocomotion.setIdle(true);

        let whiteRoomPosition = this._myWhiteRoom.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward([0, 0, 1]);
        GameGlobals.myPlayerTransformManager.teleportAndReset(whiteRoomPosition, rotationQuat);

        this._myParentFSM = fsm;

        this._myFSM.perform("start");
    }

    end() {
        GameGlobals.myBlackFade.fadeOut(true);
    }

    update(dt, fsm) {
        if (GameGlobals.mySkipIntro) {
            this._myFSM.perform("skip");
        }

        this._myFSM.update(dt);
    }

    _checkFade(dt, fsm) {
        if (!GameGlobals.myBlackFade.isFading()) {
            fsm.perform("end");
        }
    }

    _fadeOutStart() {
        GameGlobals.myBlackFade.fadeOut();
    }

    _endEnding() {
        this._myParentFSM.perform("end");
    }

    _skipEnding() {
        this._endEnding();
    }
}