import { ParticlesSpawnerComponent } from "../../playground/particles_spawner_component";
import { FSM, Globals, PlayerLocomotionComponent } from "../../pp";
import { EndingState } from "../states/ending_state";
import { GameState } from "../states/game_state";
import { IntroState } from "../states/intro_state";
import { AudioLoader } from "./audio_loader";
import { BulletSpawnerComponent } from "./components/bullet_spawner_component";
import { DevileryBossComponent } from "./components/devilery_boss_component";
import { DevileryConsoleComponent } from "./components/devilery_console_component";
import { EvilPointSpawnerComponent } from "./components/evil_point_spawner_component";
import { FadeViewInOutComponent } from "./components/fade_view_in_out_component";
import { PrincessComponent } from "./components/princess_component";
import { ShipComponent } from "./components/ship_component";
import { WeaponType } from "./components/weapon_component";
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

        GameGlobals.myBlackFade = GameGlobals.myScene.pp_getObjectByName("Black Fade").pp_getComponent(FadeViewInOutComponent);
        GameGlobals.myWhiteFade = GameGlobals.myScene.pp_getObjectByName("White Fade").pp_getComponent(FadeViewInOutComponent);

        GameGlobals.myPrincessTarget = GameGlobals.myScene.pp_getObjectByName("Princess Target");

        GameGlobals.myWindowsTargets = GameGlobals.myScene.pp_getObjectByName("Windows Targets").pp_getChildren();

        GameGlobals.myEvilTarget = GameGlobals.myScene.pp_getObjectByName("Evil Target");

        GameGlobals.myWeaponTarget = GameGlobals.myScene.pp_getObjectByName("Weapon Target");

        GameGlobals.myShip = GameGlobals.myScene.pp_getObjectByName("Ship").pp_getComponent(ShipComponent);
        GameGlobals.myDevileryBoss = GameGlobals.myScene.pp_getObjectByName("Devilery Boss").pp_getComponent(DevileryBossComponent);

        GameGlobals.myPrincess = GameGlobals.myScene.pp_getComponent(PrincessComponent);

        GameGlobals.myHeartsParticlesSpawner = GameGlobals.myScene.pp_getObjectByName("Hearts Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
        GameGlobals.mySkullParticlesSpawner = GameGlobals.myScene.pp_getObjectByName("Skull Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
        GameGlobals.myBuyParticlesSpawner = GameGlobals.myScene.pp_getObjectByName("Buy Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
        GameGlobals.myShotParticlesSpawner = GameGlobals.myScene.pp_getObjectByName("Shot Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
        GameGlobals.myEvilPointReceivedParticlesSpawner = GameGlobals.myScene.pp_getObjectByName("Evil Point Received Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);

        GameGlobals.myEvilPointSpawner = GameGlobals.myScene.pp_getObjectByName("Evil Point Spawner").pp_getComponent(EvilPointSpawnerComponent);

        GameGlobals.myDevileryConsole = GameGlobals.myScene.pp_getObjectByName("Devilery Console").pp_getComponent(DevileryConsoleComponent);

        let bulletSpawners = GameGlobals.myScene.pp_getObjectByName("Bullet Spawners")
        GameGlobals.myBulletSpawners = [];
        GameGlobals.myBulletSpawners[WeaponType.APPLE] = bulletSpawners.pp_getObjectByName("Apple Bullet Spawner").pp_getComponent(BulletSpawnerComponent);
        GameGlobals.myBulletSpawners[WeaponType.BAT] = bulletSpawners.pp_getObjectByName("Bat Bullet Spawner").pp_getComponent(BulletSpawnerComponent);
        GameGlobals.myBulletSpawners[WeaponType.SKULL] = bulletSpawners.pp_getObjectByName("Skull Bullet Spawner").pp_getComponent(BulletSpawnerComponent);
        GameGlobals.myBulletSpawners[WeaponType.VOICE] = bulletSpawners.pp_getObjectByName("Voice Bullet Spawner").pp_getComponent(BulletSpawnerComponent);

        GameGlobals.myEnemyDieParticlesSpawner = [];
        GameGlobals.myEnemyDieParticlesSpawner[0] = GameGlobals.myScene.pp_getObjectByName("Normal Bird Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
        GameGlobals.myEnemyDieParticlesSpawner[1] = GameGlobals.myScene.pp_getObjectByName("Strong Bird Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
        GameGlobals.myEnemyDieParticlesSpawner[2] = GameGlobals.myScene.pp_getObjectByName("Shield Bird Particles Spawner").pp_getComponent(ParticlesSpawnerComponent);
    }
}