import { FSM, GamepadButtonID, Globals, TimerState, XRUtils, quat_create, vec3_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class IntroState {
    constructor() {
        this._myBlackRoom = GameGlobals.myScene.pp_getObjectByName("Black Room");

        this._myBlackRoomStories = GameGlobals.myScene.pp_getObjectByName("Black Room Stories").pp_getChildren();
        this._myCurrentStoryIndex = 0;

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "  Intro");

        this._myStoryTimerState = new TimerState(0, "end");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");
        this._myFSM.addState("first_timer", new TimerState(2, "end"));
        this._myFSM.addState("next_timer", new TimerState(1, "end"));
        this._myFSM.addState("next_phase", this._nextPhaseUpdate.bind(this));
        this._myFSM.addState("fade_out", this._checkFade.bind(this));
        this._myFSM.addState("story", this._myStoryTimerState);
        this._myFSM.addState("last_timer", new TimerState(1, "end"));
        //this._myFSM.addState("intro", new TimerState(1, "end"));

        this._myFSM.addTransition("init", "idle", "start");
        this._myFSM.addTransition("idle", "first_timer", "start");
        this._myFSM.addTransition("first_timer", "next_phase", "end");
        this._myFSM.addTransition("next_timer", "next_phase", "end");
        this._myFSM.addTransition("next_phase", "last_timer", "end_intro");
        this._myFSM.addTransition("next_phase", "story", "next", this._storyStart.bind(this));
        this._myFSM.addTransition("story", "fade_out", "end", this._fadeOutStart.bind(this));
        this._myFSM.addTransition("fade_out", "next_timer", "next");
        this._myFSM.addTransition("last_timer", "idle", "end", this._endIntro.bind(this));

        this._myFSM.addTransition("idle", "idle", "skip");
        this._myFSM.addTransition("next_timer", "idle", "skip", this._skipIntro.bind(this));
        this._myFSM.addTransition("first_timer", "idle", "skip", this._skipIntro.bind(this));
        this._myFSM.addTransition("next_phase", "idle", "skip", this._skipIntro.bind(this));
        this._myFSM.addTransition("fade_out", "idle", "skip", this._skipIntro.bind(this));
        this._myFSM.addTransition("story", "idle", "skip", this._skipIntro.bind(this));
        this._myFSM.addTransition("last_timer", "idle", "skip", this._skipIntro.bind(this));
        //this._myFSM.addTransition("intro", "idle", "skip", this._skipIntro.bind(this));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myParentFSM = null;

        this._myStoryTimers = [12, 14, 7];
    }

    start(fsm) {
        this._myBlackRoomStories[0].pp_getParent().pp_setActive(false);
        this._myCurrentStoryIndex = -1;

        GameGlobals.myBlackFade.fadeOut(true);
        GameGlobals.myWhiteFade.fadeIn(true);

        GameGlobals.myPlayerLocomotion.setIdle(true);

        let blackRoomPosition = this._myBlackRoom.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward(vec3_create(0, 0, 1));
        GameGlobals.myPlayerTransformManager.teleportAndReset(blackRoomPosition.vec3_sub(vec3_create(0, GameGlobals.myPlayerTransformManager.getHeight(), 0)), rotationQuat);

        this._myParentFSM = fsm;

        this._myFSM.perform("start");

        this._myResetPositionCounter = 0;

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false);
    }

    _onXRSessionStart() {
        this._myResetPositionCounter = 5;
    }

    _onXRSessionEnd() {

    }

    end() {
        GameGlobals.myBlackFade.fadeOut(true);
    }

    update(dt, fsm) {
        if (GameGlobals.mySkipIntro) {
            this._myFSM.perform("skip");
        }

        if (this._myResetPositionCounter > 0) {
            this._myResetPositionCounter--;
            if (this._myResetPositionCounter == 0) {
                let blackRoomPosition = this._myBlackRoom.pp_getPosition();
                let rotationQuat = quat_create().quat_setForward(vec3_create(0, 0, 1));
                GameGlobals.myPlayerTransformManager.teleportAndReset(blackRoomPosition.vec3_sub(vec3_create(0, GameGlobals.myPlayerTransformManager.getHeight(), 0)), rotationQuat);
            }
        }

        if (Globals.getLeftGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressStart(3) ||
            Globals.getLeftGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressStart(3) ||
            Globals.getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressStart(3) ||
            Globals.getRightGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressStart(3)) {
            this._myFSM.perform("skip");
        }

        this._myFSM.update(dt);
    }

    _nextPhaseUpdate(dt, fsm) {
        GameGlobals.myBlackFade.fadeOut(true);

        this._myCurrentStoryIndex++;

        if (this._myCurrentStoryIndex < this._myBlackRoomStories.length) {
            this._myStoryTimerState.setDuration(this._myStoryTimers[Math.min(this._myStoryTimers.length - 1, this._myCurrentStoryIndex)]);
            fsm.perform("next");
        } else {
            fsm.perform("end_intro");
        }
    }

    _checkFade(dt, fsm) {
        if (!GameGlobals.myBlackFade.isFading()) {
            fsm.perform("next");
        }
    }

    _fadeOutStart(finalFade = false) {
        this._myFinalFade = finalFade;
        GameGlobals.myBlackFade.fadeOut();
    }

    _storyStart() {
        this._myBlackRoomStories[0].pp_getParent().pp_setActive(false);
        this._myBlackRoomStories[this._myCurrentStoryIndex].pp_setActive(true);

        GameGlobals.myBlackFade.fadeIn();
    }

    _endIntro() {
        this._myParentFSM.perform("end");
    }

    _skipIntro() {
        this._endIntro();
    }
}