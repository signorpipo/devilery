import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { PhysicsCollisionCollector, vec3_create } from "../../../pp";
import { GameGlobals } from "../game_globals";
import { EnemyComponent } from "./enemy_component";

export class PrincessComponent extends Component {
    static TypeName = "princess";
    static Properties = {
        _myBar: Property.object(),
        _myMinBar: Property.object(),
        _myMaxBar: Property.object()
    };

    start() {
        this._myDelovery = 0;

        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
        this._myCollisionsCollector = new PhysicsCollisionCollector(this._myPhysX, true);

        this._myMax = this._myMaxBar.pp_getScaleLocal()[2];
        this._myMin = this._myMinBar.pp_getScaleLocal()[2];
    }

    update(dt) {
        this._myCollisionsCollector.update(dt);

        let collisionsStart = this._myCollisionsCollector.getCollisionsStart();
        for (let collisionStart of collisionsStart) {
            let enemy = collisionStart.pp_getComponent(EnemyComponent);
            if (enemy != null && enemy._myType != 3) {
                this.delovery(enemy);
            }
        }
    }

    startPrincess() {
        this._myBar.pp_resetScaleLocal();
        this._myDelovery = 0;
    }

    stopPrincess() {
        this._myBar.pp_resetScaleLocal();
    }

    delovery(enemy) {
        enemy.delovery();

        this._myDelovery = Math.min(10, this._myDelovery + 1);

        this._myBar.pp_setScaleLocal(vec3_create(1, 1, this._myMin + (this._myMax - this._myMin) * (this._myDelovery / 10)));
    }

    isInLove() {
        return this._myDelovery >= 10 && !GameGlobals.myNeverInLove;
    }
}