const choices = {
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors',
}
const outcomes = {
  me: "me",
  other: "other",
  tie: "tie",
  unknown: "unknown",
}
const winMap = {
  rock: choices.scissors,
  scissors: choices.paper,
  paper: choices.rock,
}

function randomChoice(choices) {
  const keys = Object.keys(choices)
  var index = Math.floor(Math.random() * keys.length)
  return keys[index]
}

async function startWebcam(videoElement) {
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

var snapshot = function(videoElement, canvasElement) {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  var ctx = canvasElement.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  return canvasElement;
};

function winner(me, other) {
  if (!choices[me]) {
    return outcomes.unknown
  }
  if (me == other) {
    return outcomes.tie
  }
  return winMap[me] == other ? outcomes.me : outcomes.other
}

function resultClass(result, player) {
  if (result == outcomes.unknown) {
    return 'border-orange-400'
  }
  if (result == outcomes.tie) {
    return 'border-gray-400'
  }
  return result == player ? 'border-green-400' : 'border-red-400'
}

function resultMessage(winner) {
  if (winner == outcomes.unknown) {
    return "unknown"
  }
  if (winner == outcomes.tie) {
    return "tie"
  }
  if (winner == outcomes.me) {
    return "you won"
  }
  else {
    return "you lose"
  }
}

const { createApp, computed, ref } = Vue

createApp({
  setup() {
    const results = ref([])

    function play() {
      const {videoElement, canvasElement} = this.$refs
      const _snapshot = snapshot(videoElement, canvasElement)

      detect(_snapshot).then((predictions) => {
        const me = predictions.length > 0 && predictions[0].class || 'unknown'
        const other = randomChoice(choices)
        const _winner = winner(me, other)
        results.value.unshift({
          me,
          other,
          result: _winner,
          snapshot: _snapshot.toDataURL('image/jpg'),
          predictions: predictions,
          message: resultMessage(_winner)
        })
      })
    }

    return {
      play,
      results,
      resultClass,
      resultMessage,
      startWebcam,
      debugMessage (message) {
        alert(JSON.stringify(message, null, 2))
      },
    }
  },
  mounted() {
    this.startWebcam(this.$refs.videoElement)
  }
}).mount('#app')
