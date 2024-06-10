const publishableKey = '%PUBLISHABLE_KEY%'

const MODEL = {
  model: 'rock-paper-scissors-sxsw',
  version: '11',
}

async function roboflowModel(modelConfig = MODEL) {
  var model = await roboflow
    .auth({ publishableKey })
    .load(modelConfig);

  return model.configure({
    threshold: 0.4,
    max_objects: 1,
  });
}

var initialized_models = [
  roboflowModel(),
]

function detect(imageElement) {
  return roboflowModel().then(function (model) {
    return model.detect(imageElement).then(function (predictions) {
      console.log("predictions", predictions)

      return predictions
    });
  });
}
