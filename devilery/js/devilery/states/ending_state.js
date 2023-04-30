import { Globals } from "../../pp";

export class EndingState {
    constructor() {
        this._myWhiteRoom = Globals.getScene().pp_getObjectByName("White Room");
    }

    start(fsm) {

    }

    update(dt, fsm) {

    }
}