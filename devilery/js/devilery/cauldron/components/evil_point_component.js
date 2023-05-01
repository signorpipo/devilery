import { Component, Property } from "@wonderlandengine/api";
import { CloneUtils } from "../../../pp";

export class EvilPointComponent extends Component {
    static TypeName = "evil-point";
    static Properties = {
    };

    die() {
        GameGlobals.myEvilPointSpawner.evilPointDespawn(this.object);
        GameGlobals.myEvilPointReceivedParticlesSpawner.spawn(this.object.pp_getPosition());
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}