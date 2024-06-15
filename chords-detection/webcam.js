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

export function snapshotB64(videoElement, canvasElement) {
  const dataURL = snapshot(videoElement, canvasElement).toDataURL();

  // Extract the Base64 portion of the data URL
  const base64Data = dataURL.split(',')[1];

  // Return the Base64 encoded image data
  return base64Data;
}