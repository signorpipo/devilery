import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { Globals, vec3_create } from "../../../pp";

export class WeaponComponent extends Component {
    static TypeName = "weapon";
    static Properties = {
    };

    start() {
        this._myStarted = false;

        this._myReleaseVelocity = vec3_create(0, 2.5, 0);
    }

    update(dt) {
        if (!GameGlobals.myStarted) return;

        if (!this._myStarted) {
            this._start();

            this._myStarted = true;
        } else {
            //this._update(dt);
        }
    }

    _start() {
        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
    }

    release() {
        this.object.pp_setParent(Globals.getSceneObjects().myDynamics);
        this._myPhysX.kinematic = false;
        this._myPhysX.linearVelocity = this._myReleaseVelocity;
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}