export function getClassPrediction(predictions, className) {
  return predictions.find((prediction) => prediction.class === className);
}