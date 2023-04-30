import { ParticlesSpawnerComponent } from "../../playground/particles_spawner_component";
import { FSM, Globals, PlayerLocomotionComponent } from "../../pp";
import { EndingState } from "../states/ending_state";
import { GameState } from "../states/game_state";
import { IntroState } from "../states/intro_state";
import { AudioLoader } from "./audio_loader";
import { DevileryBossComponent } from "./components/devilery_boss_component";
import { FadeViewInOutComponent } from "./components/fade_view_in_out_component";
import { PrincessComponent } from "./components/princess_component";
import { ShipComponent } from "./components/ship_component";
import { GameGlobals } from "./game_globals";

export class Devilery {
    constructor() {
        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "Devilery");

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
        let playerLocomotionComponent = Globals.getScene().pp_getComponent(PlayerLocomotionComponent);
        GameGlobals.myPlayerLocomotion = playerLocomotionComponent._myPlayerLocomotion;
        GameGlobals.myPlayerTransformManager = playerLocomotionComponent._myPlayerLocomotion._myPlayerTransformManager;

        GameGlobals.myBlackFade = Globals.getScene().pp_getObjectByName("Black Fade").pp_getComponent(FadeViewInOutComponent);
        GameGlobals.myWhiteFade = Globals.getScene().pp_getObjectByName("White Fade").pp_getComponent(FadeViewInOutComponent);

        GameGlobals.myPrincessTarget = Globals.getScene().pp_getObjectByName("Princess Target");

        GameGlobals.myWindowsTargets = Globals.getScene().pp_getObjectByName("Windows Targets").pp_getChildren();

        GameGlobals.myEvilTarget = Globals.getScene().pp_getObjectByName("Evil Target");

        GameGlobals.myWeaponTarget = Globals.getScene().pp_getObjectByName("Weapon Target");

        GameGlobals.myShip = Globals.getScene().pp_getObjectByName("Ship").pp_getComponent(ShipComponent);
        GameGlobals.myDevileryBoss = Globals.getScene().pp_getObjectByName("Devilery Boss").pp_getComponent(DevileryBossComponent);

        GameGlobals.myPrincess = Globals.getScene().pp_getComponent(PrincessComponent);

        GameGlobals.myHeartsParticlesSpawner = Globals.getScene().pp_getObjectByName("Hearts Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
        GameGlobals.myEnemyDieParticlesSpawner = Globals.getScene().pp_getObjectByName("Enemy Die Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
    }
}