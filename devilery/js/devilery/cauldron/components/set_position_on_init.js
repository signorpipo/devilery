import { Component, Property } from "@wonderlandengine/api";

export class SetPositionOnInit extends Component {
    static TypeName = "set-position-on-init";
    static Properties = {
        _myObjectPosition: Property.object()
    };

    init() {
        if (this.active) {
            let position = this._myObjectPosition.pp_getPosition();
            this.object.pp_setPosition(position);
        }
    }
}