# which chords

Project using roboflow to detect the chords being played in a guitar.

## demo

It is a frontend only project, available in Cloudflare Pages (not yet).

You click at the start button and the app will film you and detect the chords you are playing and display them on the screen.

## run

Run flask app

```bash
pip install -r requirements.txt
ROBOFLOW_API_KEY=<your_key> python app.py
```

Run frontend

```bash
./run.sh
```

