import { Component, Property } from "@wonderlandengine/api";

export class BulletComponent extends Component {
    static TypeName = "bullet-component";
    static Properties = {
    };

    die() {
        GameGlobals.myShotParticlesSpawner.spawn(this.object.pp_getPosition());

        for (let bulletSpawner of GameGlobals.myBulletSpawners) {
            bulletSpawner.despawnBullet(this.object);
        }
    }
}