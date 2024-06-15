export function getClassPrediction(predictions, className) {
  return predictions.find((prediction) => prediction.class === className);
}



export function drawPredictions(canvas, predictions) {
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through predictions
  predictions.forEach(prediction => {
    // Draw bounding box
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(prediction.x, prediction.y, prediction.width, prediction.height);

    // Draw keypoints
    prediction.keypoints.forEach(keypoint => {
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw class label
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(prediction.class, prediction.x, prediction.y - 5);
  });
}