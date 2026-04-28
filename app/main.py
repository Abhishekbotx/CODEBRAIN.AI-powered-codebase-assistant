from app.api.server import app
from app.config.settings import PORT

if __name__ == "__main__":
    app.run(debug=True, port=PORT)