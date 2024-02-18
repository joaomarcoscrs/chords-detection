const choices = {
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors',
}
const outcomes = {
  me: "me",
  other: "other",
  draw: "draw",
  fail: "fail",
}

function randomChoice(choices) {
  const keys = Object.keys(choices)
  var index = Math.floor(Math.random() * keys.length)
  return keys[index]
}

let stream;

async function startWebcam(videoElement) {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
}

var snapshot = function(videoElement, canvasElement) {
  canvasElement.width = 400;
  canvasElement.height = 300;
  var ctx = canvasElement.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  return canvasElement;
};

function winner(me, other) {
  if (!choices[me]) {
    return outcomes.fail
  }
  if (me == other) {
    return outcomes.draw
  }
  if (me == choices.rock && other == choices.paper) {
    return outcomes.other
  }
  if (me == choices.rock && other == choices.scissors) {
    return outcomes.me
  }
  if (me == choices.paper && other == choices.rock) {
    return outcomes.me
  }
  if (me == choices.paper && other == choices.scissors) {
    return outcomes.other
  }
  if (me == choices.scissors && other == choices.rock) {
    return outcomes.other
  }
  if (me == choices.scissors && other == choices.paper) {
    return outcomes.me
  }
}

function resultClasses(result, player) {
  var resultClass = (
    ['fail', 'draw'].includes(result) ? result : result == player ? 'win' : 'lose'
  )
  return [
    resultClass, 'border-2', 'border-solid'
  ]
}

const { createApp, ref } = Vue

createApp({
  setup() {
    const results = ref([])
    const count = ref(0)
    const state = ref('waiting')

    function startCountdown() {
      this.state = 'countdown'
      this.count = 1
      const interval = setInterval(() => {
        this.count--
        if (this.count == 0) {
          clearInterval(interval)
          play(this.$refs.videoElement, this.$refs.canvasElement)
        }
      }, 1000)
    }

    function play(videoElement, canvasElement) {
      const _snapshot = snapshot(videoElement, canvasElement)
      state.value = "done"

      detect(_snapshot).then((predictions) => {
        const me = predictions.length > 0 && predictions[0].class || null
        const other = randomChoice(choices)
        results.value.unshift({
          me,
          other,
          result: winner(me, other),
          snapshot: _snapshot.toDataURL('image/jpg'),
        })
      })
    }

    return {
      count,
      play,
      results,
      resultClasses,
      state,
      startCountdown,
      startWebcam,
    }
  },
  mounted() {
    this.startWebcam(this.$refs.videoElement)
  }
}).mount('#app')
