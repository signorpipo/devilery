import { Globals } from "../../../../pp/globals";

let _myGlobalGravityAccelerations = new WeakMap();
let _myGlobalGravityDirections = new WeakMap();

export function getGlobalGravityAcceleration(engine = Globals.getMainEngine()) {
    return _myGlobalGravityAccelerations.get(engine);
}

export function setGlobalGravityAcceleration(globalGravityAcceleration, engine = Globals.getMainEngine()) {
    _myGlobalGravityAccelerations.set(engine, globalGravityAcceleration);
}

export function removeGlobalGravityAcceleration(engine = Globals.getMainEngine()) {
    _myGlobalGravityAccelerations.delete(engine);
}

export function hasGlobalGravityAcceleration(engine = Globals.getMainEngine()) {
    return _myGlobalGravityAccelerations.has(engine);
}

export function getGlobalGravityDirection(engine = Globals.getMainEngine()) {
    return _myGlobalGravityDirections.get(engine);
}

export function setGlobalGravityDirection(globalGravityDirection, engine = Globals.getMainEngine()) {
    _myGlobalGravityDirections.set(engine, globalGravityDirection);
}

export function removeGlobalGravityDirection(engine = Globals.getMainEngine()) {
    _myGlobalGravityDirections.delete(engine);
}

export function hasGlobalGravityDirection(engine = Globals.getMainEngine()) {
    return _myGlobalGravityDirections.has(engine);
}