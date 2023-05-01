import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils } from "../../../pp";

export class BulletComponent extends Component {
    static TypeName = "bullet";
    static Properties = {
    };

    die() {
        GameGlobals.myShotParticlesSpawner.spawn(this.object.pp_getPosition());

        for (let bulletSpawner of GameGlobals.myBulletSpawners) {
            bulletSpawner.despawnBullet(this.object);
        }
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}