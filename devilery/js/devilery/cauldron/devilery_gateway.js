import { Component, Property } from "@wonderlandengine/api";
import { initDevilery } from "./init_devilery";
import { GameGlobals } from "./game_globals";
import { Globals } from "../../pp";
import { Devilery } from "./devilery";

let _alreadyRegisteredEngines = [];

export class DevileryGatewayComponent extends Component {
    static TypeName = "devilery-gateway";
    static Properties = {
        _myDebugEnabled: Property.bool(false),
        _mySkipIntro: Property.bool(false),
    };

    static onRegister(engine) {
        if (!_alreadyRegisteredEngines.includes(engine)) {
            _alreadyRegisteredEngines.push(engine)
            initDevilery(engine);
        }
    }

    start() {
        GameGlobals.myDebugEnabled = this._myDebugEnabled && Globals.isDebugEnabled();
        GameGlobals.mySkipIntro = this._mySkipIntro && Globals.isDebugEnabled();

        this._myDevilery = new Devilery();

        this._myStartCounter = 10;
    }

    update(dt) {
        if (this._myStartCounter > 0) {
            this._myStartCounter--;
            if (this._myStartCounter == 0) {
                this._start();
            }
        } else {
            this._myDevilery.update(dt);
        }
    }

    _start() {
        this._myDevilery.start();
    }
}