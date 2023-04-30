import { Component, Property } from "@wonderlandengine/api";
import { GameGlobals } from "../game_globals";
import { NumberOverValue, vec3_create } from "../../../pp";
import { WeaponComponent } from "./weapon_component";

export class GoToTargetComponent extends Component {
    static TypeName = "go-to-target";
    static Properties = {
        _myIsPrincess: Property.bool(true)
    };

    init() {
    }

    start() {
        this._myStarted = false;

        this._myCurrentForward = vec3_create(0, 0, 1);
        this._myTargetForward = vec3_create(0, 0, 1);

        this._myTargetSpeed = 0;
        this._myTargetPositions = [];
        this._myCurrentTargetIndex = 0;

        this._myNextTargetDistance = 0;

        this._myMaxSpeed = 5;
        this._myCurrentSpeed = this._myMaxSpeed;
        this._mySlowDown = true;
        this._mySpeedUp = true;

        this._myTimer = 0;

        this._myTurnSpeed = 100;

        this._myWeaponReleased = false;
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
        // Implemented outside class definition
    }

    _update(dt) {
        // Implemented outside class definition
    }

    pp_clone(targetObject) {
        let clonedComponent = CloneUtils.cloneComponentBase(this, targetObject);

        return clonedComponent;
    }
}



GoToTargetComponent.prototype._update = function () {
    let currentPosition = vec3_create();

    let targetPosition = vec3_create();
    let targetForward = vec3_create();

    let rotationAxis = vec3_create();

    let movementVector = vec3_create();
    return function _update(dt) {
        if (this._myCurrentTargetIndex == this._myTargetPositions.length) return;

        this._myTimer += dt;

        this.object.pp_getPosition(currentPosition);

        targetPosition.vec3_copy(this._myTargetPositions[this._myCurrentTargetIndex][0]);
        targetForward = targetPosition.vec3_sub(currentPosition, targetForward).vec3_normalize(targetForward);
        if (!targetForward.vec3_isZero()) {
            this._myTargetForward.vec3_copy(targetForward);
        }

        let angleToTarget = this._myCurrentForward.vec3_angle(this._myTargetForward);
        if (angleToTarget > Math.PP_EPSILON * 10) {
            rotationAxis = this._myCurrentForward.vec3_cross(this._myTargetForward, rotationAxis).vec3_normalize(rotationAxis);
            let angleToTargetSigned = this._myCurrentForward.vec3_angleSigned(this._myTargetForward, rotationAxis);
            let angleToPerform = this._myTurnSpeed * dt;
            if (angleToPerform > Math.abs(angleToTargetSigned)) {
                angleToPerform = angleToTargetSigned;
            } else {
                angleToPerform *= Math.pp_sign(angleToTargetSigned);
            }

            this._myCurrentForward.vec3_rotateAxis(angleToPerform, rotationAxis, this._myCurrentForward);
        }

        this.object.pp_setUp(GameGlobals.myUp, this._myCurrentForward);

        let movement = this._myCurrentSpeed.get(this._myTimer) * dt;
        this.object.pp_translate(this._myCurrentForward.vec3_scale(movement, movementVector));

        this.object.pp_getPosition(currentPosition);

        let nextTargetDistance = this._myTargetPositions[this._myCurrentTargetIndex][1];
        let distanceToTarget = currentPosition.vec3_distance(targetPosition);


        if (!this._myWeaponReleased) {
            if (distanceToTarget < nextTargetDistance && this._myCurrentTargetIndex == 1) {
                this._myWeaponReleased = true;
                this.object.pp_getComponent(WeaponComponent)?.release();
            }
        }

        if (distanceToTarget <= nextTargetDistance) {
            this._myCurrentTargetIndex++;
        } else if (!this._mySlowDown || (this._myCurrentTargetIndex >= 1 && this._myTargetPositions.length > 2 &&
            distanceToTarget <= this._myTargetPositions[this._myCurrentTargetIndex - 1][1] * 1.5)) {
            if (this._mySlowDown) {
                this._mySlowDown = false;

                this._myTargetSpeed = this._myMaxSpeed / 3;
                this._myCurrentSpeed = new NumberOverValue(this._myCurrentSpeed.get(this._myTimer), this._myTargetSpeed, 0, 0.75);
                this._myTimer = 0;
            } else if (this._mySpeedUp && this._myCurrentSpeed.get(this._myTimer) == this._myTargetSpeed &&
                this._myCurrentTargetIndex >= 2) {
                this._mySpeedUp = false;

                this._myTargetSpeed = this._myMaxSpeed;
                this._myCurrentSpeed = new NumberOverValue(this._myCurrentSpeed.get(this._myTimer), this._myTargetSpeed, 0, 1);
                this._myTimer = 0;
            }
        }
    };
}();

