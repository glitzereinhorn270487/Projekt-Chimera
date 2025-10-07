import sys
from loguru import logger

def setup_logging():
    """
    Konfiguriert den zentralen Logger für das gesamte Projekt.
    """
    logger.remove() # Entferne die Standardkonfiguration

    # Konfiguration für die Ausgabe in der Konsole
    logger.add(
        sys.stdout,
        level="INFO",
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        colorize=True,
    )

    # Konfiguration für die Ausgabe in eine Log-Datei
    logger.add(
        "logs/bot_activity.log",
        level="DEBUG",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        rotation="10 MB", # Log-Datei wird bei 10 MB rotiert
        retention="7 days", # Logs werden für 7 Tage aufbewahrt
        enqueue=True, # Macht das Logging asynchron-sicher
        backtrace=True,
        diagnose=True,
    )

    logger.info("Cerebrum (Logging-System) initialisiert.")
    return logger

# Erstelle eine globale Logger-Instanz
cerebrum = setup_logging()
