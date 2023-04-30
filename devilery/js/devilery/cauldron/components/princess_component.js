import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { PhysicsCollisionCollector } from "../../../pp";
import { EnemyComponent } from "./enemy_component";
import { GameGlobals } from "../game_globals";

export class PrincessComponent extends Component {
    static TypeName = "princess";
    static Properties = {
    };

    start() {
        this._myDelovery = 0;

        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
        this._myCollisionsCollector = new PhysicsCollisionCollector(this._myPhysX, true);
    }

    update(dt) {
        this._myCollisionsCollector.update(dt);

        let collisionsStart = this._myCollisionsCollector.getCollisionsStart();
        for (let collisionStart of collisionsStart) {
            let enemy = collisionStart.pp_getComponent(EnemyComponent);
            if (enemy != null) {
                this.delovery(enemy);
            }
        }
    }

    startPrincess() {
        this._myDelovery = 0;
    }

    delovery(enemy) {
        enemy.delovery();

        this._myDelovery++;
    }

    isInLove() {
        return this._myDelovery > 10 && !GameGlobals.myNeverInLove;
    }
}