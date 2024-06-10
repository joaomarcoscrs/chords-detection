export async function startWebcam(videoElement) {
  try {
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
      }
    });
  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
}

export function snapshot(videoElement, canvasElement) {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  var ctx = canvasElement.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  return canvasElement;
};