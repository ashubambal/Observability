from flask import Flask
import time, random

app = Flask(__name__)

@app.route('/')
def home():
    try:
        rand_val = random.random()
        if rand_val < 0.3:
            raise Exception(f"Random crash! Value was {rand_val:.3f}")

        return (
            "App is running smoothly! "
            + time.ctime()
            + " | Random value: " + str(round(rand_val, 3))
            + " | Response time: " + str(random.randint(100, 500)) + "ms"
        )
    except Exception as e:
        # Return a proper error response instead of raw traceback
        return {"error": str(e), "time": time.ctime()}, 500

@app.route('/health')
def health():
    return {"status": "healthy", "time": time.ctime()}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
