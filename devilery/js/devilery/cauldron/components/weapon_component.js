import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { CloneUtils, Globals, vec3_create } from "../../../pp";
import { GameGlobals } from "../game_globals";

export let WeaponType = {
    APPLE: 0,
    BAT: 1,
    SKULL: 2,
    VOICE: 3
};

export class WeaponComponent extends Component {
    static TypeName = "weapon";
    static Properties = {
        _myWeapon: Property.enum(["Apple", "Bat", "Skull", "Voice"], "Apple"),
        _myAmmo: Property.int(0)
    };

    start() {
        this._myStarted = false;
        this._myPosition = vec3_create();

        this._myReleaseVelocity = vec3_create(0, 2.5, 0);
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

    shot() {
        let shotOk = true;

        if (this._myWeapon == 3) {
            shotOk = false
            if (this.object.pp_getUp().vec3_angle(GameGlobals.myUp) &&
                this.object.pp_getPosition().vec3_distance(Globals.getPlayerObjects().myHead.pp_getPosition()) < 0.4) {
                shotOk = true;
            }
        }

        if (shotOk) {
            if (this._myCurrentAmmo > 0 || this._myAmmo < 0) {
                GameGlobals.myBulletSpawners[this._myWeapon].shot(this._myExitTarget);
                this._myCurrentAmmo--;
                GameGlobals.myShotParticlesSpawner.spawn(this._myExitTarget.pp_getPosition());
            }
        }
    }

    _start() {
        this._myCurrentAmmo = this._myAmmo;
        this._myPhysX = this.object.pp_getComponent(PhysXComponent);

        this._myExitTarget = this.object.pp_getObjectByName("Exit Target");
    }

    _update(dt) {
        if (this.object.pp_getPosition(this._myPosition)[1] < -100) {
            GameGlobals.myDevileryBoss.weaponDespawn(this.object);
        }
    }

    release() {
        this.object.pp_setParent(Globals.getSceneObjects().myDynamics);
        this._myPhysX.kinematic = false;
        this._myPhysX.linearVelocity = this._myReleaseVelocity;
    }

    onActivate() {
        this._myStarted = false;
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}