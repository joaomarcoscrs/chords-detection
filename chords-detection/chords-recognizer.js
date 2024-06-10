import { buildFretboardInfo } from "./guitar";
import { buildHandInfo } from "./hand"
import { notesBeingPlayed } from "./note-recognizer";
import { getClassPrediction } from "./utils/predictions"

const NOTE_VALUE_MAPPING = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};

function mostFrequentNote(notes) {
  let maxCount = 0;
  let mostFrequent = null;

  notes.forEach((note) => {
    const count = notes.filter((n) => n === note).length;

    if (count > maxCount) {
      maxCount = count;
      mostFrequent = note;
    }
  });

  return mostFrequent;
}

function findTonic(notes) {
  const noteWithThirdMajor = notes.find((note) => notes.includes((note + 4) % 12));
  if (noteWithThirdMajor) return noteWithThirdMajor;

  const noteWithFifth = notes.find((note) => notes.includes((note + 7) % 12));
  if (noteWithFifth) return noteWithFifth;

  const notesWithThirdMinor = notes.filter((note) => notes.includes((note + 3) % 12));
  if (notesWithThirdMinor.length === 1) return notesWithThirdMinor[0];

  // returns the note that appears the most in the notes array
  return mostFrequentNote(notes);
}

function chordFromNotes(notes) {
  // notes is an array of every note being played. From that we need to infer which is the tonic note
  // and what chord it is.

  if (notes.length < 3) return null;

  const tonic = findTonic(notes);

  const isNine = notes.includes((tonic + 2) % 12);
  const isMinor = notes.includes((tonic + 3) % 12);
  const isMajor = notes.includes((tonic + 4) % 12) && !isMinor;
  const isSus4 = notes.includes((tonic + 5) % 12);
  const isDiminished = notes.includes((tonic + 6) % 12);
  const isAugmented = notes.includes((tonic + 8) % 12);
  const isSixth = notes.includes((tonic + 9) % 12);
  const isSeventh = notes.includes((tonic + 10) % 12);
  const isMajorSeventh = notes.includes((tonic + 11) % 12);

  let chord = NOTE_VALUE_MAPPING[tonic];

  if (isMinor) chord += "m";

  if (isDiminished) chord += "dim";

  if (isSeventh) chord += "7";

  if (isDiminished) return chord;

  if (isAugmented) chord += "aug";

  if (isSixth) chord += "6";

  if (isMajorSeventh && isMajor) chord += "maj7";

  if (isNine && isMajor) chord += "9";

  if (isSus4 && isMajor) chord += "sus4";

  return chord;
}


export const identifyChord = (predictions) => {
  console.log('predictions', predictions)

  const handPrediction = getClassPrediction(predictions, 'hand');
  const guitarNeckPrediction = getClassPrediction(predictions, 'guitar-neck');
  const stringsPrediction = getClassPrediction(predictions, 'strings');

  if (!handPrediction || !guitarNeckPrediction || !stringsPrediction) {
    return null;
  }

  const handInfo = buildHandInfo(handPrediction.keypoints);
  console.log('handInfo', handInfo)

  const fretboardInfo = buildFretboardInfo(guitarNeckPrediction.keypoints, stringsPrediction.keypoints);
  console.log('fretboardInfo', fretboardInfo)

  const notes = notesBeingPlayed(fretboardInfo, handInfo);

  return chordFromNotes(notes)
}