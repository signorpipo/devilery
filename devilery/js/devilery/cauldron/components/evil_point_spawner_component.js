import { Component } from "@wonderlandengine/api";
import { Globals, ObjectPoolParams, ObjectPoolsManager, vec3_create } from "../../../pp";
import { GameGlobals } from "../game_globals";

export class EvilPointSpawnerComponent extends Component {
    static TypeName = "evil-point-spawner";
    static Properties = {
    };

    start() {
        this._myStarted = false;

        this._myEvilPointPools = new ObjectPoolsManager();
        this._myEvilPoints = [];
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
        let poolParams = new ObjectPoolParams();

        poolParams.myInitialPoolSize = 10;
        poolParams.myPercentageToAddWhenEmpty = 1;

        this._myEvilPointsTypes = GameGlobals.myScene.pp_getObjectByName("Evil Points").pp_getChildren();

        for (let i = 0; i < this._myEvilPointsTypes.length; i++) {
            this._myEvilPointPools.addPool(i, this._myEvilPointsTypes[i], poolParams);
        }
    }

    _update(dt) {

    }

    evilPointDespawn(evilPoint) {
        this._myEvilPointPools.releaseObject(evilPoint);
        this._myEvilPoints.pp_removeEqual(evilPoint);
    }

    startEvilPointSpawner() {

    }

    stopEvilPointSpawner() {
        for (let evilPoint of this._myEvilPoints) {
            this._myEvilPointPools.releaseObject(evilPoint);
        }

        this._myEvilPoints.pp_clear();
    }

    spawnEvilPoints(amount, position) {
        for (let i = 0; i < amount; i++) {
            let evilPoint = this._myEvilPointPools.getObject(Math.pp_randomInt(0, this._myEvilPointsTypes.length - 1));

            let radius = 1;
            let randomPosition = position.vec3_clone();
            randomPosition.vec3_add(vec3_create(Math.pp_random(-radius, radius), Math.pp_random(-radius, radius), Math.pp_random(-radius, radius)), randomPosition);

            evilPoint.pp_setPosition(randomPosition);
            evilPoint.pp_setActive(true);

            this._myEvilPoints.push(evilPoint);
        }
    }
}