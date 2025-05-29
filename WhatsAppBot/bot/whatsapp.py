import os
from datetime import datetime
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client

from utils.logger import logger
from analyzer.news import analyze_news, extract_json_from_response, format_response

class WhatsAppBot:
    """WhatsApp bot implementation using Twilio API"""
    
    def __init__(self):
        # Initialize Twilio client if credentials are available
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        # Use only the correct WhatsApp sandbox number, no comments or extra spaces
        self.from_number = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")
        
        self.client = None
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            logger.warning("Twilio credentials not found. WhatsApp messaging will not work.")

        # Store user sessions temporarily
        self.user_sessions = {}
        
    def create_initial_response(self, incoming_msg=None, has_media=False):
        """Create initial TwiML response to incoming message"""
        resp = MessagingResponse()
        
        # Help command
        if incoming_msg and incoming_msg.lower() in ['/help', 'help']:
            resp.message("""*Fake News Analyzer Bot* 🔍

Send me a news article, claim, or image to analyze if it's real or fake.

*Commands:*
/help - Show this help message
            """)
        else:
            # Send acknowledgment message
            if has_media:
                resp.message("📸 Processing your image... I'll analyze this for fake news content and send you the results shortly.")
            else:
                resp.message("🔍 Analyzing your content... Please wait for the results.")
            
        return str(resp)

    def process_message(self, incoming_msg, user_number=None, media_url=None):
        """
        Analyze the incoming message and send the result via WhatsApp.
        Now supports both text and image analysis.
        """
        if not incoming_msg and not media_url:
            return "❗ Please send a news article, claim, or image to analyze."
        
        try:
            # If media is present, we'll handle it in app.py with the image analyzer
            if media_url:
                logger.info(f"Image analysis will be handled separately for media URL: {media_url}")
                return "Image processing..."
                
            # Handle text analysis
            raw_result = analyze_news(incoming_msg)
            parsed_json = extract_json_from_response(raw_result)
            
            if not parsed_json or not isinstance(parsed_json, dict) or "verdict" not in parsed_json:
                logger.error(f"Invalid JSON from LLM: {raw_result}")
                return "❌ Sorry, I couldn't analyze this content. Please try again with a clearer claim or news article."
            
            formatted_result = format_response(parsed_json)
            
            # Send result via WhatsApp if user_number is provided
            if user_number and self.client:
                self.send_message(user_number, formatted_result)
                
            return formatted_result
            
        except Exception as e:
            logger.error(f"Error analyzing message: {e}")
            error_msg = "⚠️ Sorry, there was an error analyzing your message. Please try again later."
            
            # Send error message via WhatsApp if user_number is provided
            if user_number and self.client:
                self.send_message(user_number, error_msg)
                
            return error_msg

    def save_user_session(self, from_number, incoming_msg=None):
        """Store user in session"""
        if from_number:
            self.user_sessions[from_number] = {
                "last_message": incoming_msg,
                "timestamp": datetime.now()
            }
            
    def send_message(self, to_number, message_body):
        """Send a WhatsApp message to a user"""
        try:
            if not self.client:
                logger.error("Twilio client not initialized. Cannot send message.")
                return None
                
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=f'whatsapp:{to_number}'
            )
            logger.info(f"Message sent to {to_number}, SID: {message.sid}")
            return message.sid
        except Exception as e:
            logger.error(f"Error sending WhatsApp message: {e}")
            return None
            
    def clean_old_sessions(self, max_age_hours=24):
        """Clean up old user sessions"""
        try:
            now = datetime.now()
            to_remove = []
            
            for user_id, session in self.user_sessions.items():
                if "timestamp" in session:
                    age = now - session["timestamp"]
                    if age.total_seconds() > max_age_hours * 3600:
                        to_remove.append(user_id)
                        
            for user_id in to_remove:
                del self.user_sessions[user_id]
                
            return len(to_remove)
        except Exception as e:
            logger.error(f"Error cleaning sessions: {e}")
            return 0

# Create singleton instance
whatsapp_bot = WhatsAppBot()