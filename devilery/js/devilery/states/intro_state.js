import { FSM, Globals, TimerState, quat_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class IntroState {
    constructor() {
        this._myBlackRoom = Globals.getScene().pp_getObjectByName("Black Room");

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "  Intro");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");
        this._myFSM.addState("intro", new TimerState(1, "end"));

        this._myFSM.addTransition("init", "idle", "start");
        this._myFSM.addTransition("idle", "intro", "start");
        this._myFSM.addTransition("intro", "idle", "end", this._endIntro.bind(this));

        this._myFSM.addTransition("idle", "idle", "skip");
        this._myFSM.addTransition("intro", "idle", "skip", this._skipIntro.bind(this));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myParentFSM = null;
    }

    start(fsm) {
        GameGlobals.myPlayerLocomotion.setIdle(true);

        let blackRoomPosition = this._myBlackRoom.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward([0, 0, 1]);
        GameGlobals.myPlayerTransformManager.teleportAndReset(blackRoomPosition, rotationQuat);

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

    _endIntro() {
        this._myParentFSM.perform("end");
    }

    _skipIntro() {
        this._endIntro();
    }
}