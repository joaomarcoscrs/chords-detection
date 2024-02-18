const publishable_key = '%PUBLISHABLE_KEY%'

const availableModels = [
  {
    model: 'paperrockscissorsv3',
    version: '3',
  },
  {
    model: 'piedra-papel-o-tijeras',
    version: '6',
    resultMap: {
      'papel': 'paper',
      'piedra': 'rock',
      'tijera': 'scissors',
    }
  },
]

async function getModel() {
  var model = await roboflow
  .auth({publishable_key})
  .load(availableModels[0]);

  return model.configure({
    threshold: 0.3,
    max_objects: 1,
  });
}

var initialized_model = getModel();

function detect(imageElement) {
  return initialized_model.then(function (model) {
    return model.detect(imageElement).then(function (predictions) {
      console.log("Predictions", predictions)
      return predictions
    });
  });
}
