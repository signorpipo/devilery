import { Component, Property } from "@wonderlandengine/api";
import { vec3_create } from "../../../pp";

export class RotateFanComponent extends Component {
    static TypeName = "rotate-fan";
    static Properties = {
    };

    start() {
        this._myAxis = vec3_create(0, 0, 1);
    }

    update(dt) {
        let speed = 100;
        this.object.pp_rotateAxis(speed * dt, this._myAxis);
    }
}