import { Component, Property } from "@wonderlandengine/api";

export class BulletSpawnerComponent extends Component {
    static TypeName = "bullet-spawner";
    static Properties = {
        _myBullet: Property.object()
    };

    shot(referenceObject) {

    }

    start() {
        this._myStarted = false;
        this._myBulletStarted = false;

        this._myZero = vec3_create();

        this._myBulletPools = new ObjectPoolsManager();
        this._myBullets = [];
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

    _update(dt) {
        if (this._myBulletStarted) {

        }
    }

    startBulletSpawner() {
        this._myBulletStarted = true;
    }

    stopBulletSpawner() {
        this._myBulletStarted = false;

        for (let bullet of this._myBullets) {
            this._myBulletPools.releaseObject(bullet);
        }

        this._myBullets.pp_clear();
    }

    _start() {
        let poolParams = new ObjectPoolParams();

        poolParams.myInitialPoolSize = 10;
        poolParams.myPercentageToAddWhenEmpty = 1;

        this._myEnemyPools.addPool(0, this._myBullet, poolParams);
    }
}