import { lineAngles } from "./utils/keypoints.js"

// Only the first and second fingers (index == 1 and middle == 2) are considered for barre chords.
// There is a detail: the second finger can be used as a barre only when the first finger is also a barre.
const BARRE_POSSIBLE_FINGERS = [1, 2];

// The maximum inclination (in radians) between two consecutive finger connections to be considered a barre gesture
const BARRE_MAX_INCLINATION = Math.PI / 9;


export function isBarre(keypoints, fingerIndex) {
  if (!BARRE_POSSIBLE_FINGERS.includes(fingerIndex)) return false

  if (!keypoints.length >= 3) return false

  const fingerAngles = lineAngles(keypoints, fingerIndex)

  const anglesDeltas = []

  for (let i = 0; i < fingerAngles.length - 1; i++) {
    anglesDeltas.push(Math.abs(fingerAngles[i + 1] - fingerAngles[i]))
  }

  return anglesDeltas.every((angleDelta) => angleDelta < BARRE_MAX_INCLINATION)
}