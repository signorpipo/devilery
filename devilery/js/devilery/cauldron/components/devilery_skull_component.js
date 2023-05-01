import { Component } from "@wonderlandengine/api";
import { CloneUtils, vec3_create } from "../../../pp";
import { GameGlobals } from "../game_globals";
import { WeaponComponent, WeaponType } from "./weapon_component";

export class DevilerSkullComponent extends Component {
    static TypeName = "deviler-skull";
    static Properties = {
    };

    deviler(weapon, weaponType, devilerBossPosition) {
        this._myWeapon = weapon;
        this._myReleased = false;

        this._myWeapon.pp_setParent(this._myWeaponTargets[weaponType]);
        this._myWeapon.pp_resetTransformLocal();

        this.object.pp_setPosition(devilerBossPosition.vec3_add(
            vec3_create(Math.pp_random(-5, 5), Math.pp_random(-5, 5), Math.pp_random(-5, 5))));
        this.object.pp_rotateAroundAxis(Math.pp_random(0, 360), GameGlobals.myUp, this._myZero);

        //GameGlobals.mySkullParticlesSpawner.spawn(this.object.pp_getPosition());
    }

    release() {
        if (!GameGlobals.myStarted) return;

        if (!this._myReleased) {
            this._myReleased = true;
            this._myWeapon.pp_getComponent(WeaponComponent).release();
            this._myWeapon = null;
        }
    }

    despawn() {
        //GameGlobals.mySkullParticlesSpawner.spawn(this.object.pp_getPosition());
        GameGlobals.myDevileryBoss.devilerySkullDespawn(this.object);
    }

    start() {
        this._myStarted = false;
        this._myZero = vec3_create();
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
        this._myReleased = true;
        if (GameGlobals.myDebugEnabled) {
            this._myReleased = false;
        }
    }

    _update(dt) {

    }

    onActivate() {
        this._myStarted = false;
    }

    onDeactivate() {
        if (this._myStarted) {
            this.release();
        }
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }

    pp_clonePostProcess(clonedComponent) {
        clonedComponent._myWeaponTargets = [];
        let targets = clonedComponent.object.pp_getObjectByName("Weapon Skull Targets");

        clonedComponent._myWeaponTargets[WeaponType.APPLE] = targets.pp_getObjectByName("Apple Target");
        clonedComponent._myWeaponTargets[WeaponType.BAT] = targets.pp_getObjectByName("Bat Target");
        clonedComponent._myWeaponTargets[WeaponType.SKULL] = targets.pp_getObjectByName("Skull Target");
        clonedComponent._myWeaponTargets[WeaponType.VOICE] = targets.pp_getObjectByName("Voice Target");
    }
}