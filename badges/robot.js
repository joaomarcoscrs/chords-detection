const publishable_key = 'rf_Rwjz1tAdDeX2Je6rC13z0sK2EN43'

const availableModels = [
  {
    model: 'roboflow-badges',
    version: '2',
  },
]

async function getModel(modelConfig) {
  var model = await roboflow
  .auth({publishable_key})
  .load(modelConfig);

  return model.configure({
    threshold: 0.65,
  });
}

var initialized_models = [
  getModel(availableModels[0]),
]

function detect(videoElement, model_index = 0) {
  return initialized_models[model_index].then(function (model) {
    return model.detect(videoElement).then(function (predictions) {
      if (predictions.length > 0) {
        console.log("Predictions", JSON.stringify(predictions))
      }
      return predictions
    });
  });
}
