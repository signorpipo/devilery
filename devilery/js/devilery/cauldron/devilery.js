import { FSM, Globals } from "../../pp";
import { EndingState } from "../states/ending_state";
import { GameState } from "../states/game_state";
import { IntroState } from "../states/intro_state";
import { AudioLoader } from "./audio_loader";
import { GameGlobals } from "./game_globals";

export class Devilery {
    constructor() {
        this._myFSM = new FSM();
        this._myFSM.setLogEnabled(true, "Devilery");

        this._myFSM.addState("init");
        this._myFSM.addState("intro", new IntroState());
        this._myFSM.addState("game", new GameState());
        this._myFSM.addState("ending", new EndingState());

        this._myFSM.addTransition("init", "intro", "start");

        this._myFSM.addTransition("intro", "game", "end");
        this._myFSM.addTransition("game", "ending", "end");
        this._myFSM.addTransition("ending", "intro", "end");

        this._myFSM.init("init");
    }

    start() {
        this._myAudioLoader = new AudioLoader();
        this._myAudioLoader.load();

        this._collectSceneObjects();

        this._myFSM.perform("start");
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    _collectSceneObjects() {
        let playerLocomotionComponent = Globals.getScene().pp_getComponent("pp-player-locomotion");
        GameGlobals.myPlayerLocomotion = playerLocomotionComponent._myPlayerLocomotion;
        GameGlobals.myPlayerTransformManager = playerLocomotionComponent._myPlayerLocomotion._myPlayerTransformManager;

        GameGlobals.myBlackFade = Globals.getScene().pp_getObjectByName("Black Fade").pp_getComponent("fade-view-in-out");
        GameGlobals.myWhiteFade = Globals.getScene().pp_getObjectByName("White Fade").pp_getComponent("fade-view-in-out");
    }
}