import { Component } from "@wonderlandengine/api";
import { CloneUtils } from "../../../pp";
import { GameGlobals } from "../game_globals";
import { WeaponComponent } from "./weapon_component";

export class DevilerSkullComponent extends Component {
    static TypeName = "deviler-skull";
    static Properties = {
    };

    deviler(weapon, weaponType) {
        this._myWeapon = weapon;
        this._myReleased = false;

        // set parent as pivot
        this._myWeapon.pp_resetTransformLocal();
    }

    release() {
        if (!this._myReleased) {
            this._myReleased = true;
            if (this._myWeapon == null && GameGlobals.myDebugEnabled) {
                this._myWeapon = this.object.pp_getComponent(WeaponComponent).object;
            }

            this._myWeapon.pp_getComponent(WeaponComponent)?.release();

            this._myWeapon = null;
        }
    }

    despawn() {
        GameGlobals.myDevileryBoss.devilerySkullDespawn(this.object);
    }

    start() {
        this._myStarted = false;
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
        this.release();
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}