function coordinatesDiff(keypoints, axis) {
  const diff = []

  for (let i = 0; i < keypoints.length - 1; i++) {
    const current = keypoints[i]
    const next = keypoints[i + 1]

    diff.push(next[axis] - current[axis])
  }
}

export function getClassKeypoint(keypoints, className) {
  return keypoints.find((keypoint) => keypoint.class_name === className);
}

export function lineAngles(keypoints) {
  const dx = coordinatesDiff(keypoints, 'x')
  const dy = coordinatesDiff(keypoints, 'y')

  const angles = []

  for (let i = 0; i < dx.length; i++) {
    angles.push(Math.atan2(dy[i], dx[i]))
  }
}