import { FSM, GamepadButtonID, Globals, TimerState, XRUtils, quat_create, vec3_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class EndingState {
    constructor() {
        this._myWhiteRoom = GameGlobals.myScene.pp_getObjectByName("White Room");

        this._myWhiteRoomStories = GameGlobals.myScene.pp_getObjectByName("White Room Stories").pp_getChildren();
        this._myCurrentStoryIndex = 0;

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "  Ending");

        this._myStoryTimerState = new TimerState(0, "end");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");
        this._myFSM.addState("next_timer", new TimerState(1, "end"));
        this._myFSM.addState("next_phase", this._nextPhaseUpdate.bind(this));
        this._myFSM.addState("fade_out", this._checkFade.bind(this));
        this._myFSM.addState("fade_out_black", this._checkFadeBlack.bind(this));
        this._myFSM.addState("story", this._myStoryTimerState);
        this._myFSM.addState("last_story", this._myStoryTimerState);
        this._myFSM.addState("almost_last_timer", new TimerState(0, "end"));
        this._myFSM.addState("last_timer", new TimerState(2, "end"));
        //this._myFSM.addState("ending", new TimerState(1, "end"));

        this._myFSM.addTransition("init", "idle", "start");
        this._myFSM.addTransition("idle", "next_timer", "start");
        this._myFSM.addTransition("next_timer", "next_phase", "end");
        this._myFSM.addTransition("next_phase", "last_story", "end_ending", this._storyStart.bind(this));
        this._myFSM.addTransition("next_phase", "story", "next", this._storyStart.bind(this));
        this._myFSM.addTransition("story", "fade_out", "end", this._fadeOutStart.bind(this));
        this._myFSM.addTransition("fade_out", "next_timer", "next");
        this._myFSM.addTransition("almost_last_timer", "fade_out_black", "end", this._fadeOutBlackStart.bind(this));
        this._myFSM.addTransition("fade_out_black", "last_timer", "end");
        this._myFSM.addTransition("last_timer", "idle", "end", this._endEnding.bind(this));
        this._myFSM.addTransition("last_story", "fade_out_black", "end", this._fadeOutBlackStart.bind(this));

        this._myFSM.addTransition("idle", "idle", "skip");
        this._myFSM.addTransition("next_timer", "idle", "skip", this._skipEnding.bind(this));
        this._myFSM.addTransition("next_phase", "idle", "skip", this._skipEnding.bind(this));
        this._myFSM.addTransition("fade_out", "idle", "skip", this._skipEnding.bind(this));
        this._myFSM.addTransition("story", "idle", "skip", this._skipEnding.bind(this));
        this._myFSM.addTransition("last_timer", "idle", "skip", this._skipEnding.bind(this));
        this._myFSM.addTransition("fade_out_black", "idle", "skip", this._skipEnding.bind(this));
        this._myFSM.addTransition("almost_last_timer", "idle", "skip", this._skipEnding.bind(this));
        //this._myFSM.addTransition("ending", "idle", "skip", this._skipEnding.bind(this));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myParentFSM = null;

        this._myStoryTimers = [4, 4, 4];
    }

    start(fsm) {
        this._myWhiteRoomStories[0].pp_getParent().pp_setActive(false);
        this._myCurrentStoryIndex = -1;

        GameGlobals.myWhiteFade.fadeOut(true);
        GameGlobals.myBlackFade.fadeIn(true);

        GameGlobals.myPlayerLocomotion.setIdle(true);

        let whiteRoomPosition = this._myWhiteRoom.pp_getPosition();
        let rotationQuat = quat_create().quat_setForward(vec3_create(0, 0, 1));
        GameGlobals.myPlayerTransformManager.teleportAndReset(whiteRoomPosition.vec3_sub(vec3_create(0, GameGlobals.myPlayerTransformManager.getHeight(), 0)), rotationQuat);

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
        GameGlobals.myWhiteFade.fadeIn(true);
        GameGlobals.myBlackFade.fadeOut(true);
    }

    update(dt, fsm) {
        if (GameGlobals.mySkipEnding) {
            this._myFSM.perform("skip");
        }

        if (this._myResetPositionCounter > 0) {
            this._myResetPositionCounter--;
            if (this._myResetPositionCounter == 0) {
                let whiteRoomPosition = this._myWhiteRoom.pp_getPosition();
                let rotationQuat = quat_create().quat_setForward(vec3_create(0, 0, 1));
                GameGlobals.myPlayerTransformManager.teleportAndReset(whiteRoomPosition.vec3_sub(vec3_create(0, GameGlobals.myPlayerTransformManager.getHeight(), 0)), rotationQuat);
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
        GameGlobals.myWhiteFade.fadeOut(true);

        this._myCurrentStoryIndex++;

        this._myStoryTimerState.setDuration(this._myStoryTimers[Math.min(this._myStoryTimers.length - 1, this._myCurrentStoryIndex)]);

        if (this._myCurrentStoryIndex < this._myWhiteRoomStories.length - 1) {
            fsm.perform("next");
        } else {
            fsm.perform("end_ending");
        }
    }

    _checkFade(dt, fsm) {
        if (!GameGlobals.myWhiteFade.isFading()) {
            fsm.perform("next");
        }
    }

    _checkFadeBlack(dt, fsm) {
        if (!GameGlobals.myBlackFade.isFading()) {
            fsm.perform("end");
        }
    }

    _fadeOutStart() {
        if (this._myStoryTimers[Math.min(this._myStoryTimers.length - 1, this._myCurrentStoryIndex)] != 0) {
            GameGlobals.myWhiteFade.fadeOut();
        }
    }

    _fadeOutBlackStart() {
        GameGlobals.myBlackFade.fadeOut();
    }

    _storyStart() {
        this._myWhiteRoomStories[0].pp_getParent().pp_setActive(false);
        this._myWhiteRoomStories[this._myCurrentStoryIndex].pp_setActive(true);

        if (this._myStoryTimers[Math.min(this._myStoryTimers.length - 1, this._myCurrentStoryIndex)] != 0) {
            GameGlobals.myWhiteFade.fadeIn();
        }
    }

    _endEnding() {
        this._myParentFSM.perform("end");
    }

    _skipEnding() {
        this._endEnding();
    }
}