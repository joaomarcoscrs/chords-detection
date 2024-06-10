import { drawTimeline } from './chords-timeline.js';
import { startWebcam, snapshot } from './webcam.js';

const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const results = ref([])
    const chords = ref([])
    const timelineElement = ref(null);
    const videoElement = ref(null);
    const canvasElement = ref(null);
    const clickSoundElement = ref(null);
    const timerInterval = ref(null);
    const elapsedTime = ref(0);
    const isTimelineEmpty = ref(true);

    const bpm = 60; // Beats per minute
    const interval = 1000 / (bpm / 60); // Interval between each beat in milliseconds

    function playClickSound() {
      if (!clickSoundElement.value) return;

      clickSoundElement.value.play();
    }

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
        if (!timelineElement.value) return;
        isTimelineEmpty.value = false;

        const _snapshot = snapshot(videoElement.value, canvasElement.value)
        drawTimeline(timelineElement.value, elapsedTime.value, bpm);
        playClickSound();
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

    // Starts webcam on mounted
    onMounted(() => {
      startWebcam(videoElement.value)
    })

    return {
      timelineElement,
      videoElement,
      canvasElement,
      clickSoundElement,
      results,
      timerInterval,
      elapsedTime,
      isTimelineEmpty,
      play,
      handleDetectClick,
    }
  },
}).mount('#app')
