export function buildHandInfo(handKeypoints) {
  const orderedKeypoints = handKeypoints.sort((keypoint1, keypoint2) => keypoint1.class_name.localeCompare(keypoint2.class_name));

  return orderedKeypoints.reduce((mapping, keypoint, index) => {
    const fingerIndex = parseInt(index / 4, 10);

    const fingerInfo = mapping[fingerIndex] || { top: null, bottom: null, topArt: null, bottomArt: null, index: fingerIndex };

    if (index % 4 === 0) {
      fingerInfo.bottom = keypoint;
    } else if (index % 4 === 1) {
      fingerInfo.bottomArt = keypoint;
    } else if (index % 4 === 2) {
      fingerInfo.top = keypoint;
    } else {
      fingerInfo.topArt = keypoint;
    }

    mapping[fingerIndex] = fingerInfo;

    return mapping;
  }, {});
}