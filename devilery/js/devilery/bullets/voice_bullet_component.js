import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils, Globals, Timer, vec3_create } from "../../pp";
import { GameGlobals } from "../cauldron/game_globals";

export class VoiceBulletComponent extends Component {
    static TypeName = "voice-bullet";
    static Properties = {
        _myDuration: Property.float(1),
        _myKillSkull: Property.bool(true),
        _myStrength: Property.float(1)
    };

    start() {
        this._myRumbleTimer = new Timer(this._myDuration, false);
        this._myStarted = false;

        this._myRumbleHandle = Globals.getScene().pp_getObjectByName("Cameras");
        this._myTranslation = vec3_create(0, 0, 0);
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
        this._myKilled = false;
    }

    _update(dt) {
        if (this._myRumbleTimer.isRunning()) {
            this._myRumbleTimer.update(dt);
            if (this._myRumbleTimer.isDone()) {
                this._myRumbleHandle.pp_resetTransformLocal();
                this.done();
            } else {
                this._myRumbleHandle.pp_resetTransformLocal();
                let strength = this._myStrength;
                this._myTranslation.vec3_set(Math.pp_random(-strength, strength), Math.pp_random(-strength, strength), Math.pp_random(-strength, strength));
                this._myRumbleHandle.pp_translateLocal(this._myTranslation);
            }

            if (!this._myKilled && this._myRumbleTimer.getPercentage() > 0.1) {
                this._myKilled = true;
                GameGlobals.myShip.killAllEnemies();
                if (this._myKillSkull) {
                    GameGlobals.myDevileryBoss.killAllSkulls();
                }
            }
        }
    }

    done() {
        for (let bulletSpawner of GameGlobals.myBulletSpawners) {
            bulletSpawner.despawnBullet(this.object);
        }
    }

    shot() {
        this._myRumbleTimer.start();
    }

    onDeactivate() {
        if (this._myRumbleHandle != null) {
            this._myRumbleHandle.pp_resetTransformLocal();
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