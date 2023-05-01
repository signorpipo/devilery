import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { CloneUtils, PhysicsCollisionCollector, Timer } from "../../../pp";
import { GameGlobals } from "../game_globals";
import { BulletComponent } from "./bullet_component";

export class DevilerSkullComponent extends Component {
    static TypeName = "deviler-skull";
    static Properties = {
        _myEnemy: Property.object(),
        _myHits: Property.int(1),
        _myType: Property.enum(["Normal", "Strong", "Shield"], "Normal"),
        _myShieldActiveTime: Property.float(1),
        _myShieldInactiveTime: Property.float(1),
        _myAmountEvil: Property.int(0)
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
        this._myTimerDie = new Timer(Math.pp_random(3, 4), Math.pp_randomInt(0, 0) == 0);

        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
        this._myCollisionsCollector = new PhysicsCollisionCollector(this._myPhysX);

        this._myCurrentHits = this._myHits;

        this._myNormalObject = this.object.pp_getObjectByName("Normal");
        this._myHurtObject = this.object.pp_getObjectByName("Hurt");
        this._myShieldObject = this.object.pp_getObjectByName("Shield");

        if (this._myNormalObject != null) {
            this._myNormalObject.pp_resetTransformLocal();
            this._myNormalObject.pp_setActive(true);
        }

        if (this._myHurtObject != null) {
            this._myHurtObject.pp_resetTransformLocal();
            this._myHurtObject.pp_setActive(false);
        }

        if (this._myShieldObject != null) {
            this._myShieldObject.pp_resetTransformLocal();
            this._myShieldObject.pp_setActive(false);
        }

        this._myTimerShieldActive = new Timer(this._myShieldActiveTime);
        this._myTimerShieldInactive = new Timer(this._myShieldInactiveTime);

        this._myShieldActive = false;
    }

    _update(dt) {
        if (GameGlobals.myRandomEnemyDie) {
            this._myTimerDie.update(dt);
            if (this._myTimerDie.isJustDone()) {
                this._hit();
                this._myTimerDie.start();
            }
        }

        if (this._myType == 2) {
            if (this._myShieldActive) {
                this._myTimerShieldActive.update(dt);
                if (this._myTimerShieldActive.isJustDone()) {
                    this._myShieldActive = false;
                    this._myShieldObject.pp_setActive(false);
                    this._myNormalObject.pp_setActive(true);
                    this._myTimerShieldInactive.start();
                }
            } else {
                this._myTimerShieldInactive.update(dt);
                if (this._myTimerShieldInactive.isJustDone()) {
                    this._myShieldActive = true;
                    this._myShieldObject.pp_setActive(true);
                    this._myNormalObject.pp_setActive(false);
                    this._myTimerShieldActive.start();
                }
            }
        }

        this._checkHit(dt);
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

        GameGlobals.myEvilPointSpawner.spawnEvilPoints(this._myAmountEvil, this.object.pp_getPosition());
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

    _checkHit(dt) {
        this._myCollisionsCollector.update(dt);

        let collisionsStart = this._myCollisionsCollector.getCollisionsStart();
        for (let collisionStart of collisionsStart) {
            let bullet = collisionStart.pp_getComponent(BulletComponent);
            if (bullet != null) {
                bullet.die();
                this._hit();
            }
        }
    }

    _hit() {
        if (!this._myShieldActive) {
            this._myCurrentHits--;
            if (this._myCurrentHits == 0) {
                this.die();
            } else if (this._myType == 1) {
                if (this._myHurtObject != null) {
                    this._myNormalObject.pp_setActive(false);
                    this._myHurtObject.pp_setActive(true);
                }
            }
        }
    }
}