import { Component, Property } from "@wonderlandengine/api";

export class DevileryBossComponent extends Component {
    static TypeName = "devilery-boss";
    static Properties = {
    };

    start() {
        this._myStarted = false;
        this._myDevileryBossStarted = false;
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
    }

    _update(dt) {
        if (this._myDevileryBossStarted) {

        }
    }

    startDevileryBoss() {
        this._myDevileryBossStarted = true;

        // random position
    }

    stopDevileryBoss() {
        this._myDevileryBossStarted = false;

        // reset all enemies to pool
    }

    deviler(itemType) {

    }
}