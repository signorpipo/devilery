import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils } from "../../../pp";
import { GameGlobals } from "../game_globals";

export class EnemyComponent extends Component {
    static TypeName = "enemy";
    static Properties = {
        _myEnemy: Property.object()
    };

    delovery() {
        GameGlobals.myShip.enemyDespawn(this._myEnemy);
        GameGlobals.myHeartsParticlesSpawner.spawn(this.object.pp_getPosition());
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }

    pp_clonePostProcess(clonedComponent) {
        let parent = clonedComponent.object.pp_getParent();
        while (parent != null && !parent.pp_getName().includes("Bird")) {
            parent = parent.pp_getParent();
        }

        clonedComponent._myEnemy = parent;
    }
}