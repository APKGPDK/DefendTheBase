import * as BABYLON from 'babylonjs'

BABYLON.PhysicsImpostor.prototype.unregisterOnPhysicsCollide = function (collideAgainst, func) {
    var collidedAgainstList = collideAgainst instanceof Array ? collideAgainst : [collideAgainst];
    var index = -1;
    var found = this._onPhysicsCollideCallbacks.some(function (cbDef: any, idx: number) {
        if (cbDef.callback === func && cbDef.otherImpostors.length === collidedAgainstList.length) {
            // chcek the arrays match
            var sameList = cbDef.otherImpostors.every(function (impostor: BABYLON.PhysicsImpostor) {
                return collidedAgainstList.indexOf(impostor) > -1;
            });
            if (sameList) {
                index = idx;
            }
            return sameList;
        }
        return false;
    });
    if (found) {
        this._onPhysicsCollideCallbacks.splice(index, 1);
    }
    else {
        BABYLON.Tools.Warn("Function to remove was not found");
    }
}; 