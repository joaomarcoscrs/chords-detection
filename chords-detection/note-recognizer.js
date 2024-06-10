import { findFretboardPosition } from "./guitar.js";
import { isBarre } from "./finger-gesture.js";

const DEFAULT_TUNING = {
  0: 4,
  1: 11,
  2: 7,
  3: 2,
  4: 9,
  5: 4,
}

function noteForKeypoint(fretboardInfo, keypoint, tuning = DEFAULT_TUNING) {
  const { string, previousFret } = findFretboardPosition(fretboardInfo, keypoint.x, keypoint.y);

  const fretIndex = previousFret.index;
  const stringIndex = string.index;

  return (tuning[stringIndex] + fretIndex) % 12;
}

export function notesBeingPlayed(fretboardInfo, handInfo, tuning = DEFAULT_TUNING) {
  return Object.keys(handInfo).map((fingerIndex) => {
    // TODO: Use isBarre function to check if the finger is playing multiple notes with a barre.
    // Despite having implemented the isBarre function, I didnt use it here because we also need
    // to exclude the notes that are being muted by other fingers in frets after the barre.
    const keypoint = handInfo[fingerIndex].top;

    return noteForKeypoint(fretboardInfo, keypoint, tuning);
  });
}