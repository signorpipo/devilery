import { Component, Property } from "@wonderlandengine/api";

export class BuyHandComponent extends Component {
    static TypeName = "buy-hand";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left")
    };
}