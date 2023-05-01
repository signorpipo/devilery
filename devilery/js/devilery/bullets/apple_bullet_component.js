import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { CloneUtils, PhysicsCollisionCollector, Timer, vec3_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class AppleBulletComponent extends Component {
    static TypeName = "apple-bullet";
    static Properties = {
        _myStrength: Property.float(1)
    };

    start() {
        this._myStarted = false;
        this._myTimerAutoDestroy = new Timer(4, false);
        this._myPosition = vec3_create();
        this._myLinearVelocity = vec3_create();
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
        this._myPhysX = this.object.pp_getComponent(PhysXComponent);
        this._myCollisionsCollector = new PhysicsCollisionCollector(this._myPhysX);
        this._myTimerAutoDestroy.reset();
        this._myDone = false;

        this._myWaitFrame = 2;
    }

    _update(dt) {
        if (this._myDone) return;

        if (this._myWaitFrame > 0) {
            this._myWaitFrame--;
            if (this._myWaitFrame == 0) {
                this._myPhysX.kinematic = false;
                this._myPhysX.linearVelocity = this._myLinearVelocity;
                this._myPhysX.angularVelocity = vec3_create(Math.pp_random(-3, 3), Math.pp_random(-3, 3), Math.pp_random(-3, 3));
            }
        }

        if (!this._myTimerAutoDestroy.isRunning()) {
            this._myCollisionsCollector.update(dt);

            let collisionsStart = this._myCollisionsCollector.getCollisionsStart();
            if (collisionsStart.length > 0) {
                this._myTimerAutoDestroy.start();
            }
        } else {
            this._myTimerAutoDestroy.update(dt);
            if (this._myTimerAutoDestroy.isDone()) {
                this.done();
            }
        }

        if (!this._myDone) {
            if (this.object.pp_getPosition(this._myPosition)[1] < -50) {
                this.done();
            }
        }
    }

    done() {
        this._myDone = true;

        GameGlobals.myShotParticlesSpawner.spawn(this.object.pp_getPosition());

        for (let bulletSpawner of GameGlobals.myBulletSpawners) {
            bulletSpawner.despawnBullet(this.object);
        }
    }

    shot(referenceObject) {
        this.object.pp_setPosition(referenceObject.pp_getPosition());
        this._myLinearVelocity.vec3_copy(referenceObject.pp_getForward().vec3_scale(this._myStrength));
    }

    onDeactivate() {
        if (this._myPhysX) {
            this._myPhysX.kinematic = true;
        }
    }

    onActivate() {
        this._myStarted = false;
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}