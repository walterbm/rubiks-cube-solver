"use strict";

// Globals

var active = [];
var activeCount = 0;
var pivot = new THREE.Object3D();
var rotateAxis = "";
var rotateAxisSign = 0;
var rotateDouble = false;
var rotateFullCube = false;
var rotateMoveSign = 0;
var rotateSign = 0;
var rotateTwoLayer = false;

// Public methods

function rotateBegin(move) {
    // If true then moves are being replayed (ok button clicked) and the we've
    // reached the point where the user is.
    var endOfReplay = (moveHistoryNextLast != -1) && (moveHistoryNext >= moveHistoryNextLast);
    
    if ((move == "|") || endOfReplay) {
        // Avoid actually doing the move in the following cases 1) It's a mark,
        // in which case there is no actual moving to do. 2) The user has
        // clicked ok in the info dialog in which case we don't want to replay
        // moves after and including moveHistoryNext.
        moveHistory.push(move);
        if (!endOfReplay) {
            // End reached.
            moveHistoryNext++;
        }
        return;
    }
    var moveBase = move[0];
    var moveFace = moveBase.toUpperCase();
    var args = eventToRotation[moveFace];
    if (!args) {
        return;
    }

    args = args.slice(); // Copy so the original is not changed.

    // Parse the rest of the turn now that we know it's valid.
    rotateAxisSign = args[0] == '+' ? 1 : -1;
    rotateAxis = args[1];
    rotateTwoLayer = moveBase != moveFace;
    rotateDouble = move.indexOf("2") !== -1;
    rotateMoveSign = move.indexOf("'") === -1 ? 1 : -1;
    rotateSign = rotateAxisSign * rotateMoveSign;

    if (rotateTwoLayer && args[2] && (args[2] == args[3])) {
        // If the args are non-zero and the same then that means
        // that alt was pressed with for one of the sides. In
        // this case a double move is done by extending the
        // limits so that the origin is included.
        if (args[2] < 0) {
            args[3] = 0;
        } else {
            args[2] = 0;
        }
    }

    // The entire cube is being rotated.
    rotateFullCube = (args[2] == -1) && (args[3] == 1);

    // Convert the -1, 0, 1 placement along the axes to limits
    // given the cubieOff between them. The limits are inclusive.
    args[2] = cubiesOff * args[2] - 1; // Lower limit, so 1 before.
    args[3] = cubiesOff * args[3] + 1; // Lower limit, so 1 after.
    inRangeRotate.apply(this, args);

    // True if this move is an undo - don't add it to the move history.
    var undo = move.indexOf("G") !== -1;
    if (!undo) {
        if (moveHistoryNext < moveHistory.length) {
            // Some moves have been undone. Discard the part of the move history
            // that is after this move - begin a new timeline.
            console.log("Discaring future move history.");
            moveHistory = moveHistory.slice(0, moveHistoryNext);
        }
        moveHistory.push(move);
        moveHistoryNext++;
    }
}

function rotateEnd() {
    for (var i = 0; i < active.length; i++) {
        THREE.SceneUtils.detach(active[i], pivot, scene);
    }

    active.length = 0;
    activeCount = 0;

    pivot.rotation.x = 0;
    pivot.rotation.y = 0;
    pivot.rotation.z = 0;
}

// Private methods

function inRangeRotate(axisSign, axisOfRot, limLo, limHi) {
    activeCount += 1;
    if (activeCount >= 2)
        return;
    for (var i = 0; i < cubies.length; i++) {
        var position = cubiesToVector3(cubies[i]);
        // The position coordinate being considered.
        var posCoord = position[axisOfRot];
        if (posCoord >= limLo && posCoord <= limHi) {
            active.push(cubies[i]);
        }
    }

    for (var i = 0; i < active.length; i++) {
        THREE.SceneUtils.attach(active[i], scene, pivot);
    }
    animateCondReq(true);
}
