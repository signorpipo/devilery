import { FSM } from "../../pp";
import { AudioLoader } from "./audio_loader";

export class Devilery {
    constructor() {
        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "Devilery");

        this._myFSM.addState("init");
        this._myFSM.addState("intro", this._idleUpdate.bind(this));
        this._myFSM.addState("game", this._myDetectionState);
        this._myFSM.addState("ending", this._myTeleportState);

        this._myFSM.addTransition("init", "intro", "start");

        this._myFSM.addTransition("intro", "game", "end");
        this._myFSM.addTransition("game", "ending", "end");
        this._myFSM.addTransition("ending", "intro", "end");

        this._myFSM.init("init");
    }

    start() {
        this._myAudioLoader = new AudioLoader();
        this._myAudioLoader.load();

        this._myFSM.perform("start");
    }

    update(dt) {
        this._myFSM.update(dt);
    }
}