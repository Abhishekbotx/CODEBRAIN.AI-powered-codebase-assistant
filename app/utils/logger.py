import logging

# setup at top of scanner file
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S",
    handlers=[
        logging.StreamHandler(),                        # terminal
        logging.FileHandler("./logs/ingestion.log", mode="w", encoding="utf-8") # saves to file
    ]
)
log = logging.getLogger(__name__)