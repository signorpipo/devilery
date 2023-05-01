import { Component, Property } from "@wonderlandengine/api";
import { GameGlobals } from "../game_globals";
import { Globals, NumberRangeOverValue, ObjectPoolParams, ObjectPoolsManager, Timer, vec3_create } from "../../../pp";
import { EnemyComponent } from "./enemy_component";

export class ShipComponent extends Component {
    static TypeName = "ship";
    static Properties = {
    };

    start() {
        this._myStarted = false;
        this._myShipStarted = false;

        this._mySpeed = 2.5;

        this._myZero = vec3_create();

        this._mySpawnObject = GameGlobals.myScene.pp_getObjectByName("Enemy Spawn");

        this._myEnemyPools = new ObjectPoolsManager();
        this._myEnemyTimers = [];
        this._myEnemyTimersDurations = [];
        this._myEnemyStartTimers = [];

        this._myEnemies = [];

        this._myTimers = [];
    }

    update(dt) {
        if (!GameGlobals.myStarted) return;

        if (!this._myStarted) {
            this._start();

            this._myStarted = true;
        } else {
            this._update(dt * 1);
        }
    }

    _update(dt) {
        if (this._myShipStarted) {
            this.object.pp_rotateAroundAxis(this._mySpeed * dt, GameGlobals.myUp, this._myZero);

            this._updateStartTimers(dt);
            this._updateTimers(dt);
        }
    }

    startShip() {
        this._myShipStarted = true;

        this.object.pp_rotateAroundAxis(Math.pp_random(0, 360), GameGlobals.myUp, this._myZero);

        this._myTimer = 0;

        this._myEnemyStartTimers = [];
        this._myEnemyStartTimers[EnemyType.NORMAL_BIRD] = new Timer(Math.pp_random(5, 7));
        this._myEnemyStartTimers[EnemyType.STRONG_BIRD] = new Timer(Math.pp_random(50, 60) + this._myEnemyStartTimers[EnemyType.NORMAL_BIRD].getDuration());
        this._myEnemyStartTimers[EnemyType.SHIELD_BIRD] = new Timer(Math.pp_random(120, 140) + this._myEnemyStartTimers[EnemyType.STRONG_BIRD].getDuration());

        this._myEnemyTimers = [];
        this._myEnemyTimers[EnemyType.NORMAL_BIRD] = new Timer(0);
        this._myEnemyTimers[EnemyType.STRONG_BIRD] = new Timer(0);
        this._myEnemyTimers[EnemyType.SHIELD_BIRD] = new Timer(0);

        this._myEnemyTimersDurations = [];
        this._myEnemyTimersDurations[EnemyType.NORMAL_BIRD] = new NumberRangeOverValue([8, 12], [4, 8], 0, 200);
        this._myEnemyTimersDurations[EnemyType.STRONG_BIRD] = new NumberRangeOverValue([20, 24], [8, 12], 0, 200);
        this._myEnemyTimersDurations[EnemyType.SHIELD_BIRD] = new NumberRangeOverValue([20, 24], [14, 18], 0, 200);

        this._myTimers = [];
        this._myTimers[EnemyType.NORMAL_BIRD] = 0;
        this._myTimers[EnemyType.STRONG_BIRD] = 0;
        this._myTimers[EnemyType.SHIELD_BIRD] = 0;
    }

    stopShip() {
        this._myShipStarted = false;

        for (let enemy of this._myEnemies) {
            this._myEnemyPools.releaseObject(enemy);
        }

        this._myEnemies.pp_clear();
    }

    enemyDespawn(enemy) {
        this._myEnemyPools.releaseObject(enemy);
        this._myEnemies.pp_removeEqual(enemy);
    }

    _updateTimers(dt) {
        for (let key in EnemyType) {
            let type = EnemyType[key];
            if (this._myEnemyStartTimers[type].isDone()) {
                this._myTimers[type] += dt;

                this._myEnemyTimers[type].update(dt);
                if (this._myEnemyTimers[type].isDone()) {
                    this._myEnemyTimers[type].start(this._myEnemyTimersDurations[type].get(this._myTimers[type]));

                    this._spawnEnemy(type);
                }
            }
        }
    }

    _updateStartTimers(dt) {
        for (let startTimer of this._myEnemyStartTimers) {
            startTimer.update(dt);
        }
    }

    _spawnEnemy(type) {
        let enemy = this._myEnemyPools.getObject(type);

        let randomPosition = this._mySpawnObject.pp_getPosition();
        randomPosition.vec3_add(this._mySpawnObject.pp_getForward().vec3_scale(Math.pp_random(-5, 5)), randomPosition);
        randomPosition.vec3_add(this._mySpawnObject.pp_getUp().vec3_scale(Math.pp_random(-5, 5)), randomPosition);

        enemy.pp_setPosition(randomPosition);
        enemy.pp_setActive(true);

        this._myEnemies.push(enemy);
    }

    _start() {
        let poolParams = new ObjectPoolParams();

        poolParams.myInitialPoolSize = 10;
        poolParams.myPercentageToAddWhenEmpty = 1;

        let normalBird = GameGlobals.myScene.pp_getObjectByName("Normal Bird");
        this._myEnemyPools.addPool(EnemyType.NORMAL_BIRD, normalBird, poolParams);

        let strongBird = GameGlobals.myScene.pp_getObjectByName("Strong Bird");
        this._myEnemyPools.addPool(EnemyType.STRONG_BIRD, strongBird, poolParams);

        let shieldlBird = GameGlobals.myScene.pp_getObjectByName("Shield Bird");
        this._myEnemyPools.addPool(EnemyType.SHIELD_BIRD, shieldlBird, poolParams);
    }

    killAllEnemies() {
        let enemies = this._myEnemies.pp_clone();
        for (let enemy of enemies) {
            enemy.pp_getComponent(EnemyComponent).die();
        }
    }
}

export let EnemyType = {
    NORMAL_BIRD: 0,
    STRONG_BIRD: 1,
    SHIELD_BIRD: 2
}