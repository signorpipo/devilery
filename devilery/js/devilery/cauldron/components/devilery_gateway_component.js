import { Component, Property } from "@wonderlandengine/api";
import { initDevilery } from "../init_devilery";
import { GameGlobals } from "../game_globals";
import { GamepadButtonID, Globals, PlayerLocomotionComponent, XRUtils } from "../../../pp";
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
        _myFastDevilery: Property.bool(false),

        _myStartDelayFrames: Property.int(0)
    };

    static onRegister(engine) {
        if (!_alreadyRegisteredEngines.includes(engine)) {
            _alreadyRegisteredEngines.push(engine)
            initDevilery(engine);
        }
    }

    init() {
        GameGlobals.myGoogleAnalytics = window.gtag != null;
    }

    start() {
        GameGlobals.myScene = this.object;

        GameGlobals.myDebugEnabled = this._myDebugEnabled && Globals.isDebugEnabled();
        GameGlobals.mySkipIntro = this._mySkipIntro && Globals.isDebugEnabled();
        GameGlobals.myNeverInLove = this._myNeverInLove && Globals.isDebugEnabled();
        GameGlobals.myRandomEnemyDie = this._myRandomEnemyDie && Globals.isDebugEnabled();
        GameGlobals.myAllFree = this._myAllFree && Globals.isDebugEnabled();
        GameGlobals.myFastDevilery = this._myFastDevilery && Globals.isDebugEnabled();

        this._myDevilery = new Devilery();

        this._myStartCounter = this._myStartDelayFrames;

        this._myButtonPressed = false;

        XRUtils.registerSessionStartEventListener(this, this._onXRSessionStart.bind(this));
    }

    update(dt) {
        if (this._myStartCounter > 0) {
            this._myStartCounter--;
            if (this._myStartCounter == 0) {
                this._start();
            }
        } else {
            this._myDevilery.update(dt);

            if (XRUtils.isSessionActive()) {
                if (!this._myButtonPressed) {
                    if (Globals.getLeftGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd() || Globals.getLeftGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressEnd() ||
                        Globals.getRightGamepad().getButtonInfo(GamepadButtonID.SELECT).isPressEnd() || Globals.getRightGamepad().getButtonInfo(GamepadButtonID.SQUEEZE).isPressEnd()) {
                        this._myButtonPressed = true;
                        if (GameGlobals.myGoogleAnalytics) {
                            gtag("event", "button_pressed", {
                                "value": 1
                            });
                        }
                    }
                }
            }
        }
    }

    _start() {
        if (this._myClearConsoleOnStart) {
            console.clear();
        }

        this._myDevilery.start();

        GameGlobals.myStarted = true;
    }

    _onXRSessionStart() {
        if (GameGlobals.myGoogleAnalytics) {
            gtag("event", "enter_vr", {
                "value": 1
            });
        }
    }
}