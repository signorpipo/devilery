import { Component, Property } from "@wonderlandengine/api";
import { initDevilery } from "../init_devilery";
import { GameGlobals } from "../game_globals";
import { Globals, PlayerLocomotionComponent } from "../../../pp";
import { Devilery } from "../devilery";

let _alreadyRegisteredEngines = [];

export class DevileryGatewayComponent extends Component {
    static TypeName = "devilery-gateway";
    static Properties = {
        _myDebugEnabled: Property.bool(false),
        _mySkipIntro: Property.bool(false),
        _myClearConsoleOnStart: Property.bool(true),
        _myNeverInLove: Property.bool(false),
        _myRandomEnemyDie: Property.bool(false),
        _myAllFree: Property.bool(false),

        _myStartDelayFrames: Property.int(0)
    };

    static onRegister(engine) {
        if (!_alreadyRegisteredEngines.includes(engine)) {
            _alreadyRegisteredEngines.push(engine)
            initDevilery(engine);
        }
    }

    start() {
        GameGlobals.myScene = this.object;

        GameGlobals.myDebugEnabled = this._myDebugEnabled && Globals.isDebugEnabled();
        GameGlobals.mySkipIntro = this._mySkipIntro && Globals.isDebugEnabled();
        GameGlobals.myNeverInLove = this._myNeverInLove && Globals.isDebugEnabled();
        GameGlobals.myRandomEnemyDie = this._myRandomEnemyDie && Globals.isDebugEnabled();
        GameGlobals.myAllFree = this._myAllFree && Globals.isDebugEnabled();

        this._myDevilery = new Devilery();

        this._myStartCounter = this._myStartDelayFrames;
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
        if (this._myClearConsoleOnStart) {
            console.clear();
        }

        this._myDevilery.start();

        GameGlobals.myStarted = true;
    }
}