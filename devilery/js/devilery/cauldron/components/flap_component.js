import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils, NumberOverValue, vec3_create } from "../../../pp";

export class FlapComponent extends Component {
    static TypeName = "flap";
    static Properties = {
    };

    start() {
        this._myTimer = 0;
        this._myRealTimer = 0;
        this._myTranslation = vec3_create();

        this._myMultiplier = 5;
        this._myPreviousFlap = 0;

        this._myFalling = false;
        this._myFlapped = false;

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
        this.object.pp_resetPositionLocal();
    }

    _update(dt) {
        this._myRealTimer += dt;
        this._myTimer += dt * this._myMultiplier.get(this._myRealTimer);
        this.object.pp_resetPositionLocal();

        let flap = Math.sin(this._myTimer) * 0.75;
        this._myTranslation.vec3_set(0, flap, 0);
        this.object.pp_setPositionLocal(this._myTranslation);

        if (flap < this._myPreviousFlap) {
            this._myFalling = true;
        }

        if (this._myFalling && flap > this._myPreviousFlap) {
            this._myMultiplier = new NumberOverValue(Math.pp_random(9, 11), 5, this._myRealTimer, this._myRealTimer + Math.pp_random(0.4, 0.6));
            this._myFalling = false;
        }

        this._myPreviousFlap = flap;
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}