import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { PhysicsCollisionCollector } from "../../../pp";
import { GameGlobals } from "../game_globals";
import { EvilPointComponent } from "./evil_point_component";
import { WeaponType } from "./weapon_component";

export class DevileryConsoleComponent extends Component {
    static TypeName = "devilery-console";
    static Properties = {
        _myEvilTargetReceiver: Property.object(),
        _myBar1: Property.object(),
        _myBar2: Property.object(),
        _myBar3: Property.object(),
        _myBar4: Property.object(),
        _myBar5: Property.object(),
        _myBar6: Property.object(),
        _myBar7: Property.object(),
        _myBar8: Property.object()
    };

    start() {
        this._myStarted = false;

        this._myBars = [];
        this._myBars.push(this._myBar1);
        this._myBars.push(this._myBar2);
        this._myBars.push(this._myBar3);
        this._myBars.push(this._myBar4);
        this._myBars.push(this._myBar5);
        this._myBars.push(this._myBar6);
        this._myBars.push(this._myBar7);
        this._myBars.push(this._myBar8);
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
        this._myEvilTotal = 0;

        this._myEvilTargetReceiverPhysX = this._myEvilTargetReceiver.pp_getComponent(PhysXComponent);
        this._myCollisionsCollector = new PhysicsCollisionCollector(this._myEvilTargetReceiverPhysX);
    }

    _update(dt) {
        this._myCollisionsCollector.update(dt);

        let collisionsStart = this._myCollisionsCollector.getCollisionsStart();
        for (let collisionStart of collisionsStart) {
            let evilPoint = collisionStart.pp_getComponent(EvilPointComponent);
            if (evilPoint != null) {
                this._increaseEvil(evilPoint);
            }
        }
    }

    startDevileryConsole() {
        this._myEvilTotal = 0;

        for (let i = 0; i < this._myBars.length; i++) {
            this._myBars[i].pp_setActive(false);
        }
    }

    stopDevileryConsole() {

    }

    _increaseEvil(evilPoint) {
        evilPoint.die();
        this._myEvilTotal = Math.min(this._myEvilTotal + 0.2, 8);

        this._updateBars();
    }

    buy(itemType) {
        let ok = false;

        let cost = 0;
        switch (itemType) {
            case WeaponType.BAT:
                cost = 2;
                break;
            case WeaponType.SKULL:
                cost = 4;
                break;
            case WeaponType.VOICE:
                cost = 8;
                break;
            default:
                cost = 0;
        }

        if (cost <= this._myEvilTotal || GameGlobals.myAllFree) {
            this._myEvilTotal -= cost;

            this._updateBars();

            ok = true;

            GameGlobals.myDevileryBoss.deviler(itemType);
        }

        return ok;
    }

    _updateBars() {
        for (let i = 0; i < this._myBars.length; i++) {
            this._myBars[i].pp_setActive(false);
        }

        for (let i = 0; i < Math.floor(this._myEvilTotal); i++) {
            this._myBars[i].pp_setActive(true);
        }
    }
}