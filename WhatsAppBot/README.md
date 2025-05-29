# WhatsApp Fake News Analyzer Bot

A WhatsApp bot that analyzes news articles, claims, and images to determine if they contain fake news. Built with Python, FastAPI, Twilio, and Google Gemini 2.0.

## Features

- ✅ Analyze text-based news articles and claims for authenticity
- 📸 Analyze images for manipulated or fake content
- 🔍 Provide detailed reasoning behind verdicts
- 📊 Include confidence levels with each analysis
- 📝 Reference sources to support fact-checking
- 🇮🇳 Prioritize Indian official sources when relevant

## Prerequisites

- Python 3.9+
- Twilio account with WhatsApp sandbox enabled
- Google API key with access to Gemini 2.0 models

## Installation

1. Clone the repository or download the files
2. Install dependencies:

```bash
pip install fastapi uvicorn twilio google-generativeai requests python-dotenv python-multipart
```

## Configuration

Create a `.env` file with the following environment variables:

```
GOOGLE_API_KEY=your_google_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## Running the Application

Start the server with:

```bash
python app.py
```

The server will start on port 8000 by default. You can change this by setting the `PORT` environment variable.

## Exposing the Webhook

To test locally, use ngrok to expose your webhook:

```bash
ngrok http 8000
```

Then configure your Twilio WhatsApp sandbox webhook URL to point to:
`https://your-ngrok-domain.ngrok.io/webhook`

## Joining the WhatsApp Sandbox

1. Go to the [Twilio Console](https://console.twilio.com/) > Messaging > Try it out > Send a WhatsApp Message
2. Follow the instructions to join the sandbox by sending a WhatsApp message to the sandbox number
3. Once connected, you can send messages to the bot

## Usage

- Send any news article, claim, or statement to analyze its authenticity
- Send an image (with optional caption) that you want to check for fake news
- Send "help" or "/help" to see the available commands

## Example Commands

- *Send a news claim*: "NASA confirms water on Mars"
- *Send an image*: [Image] "Is this real?"
- *Get help*: "help"

## Limitations

- Twilio WhatsApp sandbox has a daily limit of 10 messages per 24 hours
- Large images may take longer to process
- Analysis quality depends on available information and search results

## Project Structure

- `app.py`: Main FastAPI application and webhook handler
- `bot/whatsapp.py`: WhatsApp bot implementation using Twilio
- `analyzer/news.py`: News analysis logic using Google Gemini
- `utils/logger.py`: Logging utilities

## Troubleshooting

- If messages aren't being sent, check the Twilio console for error messages
- Check logs for errors in the analysis process
- Verify your webhook URL is correctly configured in the Twilio console
- Ensure your Google API key has access to the Gemini models

## License

This project is licensed under the MIT License - see the LICENSE file for details.
