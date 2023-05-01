import { Component, Property } from "@wonderlandengine/api";
import { Globals, ObjectPoolParams, ObjectPoolsManager } from "../../../pp";
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

        this._myDevilerySkullsTypes = Globals.getScene().pp_getObjectByName("Devilery Skulls").pp_getChildren();

        let poolParams = new ObjectPoolParams();

        poolParams.myInitialPoolSize = 10;
        poolParams.myPercentageToAddWhenEmpty = 1;

        for (let i = 0; i < this._myDevilerySkullsTypes.length; i++) {
            this._myDevilerySkullPools.addPool(i, this._myDevilerySkullsTypes[i], poolParams);
        }

        this._myWeaponPools = new ObjectPoolsManager();
        this._myWeapons = [];

        let weaponTypes = Globals.getScene().pp_getObjectByName("Weapons");

        this._myWeaponPools.addPool(WeaponType.APPLE, weaponTypes.pp_getObjectByName("Apple Gun"), poolParams);
        this._myWeaponPools.addPool(WeaponType.BAT, weaponTypes.pp_getObjectByName("Bat Gun"), poolParams);
        this._myWeaponPools.addPool(WeaponType.SKULL, weaponTypes.pp_getObjectByName("Skull Gun"), poolParams);
        this._myWeaponPools.addPool(WeaponType.VOICE, weaponTypes.pp_getObjectByName("Voice Gun"), poolParams);
    }

    _update(dt) {
        if (this._myDevileryBossStarted) {

        }
    }

    startDevileryBoss() {
        this._myDevileryBossStarted = true;
    }

    stopDevileryBoss() {
        this._myDevileryBossStarted = false;

        for (let skull of this._myDevilerySkulls) {
            this._myDevilerySkullPools.releaseObject(skull);
        }

        this._myDevilerySkulls.pp_clear();

        for (let weapon of this._myWeapons) {
            this._myWeaponPools.releaseObject(weapon);
        }

        this._myWeapons.pp_clear();
    }

    deviler(weaponType) {
        let randomSkull = this._myDevilerySkullPools.getObject(Math.pp_randomInt(0, this._myDevilerySkullsTypes.length - 1));

        let weapon = this._myWeaponPools.getObject(weaponType);

        randomSkull.deviler(weapon);
        randomSkull.pp_setActive(true);

        this._myDevilerySkulls.push(randomSkull);
        this._myWeapons.push(weapon);
    }
}