GoToTargetComponent.prototype._start = function () {
    let currentPosition = vec3_create();
    let targetPosition = vec3_create();

    let bestTargetPosition = vec3_create();
    let worstTargetPosition = vec3_create();

    let startForward = vec3_create();

    let toWorst = vec3_create();
    let toWorstFlat = vec3_create();
    let toWorstRotationAxis = vec3_create();
    return function _start() {
        this.object.pp_getPosition(currentPosition);

        let bestTargetObject = null;
        let worstTargetObject = null;
        for (let windowTarget of GameGlobals.myWindowsTargets) {
            if (bestTargetObject == null) {
                bestTargetObject = windowTarget;
                bestTargetObject.pp_getPosition(bestTargetPosition);
            } else {
                windowTarget.pp_getPosition(targetPosition);
                if (targetPosition.vec3_distance(currentPosition) < bestTargetPosition.vec3_distance(currentPosition)) {
                    bestTargetObject = windowTarget;
                    bestTargetPosition.vec3_copy(targetPosition);
                }
            }
            if (worstTargetObject == null) {
                worstTargetObject = windowTarget;
                worstTargetObject.pp_getPosition(worstTargetPosition);
            } else {
                windowTarget.pp_getPosition(targetPosition);
                if (targetPosition.vec3_distance(currentPosition) > worstTargetPosition.vec3_distance(currentPosition)) {
                    worstTargetObject = windowTarget;
                    worstTargetPosition.vec3_copy(targetPosition);
                }
            }
        }

        let nextTargetDistanceAverage = 2;
        let nextTargetDistance = nextTargetDistanceAverage + Math.pp_random(-nextTargetDistanceAverage / 2, nextTargetDistanceAverage / 2);

        let turnSpeed = 100;
        this._myTurnSpeed = turnSpeed + Math.pp_random(-turnSpeed / 4, turnSpeed / 6);

        bestTargetObject.pp_getPosition(bestTargetPosition);
        bestTargetPosition.vec3_sub(currentPosition, startForward).vec3_normalize(startForward);

        this._myTargetForward.vec3_copy(startForward);
        this._myCurrentForward.vec3_copy(startForward);

        this._myTargetPositions.push([bestTargetObject.pp_getPosition(), nextTargetDistance]);
        if (this._myIsPrincess) {
            this._myTargetPositions.push([GameGlobals.myPrincessTarget.pp_getPosition(), 0.2]);
        } else {
            this._myTargetPositions.push([GameGlobals.myWeaponTarget.pp_getPosition(), 0.2]);
            this._myTargetPositions.push([worstTargetObject.pp_getPosition(), nextTargetDistance]);

            this._myTargetPositions[2][0].vec3_sub(this._myTargetPositions[1][0], toWorst).vec3_removeComponentAlongAxis(GameGlobals.myUp, toWorstFlat).vec3_normalize(toWorstFlat);

            toWorstRotationAxis = toWorstFlat.vec3_cross(toWorst, toWorstRotationAxis).vec3_normalize(toWorstRotationAxis);
            toWorstFlat.vec3_rotateAxis(-15, toWorstRotationAxis, toWorstFlat);

            this._myTargetPositions.push([this._myTargetPositions[2][0].vec3_add(toWorstFlat.vec3_scale(1000, toWorstFlat)), nextTargetDistance]);
        }

        this.object.pp_setUp(GameGlobals.myUp, this._myCurrentForward);

        this._myCurrentSpeed = this._myMaxSpeed;
        this._myTargetSpeed = this._myCurrentSpeed;
    };
}();