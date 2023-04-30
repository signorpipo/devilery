import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils, Timer } from "../../../pp";
import { GameGlobals } from "../game_globals";

export class EnemyComponent extends Component {
    static TypeName = "enemy";
    static Properties = {
        _myEnemy: Property.object()
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
        this._myTimerDie = new Timer(Math.pp_random(3, 4), Math.pp_randomInt(0, 5) == 0);
    }

    _update(dt) {
        if (GameGlobals.myRandomEnemyDie) {
            this._myTimerDie.update(dt);
            if (this._myTimerDie.isJustDone()) {
                this.die();
            }
        }
    }

    onActivate() {
        this._myStarted = false;
    }

    delovery() {
        GameGlobals.myShip.enemyDespawn(this._myEnemy);
        GameGlobals.myHeartsParticlesSpawner.spawn(this.object.pp_getPosition());
    }

    die() {
        GameGlobals.myShip.enemyDespawn(this._myEnemy);
        GameGlobals.myEnemyDieParticlesSpawner.spawn(this.object.pp_getPosition());
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