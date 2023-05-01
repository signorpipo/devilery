import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { EvilPointComponent } from "./evil_point_component";
import { PhysicsCollisionCollector } from "../../../pp";
import { WeaponType } from "./weapon_component";
import { GameGlobals } from "../game_globals";

export class DevileryConsoleComponent extends Component {
    static TypeName = "devilery-console";
    static Properties = {
        _myEvilTargetReceiver: Property.object()
    };

    start() {
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
    }

    stopDevileryConsole() {

    }

    _increaseEvil(evilPoint) {
        evilPoint.die();
        this._myEvilTotal = Math.min(this._myEvilTotal + 0.2, 10);

        // increase evil visually
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
            // decrease evil visually

            ok = true;

            GameGlobals.myDevileryBoss.deviler(itemType);
            // heart broken se lo fa da solo
        }

        return ok;
    }
}