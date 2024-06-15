import os
import base64
from flask import Flask, request
from flask_cors import CORS
from inference_sdk import InferenceHTTPClient
from PIL import Image
from io import BytesIO

app = Flask(__name__)

CORS(app, resources={r"/predict": {"origins": "*"}})

API_KEY = os.getenv("ROBOFLOW_API_KEY")

client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key=API_KEY,
)


@app.route("/predict", methods=["POST"])
def predict():
    # Get the image base 64 string from the request
    base64_str = request.json.get("image_base_64")

    # Decode base64 string and create PIL image
    image_data = base64.b64decode(base64_str)
    image = Image.open(BytesIO(image_data))

    if image.mode == "RGBA":
        image = image.convert("RGB")

    return client.infer(image, model_id="guitar-chords-daewp/6")


if __name__ == "__main__":
    app.run(debug=True, port=1234)
