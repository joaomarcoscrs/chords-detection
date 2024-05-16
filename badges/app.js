const width = 640, height = 480;
const scalingRatio = 1, sx = 0, sy = 0;
const bounding_box_colors = {};
const color_choices = [
  "#C7FC00",
  "#FF00FF",
  "#8622FF",
  "#FE0056",
  "#00FFCE",
  "#FF8000",
  "#00B7EB",
  "#FFFF00",
  "#0E7AFE",
  "#FFABAB",
  "#0000FF",
  "#CCCCCC",
];

async function startWebcam(videoCanvas) {
  let webcamStream
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
      }
    });
  } catch (error) {
    console.error('Error accessing webcam:', error);
    throw error;
  }

  const videoElement = setupVideo(webcamStream);

  var ctx = videoCanvas.getContext("2d");

  videoElement.addEventListener(
    "loadeddata",
    function () {
      var loopID = setInterval(async function () {
        const predictions = await detect(videoElement)
        ctx.drawImage(videoElement, 0, 0, width, height, 0, 0, width, height);
          ctx.beginPath();
          drawBoundingBoxes(predictions, videoCanvas, ctx, scalingRatio, sx, sy);
        // var [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, scalingRatio] =
          // getCoordinates(video);
          // model.then(function (model) {
          // model.detect(video).then(function (predictions) {
          //     ctx.drawImage(video, 0, 0, width, height, 0, 0, width, height);

          //     ctx.beginPath();

          //     drawBoundingBoxes(predictions, canvas, ctx, scalingRatio, sx, sy);
      
          //     if (!webcamLoop) {
          //         clearInterval(loopID);
          //     }
          // });
      }, 1000 / 30);
    })
}

function setupVideo(stream) {
  var video = document.createElement("video");
  video.srcObject = stream;
  video.setAttribute("playsinline", "");
  video.play();

  video.height = height;
  video.style.height = height + "px";
  video.width = width;
  video.style.width = width + "px";
  return video
}

function drawBoundingBoxes(predictions, canvas, ctx, scalingRatio, sx, sy) {
  for (var i = 0; i < predictions.length; i++) {
    var confidence = predictions[i].confidence;
    ctx.scale(1, 1);

    if (predictions[i].class in bounding_box_colors) {
        ctx.strokeStyle = bounding_box_colors[predictions[i].class];
    } else {
        // random color
        var color =
        color_choices[Math.floor(Math.random() * color_choices.length)];
        ctx.strokeStyle = color;
        // remove color from choices
        color_choices.splice(color_choices.indexOf(color), 1);

        bounding_box_colors[predictions[i].class] = color;
    }

    var prediction = predictions[i];
    var x = prediction.bbox.x - prediction.bbox.width / 2;
    var y = prediction.bbox.y - prediction.bbox.height / 2;
    var width = prediction.bbox.width;
    var height = prediction.bbox.height;

    x -= sx;
    y -= sy;

    x *= scalingRatio;
    y *= scalingRatio;
    width *= scalingRatio;
    height *= scalingRatio;

    // if box is partially outside 640x480, clip it
    if (x < 0) {
        width += x;
        x = 0;
    }

    if (y < 0) {
        height += y;
        y = 0;
    }

    // if first prediction, double label size


    ctx.rect(x, y, width, width);

    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fill();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = "4";
    ctx.strokeRect(x, y, width, height);
    // put colored background on text
    var text = ctx.measureText(
        prediction.class + " " + Math.round(confidence * 100) + "%"
    );
    // if (i == 0) {
    //     text.width *= 2;
    // }

    // set x y fill text to be within canvas x y, even if x is outside
    // if (y < 0) {
    //     y = -40;
    // }
    if (y < 20) {
        y = 30
    }

    // make sure label doesn't leave canvas

    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(x - 2, y - 30, text.width + 4, 30);
    // use monospace font
    ctx.font = "15px monospace";
    // use black text
    ctx.fillStyle = "black";

    ctx.fillText(
        prediction.class + " " + Math.round(confidence * 100) + "%",
        x,
        y - 10
    );
  }
}

const { createApp, computed, ref } = Vue

createApp({
  setup() {
    const allBadges = ref([])
    const selectedBadges = ref([])
    const debugMessage = ref("")

    const parser = new PublicGoogleSheetsParser(
      '1KBOGN6oEdw5XBxcMZAjdA7pPgZI1JS1FT-CvBxlkcGo',
      { sheetName: 'badge-images', useFormat: true }
    )    
    parser.parse().then(data => {
      allBadges.value = _.sortBy(data, ["category", "badge_name"]).map(badge => {
          return {
              id: badge.badge_name.replace(/^:(.+):$/, '$1'),
              name: badge.badge_name,
              url: badge.url,
              description: badge.description,
          }
      })
    })
    
    return {
      allBadges,
      selectedBadges,
      debugMessage,
      startWebcam,
      classesFor(badge) {
        const selected = selectedBadges.value.indexOf(badge) !== -1;
        return {
            'border-purple-800': selected,
            'bg-purple-300': selected,
        }
      },
      toggleBadge(badge) {
        const badgeIndex = selectedBadges.value.indexOf(badge);
        if (badgeIndex === -1) {
            selectedBadges.value.push(badge);
        }
        else {
            selectedBadges.value.splice(badgeIndex, 1);
        }
      },
    }
  },
  mounted() {
    this.startWebcam(this.$refs.videoCanvas)
  }
}).mount('#app')
