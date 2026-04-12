from app.api.server import app
from dotenv import load_dotenv
load_dotenv()  # load .env variables into environment
from app.config.settings import PORT
if __name__ == "__main__":
    app.run(debug=True, port=PORT)