const publishable_key = '%PUBLISHABLE_KEY%'

const translation = {
  'papel': 'paper',
  'piedra': 'rock',
  'tijera': 'scissors',
}

const availableModels = [
  {
    model: 'rock-paper-scissors-sxsw',
    version: '11',
  }
  {
    model: 'paperrockscissorsv3',
    version: '3',
  },
  {
    model: 'piedra-papel-o-tijeras',
    version: '6',
  },
]

async function getModel(modelConfig) {
  var model = await roboflow
  .auth({publishable_key})
  .load(modelConfig);

  return model.configure({
    threshold: 0.4,
    max_objects: 1,
  });
}

var initialized_models = [
  getModel(availableModels[0]),
  // getModel(availableModels[1]),
]

function detect(imageElement, model_index = 0) {
  return initialized_models[model_index].then(function (model) {
    return model.detect(imageElement).then(function (predictions) {
      console.log("Predictions", predictions)
      predictions.forEach(prediction => {
        const classLowerCase = prediction.class.toLowerCase()
        prediction.class = translation[classLowerCase] || classLowerCase
      })
      return predictions
    });
  });
}
