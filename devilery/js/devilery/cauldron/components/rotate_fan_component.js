import { Component, Property } from "@wonderlandengine/api";
import { vec3_create } from "../../../pp";

export class RotateFanComponent extends Component {
    static TypeName = "rotate-fan";
    static Properties = {
        _mySpeed: Property.float(100)
    };

    start() {
        this._myAxis = vec3_create(1, 0, 0);
    }

    update(dt) {
        let speed = this._mySpeed;
        this.object.pp_rotateAxisLocal(-speed * dt, this._myAxis);
    }
}