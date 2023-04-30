import { vec3_create } from "../../pp";

export let GameGlobals = {
    myUp: vec3_create(0, 1, 0),

    myStarted: false,

    myPlayerLocomotion: null,
    myPlayerTransformManager: null,

    myBlackFade: null,
    myWhiteFade: null,

    myPrincessTarget: null,
    myWindowsTargets: [],
    myEvilTarget: null,
    myWeaponTarget: null,

    myPrincess: null,

    myShip: null,
    myDevileryBoss: null,

    myEnemies: [],

    myDebugEnabled: false,
    mySkipIntro: false
};

window.GameGlobals = GameGlobals;