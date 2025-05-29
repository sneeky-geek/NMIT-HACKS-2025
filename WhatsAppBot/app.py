import os
import tempfile
import requests
from fastapi import FastAPI, Form, Request, BackgroundTasks
from fastapi.responses import PlainTextResponse, Response
import uvicorn

from utils.logger import logger
from analyzer.news import analyze_news, create_news_input, extract_json_from_response, format_response
from bot.whatsapp import whatsapp_bot

# Initialize FastAPI app
app = FastAPI(
    title="WhatsApp Fake News Analyzer",
    description="A WhatsApp bot that analyzes news for authenticity using Google Gemini API",
    version="1.0.0"
)

@app.post("/webhook", response_class=PlainTextResponse)
async def webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    Body: str = Form(None),
    NumMedia: str = Form("0"),
    MediaUrl0: str = Form(None),
    From: str = Form(None),  # Added From parameter to get sender's number
):
    """Handle incoming WhatsApp messages"""
    try:
        # Get incoming message details
        incoming_msg = Body.strip() if Body else ""
        media_url = MediaUrl0 if int(NumMedia) > 0 else None
        
        # Extract WhatsApp number (format: whatsapp:+1234567890)
        from_number = From.replace("whatsapp:", "") if From else None
        
        # Store user in session
        whatsapp_bot.save_user_session(from_number, incoming_msg)
        
        # Create initial response
        response = whatsapp_bot.create_initial_response(incoming_msg)
        
        # Run the analysis in background if not a help command
        if from_number and not (incoming_msg and incoming_msg.lower() in ['/help', 'help']):
            background_tasks.add_task(
                process_and_send_analysis, 
                incoming_msg=incoming_msg, 
                media_url=media_url,
                user_number=from_number
            )
        
        return Response(content=response, media_type="text/xml")
        
    except Exception as e:
        logger.error(f"Error in webhook: {e}")
        resp = whatsapp_bot.create_initial_response()  # Generic response
        return resp

async def process_and_send_analysis(incoming_msg: str, media_url: str = None, user_number: str = None):
    """Process the analysis in the background and send result"""
    try:
        if media_url:
            # Handle image analysis if a media URL is provided
            await analyze_image_and_send_result(media_url, incoming_msg, user_number)
            return
            
        # Process text-only news input
        news_input = create_news_input(news_text=incoming_msg)
        
        # Run the analysis
        analysis_text = analyze_news(news_input)
        parsed_result = extract_json_from_response(analysis_text)
        
        # Format the result
        response_message = format_response(parsed_result)
        
        # Send the result back to the user via Twilio API
        if user_number:
            whatsapp_bot.send_message(user_number, response_message)
        
    except Exception as e:
        logger.error(f"Error in background processing: {e}")
        # Send error message
        if user_number:
            whatsapp_bot.send_message(
                user_number, 
                "❌ Sorry, I couldn't analyze that content. Please try again with a different article or image."
            )

async def analyze_image_and_send_result(image_url: str, caption: str = "", user_number: str = None):
    """
    Download an image from a URL, analyze it with Google Gemini, and send the result.
    
    Args:
        image_url: URL of the image from Twilio
        caption: Optional text message that accompanied the image
        user_number: Phone number to send the result to
    """
    try:
        from google import genai
        import os
        
        # Get Google API key from environment
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("Google API Key not found in environment variables")
        
        # Initialize Gemini client
        client = genai.Client(api_key=api_key)
        
        # Download the image to a temporary file
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            response = requests.get(image_url)
            response.raise_for_status()
            temp_file.write(response.content)
            temp_file_path = temp_file.name
            
        logger.info(f"Downloaded image to: {temp_file_path}")
        
        # Upload the image to Gemini
        my_file = client.files.upload(file=temp_file_path)
        
        # Set prompt for image analysis
        prompt = "Analyze this image and determine if it contains fake news, misinformation, or manipulated content. Provide a verdict (Real/Fake/Uncertain) with reasoning."
        if caption and caption.strip():
            # If user provided a caption, include it in the analysis
            prompt = f"Analyze this image with caption: '{caption}'. Determine if it contains fake news, misinformation, or manipulated content."
        
        # Generate content
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[my_file, prompt],
        )
        
        logger.info(f"Gemini image analysis response: {response.text}")
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        # Send response to user
        if user_number:
            result_message = f"*Image Analysis*\n\n{response.text.strip()}"
            whatsapp_bot.send_message(user_number, result_message)
            
    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        if user_number:
            whatsapp_bot.send_message(
                user_number, 
                "❌ Sorry, I couldn't analyze the image. Please ensure it's a valid image and try again."
            )

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "online", "message": "WhatsApp Fake News Analyzer Bot is running"}

# Maintenance task: clean old sessions periodically
@app.on_event("startup")
async def startup_event():
    """Runs on server startup"""
    logger.info("Starting WhatsApp Fake News Analyzer Bot")

@app.on_event("shutdown")
async def shutdown_event():
    """Runs on server shutdown"""
    logger.info("Shutting down WhatsApp Fake News Analyzer Bot")

if __name__ == "__main__":
    # Get port from environment variable or use 8000 as default
    port = int(os.environ.get('PORT', 8000))
    
    # Run the FastAPI app with uvicorn
    logger.info(f"Starting WhatsApp Fake News Analyzer Bot on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)