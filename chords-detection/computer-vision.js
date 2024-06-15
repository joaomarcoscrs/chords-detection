const publishableKey = '%PUBLISHABLE_KEY%'
const apiKey = '%API_KEY%'

const MODEL = {
  // model: 'guitar-chords-daewp',
  // version: '1',
  model: 'rock-paper-scissors-sxsw',
  version: '11',
}

async function roboflowModel(modelConfig = MODEL) {
  var model = await roboflow
    .auth({ publishable_key: publishableKey })
    .load(modelConfig);

  model.configure({
    threshold: 0.4,
  });

  return model;
}

var initialized_models = [
  roboflowModel(),
]

function detect(imageElement) {
  return roboflowModel().then(function (model) {
    return model.detect(imageElement).then(function (predictions) {
      return predictions
    });
  });
}

const detectKeypoints = async (imageB64) => {
  try {
    const response = await fetch("http://127.0.0.1:1234/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_base_64: imageB64,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch keypoints');
    }

    return response.json();
  } catch (error) {
    console.error('Error detecting keypoints:', error);
    throw error; // Propagate the error further
  }
};

