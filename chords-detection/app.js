import { drawTimeline } from './chords-timeline.js';
import { startWebcam, snapshot } from './webcam.js';

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

const { createApp, ref } = Vue

createApp({
  setup() {
    const results = ref([])
    const timelineCanvas = ref(null);
    const timerInterval = ref(null);
    const elapsedTime = ref(0);

    const bpm = 60; // Beats per minute
    const interval = 1000 / (bpm / 60); // Interval between each beat in milliseconds

    function handleDetectClick() {
      if (timerInterval.value) {
        stopDetection();
      } else {
        startDetection();
      }
    }

    function startDetection() {
      if (timerInterval.value) return;

      timerInterval.value = setInterval(() => {
        elapsedTime.value++;
        if (!timelineCanvas.value) {
          console.log('Timeline canvas not ready yet');
        }
        drawTimeline(timelineCanvas.value, elapsedTime.value, bpm);
      }, interval);
    }


    function stopDetection() {
      if (!timerInterval.value) return;

      clearInterval(timerInterval.value);

      timerInterval.value = null;
      elapsedTime.value = 0;
    }

    function play() {
      const { videoElement, canvasElement } = this.$refs
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
      timelineCanvas,
      results,
      timerInterval,
      elapsedTime,
      play,
      handleDetectClick,
      resultClass,
      resultMessage,
      startWebcam,
      debugMessage(message) {
        alert(JSON.stringify(message, null, 2))
      },
    }
  },
  mounted() {
    this.startWebcam(this.$refs.videoElement)
  }
}).mount('#app')
