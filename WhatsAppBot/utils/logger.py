import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
def setup_logger():
    """Configure and return logger instance"""
    log_level = os.getenv("LOG_LEVEL", "INFO")
    
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)
    
    logging.basicConfig(
        level=numeric_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    return logging.getLogger(__name__)

# Create logger instance
logger = setup_logger()