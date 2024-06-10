function buildFretMapping(fretboardKeypoints) {
  const orderedFretboardKeypoints = fretboardKeypoints.sort((keypoint1, keypoint2) => keypoint1.class_name.localeCompare(keypoint2.class_name));

  return orderedFretboardKeypoints.reduce((mapping, keypoint, index) => {
    const fretIndex = parseInt(index / 2, 10);
    const fretInfo = mapping[fretIndex] || { top: null, bottom: null, index: fretIndex, angle: null };

    if (index % 2 === 0) {
      fretInfo.bottom = keypoint;
    } else {
      fretInfo.top = keypoint;
    }

    if (fretInfo.top && fretInfo.bottom) {
      fretInfo.angle = Math.atan2(fretInfo.top.y - fretInfo.bottom.y, fretInfo.top.x - fretInfo.bottom.x);
    }

    mapping[fretIndex] = fretInfo;

    return mapping;
  }, {});
}

function buildStringsMapping(stringsKeypoints) {
  const orderedStringsKeypoints = stringsKeypoints.sort((keypoint1, keypoint2) => keypoint1.class_name.localeCompare(keypoint2.class_name));

  return orderedStringsKeypoints.reduce((mapping, keypoint, index) => {
    const stringIndex = parseInt(index / 2, 10);
    const stringInfo = mapping[stringIndex] || { start: null, end: null, index: stringIndex, angle: null };

    if (index % 2 === 0) {
      stringInfo.end = keypoint;
    } else {
      stringInfo.start = keypoint;
    }

    if (stringInfo.start && stringInfo.end) {
      stringInfo.angle = Math.atan2(stringInfo.end.y - stringInfo.start.y, stringInfo.end.x - stringInfo.start.x);
    }

    return mapping;
  }, {});
}

export function buildFretboardInfo(fretboardKeypoints, stringsKeypoints) {
  return {
    frets: buildFretMapping(fretboardKeypoints),
    strings: buildStringsMapping(stringsKeypoints)
  }
}

function calculateFretX(fret, y) {
  return fret.bottom.x + (y - fret.bottom.y) / Math.tan(fret.angle);
}

function isBetweenFrets(fret1, fret2, x, y) {
  const fret1X = calculateFretX(fret1, y);
  const fret2X = calculateFretX(fret2, y);

  return x >= fret1X && x <= fret2X;
}

function findPreviousFret(fretboardInfo, x, y) {
  const { frets } = fretboardInfo;

  for (let fretIndex = 0; fretIndex < Object.keys(frets).length - 1; fretIndex++) {
    const fret = frets[fretIndex];
    const nextFret = frets[fretIndex + 1];

    if (isBetweenFrets(fret, nextFret, x, y)) {
      return fret;
    }
  }

  return frets[Object.keys(frets).length - 1];
}

function calculateStringY(string, x) {
  return string.start.y + (x - string.start.x) / Math.tan(string.angle);
}

function isBetweenStrings(string1, string2, x, y) {
  const string1Y = calculateStringY(string1, x);
  const string2Y = calculateStringY(string2, x);

  return y >= string1Y && y <= string2Y;
}

function closestString(string1, string2, x, y) {
  const string1Y = calculateStringY(string1, x);
  const string2Y = calculateStringY(string2, x);

  return Math.abs(y - string1Y) < Math.abs(y - string2Y) ? string1 : string2;
}

function findString(fretboardInfo, x, y) {
  const { strings } = fretboardInfo;

  for (let stringIndex = 0; stringIndex < Object.keys(strings).length - 1; stringIndex++) {
    const string = strings[stringIndex];
    const nextString = strings[stringIndex + 1];

    if (isBetweenStrings(string, nextString, x, y)) {
      return closestString(string, nextString, x, y);
    }
  }

  // Its either the first or the last string
  return closestString(strings[0], strings[Object.keys(strings).length - 1], x, y);
}

export function findFretboardPosition(fretboardInfo, x, y) {
  const string = findString(fretboardInfo, x, y);
  const previousFret = findPreviousFret(fretboardInfo, x, y);

  return {
    string,
    previousFret
  };
}