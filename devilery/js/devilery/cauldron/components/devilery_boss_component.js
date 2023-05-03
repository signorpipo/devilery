import { Component } from "@wonderlandengine/api";
import { GamepadButtonID, Globals, ObjectPoolParams, ObjectPoolsManager } from "../../../pp";
import { GameGlobals } from "../game_globals";
import { DevilerSkullComponent } from "./devilery_skull_component";
import { EnemyComponent } from "./enemy_component";
import { WeaponType } from "./weapon_component";

export class DevileryBossComponent extends Component {
    static TypeName = "devilery-boss";
    static Properties = {
    };

    start() {
        this._myStarted = false;
        this._myDevileryBossStarted = false;
    }

    update(dt) {
        if (!GameGlobals.myStarted) return;

        if (!this._myStarted) {
            this._start();

            this._myStarted = true;
        } else {
            this._update(dt);
        }
    }

    _start() {
        this._myDevilerySkullPools = new ObjectPoolsManager();
        this._myDevilerySkulls = [];

        this._myDevilerySkullsTypes = GameGlobals.myScene.pp_getObjectByName("Devilery Skulls").pp_getChildren();

        let poolParams = new ObjectPoolParams();

        poolParams.myInitialPoolSize = 10;
        poolParams.myPercentageToAddWhenEmpty = 1;

        for (let i = 0; i < this._myDevilerySkullsTypes.length; i++) {
            this._myDevilerySkullPools.addPool(i, this._myDevilerySkullsTypes[i], poolParams);
        }

        this._myWeaponPools = new ObjectPoolsManager();
        this._myWeapons = [];

        let weaponTypes = GameGlobals.myScene.pp_getObjectByName("Weapons");

        this._myWeaponPools.addPool(WeaponType.APPLE, weaponTypes.pp_getObjectByName("Apple Gun"), poolParams);
        this._myWeaponPools.addPool(WeaponType.BAT, weaponTypes.pp_getObjectByName("Bat Gun"), poolParams);
        this._myWeaponPools.addPool(WeaponType.SKULL, weaponTypes.pp_getObjectByName("Skull Gun"), poolParams);
        this._myWeaponPools.addPool(WeaponType.VOICE, weaponTypes.pp_getObjectByName("Voice Gun"), poolParams);
    }

    _update(dt) {
        if (this._myDevileryBossStarted) {
            if (GameGlobals.myDebugEnabled) {
                if (Globals.getRightGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart(2)) {
                    this.deviler(0);
                }
                if (Globals.getRightGamepad().getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart(3)) {
                    this.deviler(1);
                }
                if (Globals.getRightGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressStart(2)) {
                    this.deviler(2);
                }
                if (Globals.getRightGamepad().getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressStart(3)) {
                    this.deviler(3);
                }
            }
        }
    }

    devilerySkullDespawn(skull) {
        skull.pp_getComponent(DevilerSkullComponent).release();
        this._myDevilerySkullPools.releaseObject(skull);
        this._myDevilerySkulls.pp_removeEqual(skull);
    }

    weaponDespawn(weapon) {
        this._myWeaponPools.releaseObject(weapon);
        this._myWeapons.pp_removeEqual(weapon);
    }

    startDevileryBoss() {
        this._myDevileryBossStarted = true;

        this.deviler(0, true);
    }

    stopDevileryBoss() {
        this._myDevileryBossStarted = false;

        for (let skull of this._myDevilerySkulls) {
            skull.pp_getComponent(DevilerSkullComponent).release();
            this._myDevilerySkullPools.releaseObject(skull);
        }

        this._myDevilerySkulls.pp_clear();

        for (let weapon of this._myWeapons) {
            this._myWeaponPools.releaseObject(weapon);
        }

        this._myWeapons.pp_clear();
    }

    deviler(weaponType, first = false) {
        let randomSkull = this._myDevilerySkullPools.getObject(Math.pp_randomInt(0, this._myDevilerySkullsTypes.length - 1));

        let weapon = this._myWeaponPools.getObject(weaponType);

        randomSkull.pp_setActive(true);
        weapon.pp_setActive(true);

        randomSkull.pp_getComponent(DevilerSkullComponent).deviler(weapon, weaponType, this.object.pp_getPosition(), first);

        this._myDevilerySkulls.push(randomSkull);
        this._myWeapons.push(weapon);
    }

    killAllSkulls() {
        let skulls = this._myDevilerySkulls.pp_clone();
        for (let skull of skulls) {
            skull.pp_getComponent(EnemyComponent).die();
        }
    }
}