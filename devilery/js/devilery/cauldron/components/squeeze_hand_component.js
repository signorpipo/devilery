import { Component, Property } from "@wonderlandengine/api";
import { GamepadButtonID, Globals, InputUtils } from "../../../pp";

export class SqueezeHandsComponents extends Component {
    static TypeName = "squeeze-hands";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myNormalHand: Property.object(),
        _mySqueezeHand: Property.object()
    };

    update(dt) {
        if (Globals.getGamepad(InputUtils.getHandednessByIndex(this._myHandedness)).getButtonInfo(GamepadButtonID.SQUEEZE).isPressed()) {
            this._myNormalHand.pp_setActive(false);
            this._mySqueezeHand.pp_setActive(true);
        } else {
            this._myNormalHand.pp_setActive(true);
            this._mySqueezeHand.pp_setActive(false);
        }
    }
}