import { drawTimeline } from './chords-timeline.js';
import { startWebcam, snapshot, snapshotUrl, snapshotB64 } from './webcam.js';
import { identifyChord } from './chords-recognizer.js';
import { playElementSound } from './sound.js';

const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    // Refs to elements on page
    const timelineElement = ref(null);
    const videoElement = ref(null);
    const canvasElement = ref(null);
    const clickSoundElement = ref(null);
    const bleepSoundElement = ref(null);
    // Refs to data
    const chords = ref([]);
    const count = ref(0);
    const timerInterval = ref(null);
    const elapsedTime = ref(0);
    const isTimelineEmpty = ref(true);

    const bpm = 60; // Beats per minute
    const interval = 1000 / (bpm / 60); // Interval between each beat in milliseconds

    function startCountdown() {
      count.value = 3;
      playElementSound(bleepSoundElement.value);

      const countdownInterval = setInterval(() => {
        count.value--;
        if (count.value === 1) {
          startDetection();
        }
        if (count.value === 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
    }

    function handleDetectClick() {
      if (timerInterval.value) {
        stopDetection();
      } else {
        startCountdown();
      }
    }

    function startDetection() {
      if (timerInterval.value) return;

      timerInterval.value = setInterval(() => {
        elapsedTime.value++;
        if (!timelineElement.value) return;
        isTimelineEmpty.value = false;

        const predictionsPromise = getPredictions(snapshotB64(videoElement.value, canvasElement.value));

        predictionsPromise.then((predictions) => {
          chords.value.unshift(identifyChord(predictions.predictions));
        });

        playElementSound(clickSoundElement.value);

        drawTimeline(timelineElement.value, elapsedTime.value, bpm, chords.value);
      }, interval);
    }


    function stopDetection() {
      if (!timerInterval.value) return;

      clearInterval(timerInterval.value);

      timerInterval.value = null;
      elapsedTime.value = 0;
      chords.value = [];
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
      bleepSoundElement,
      count,
      chords,
      timerInterval,
      elapsedTime,
      isTimelineEmpty,
      handleDetectClick,
    }
  },
}).mount('#app')
