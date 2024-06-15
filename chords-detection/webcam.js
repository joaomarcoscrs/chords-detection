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

export function snapshotUrl(videoElement, canvasElement) {
  const dataURL = snapshot(videoElement, canvasElement).toDataURL();

  // Convert the data URL to a Blob
  const blob = dataURLtoBlob(dataURL);

  return URL.createObjectURL(blob);
}

export function snapshotB64(videoElement, canvasElement) {
  const dataURL = snapshot(videoElement, canvasElement).toDataURL();

  // Extract the Base64 portion of the data URL
  const base64Data = dataURL.split(',')[1];

  // Return the Base64 encoded image data
  return base64Data;
}



function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}