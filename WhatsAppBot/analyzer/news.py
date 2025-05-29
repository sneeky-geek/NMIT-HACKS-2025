import os
import json
import requests
from urllib.parse import urlparse
from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch, Part

from utils.logger import logger

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Initialize Google Gemini client
client = genai.Client(api_key=GOOGLE_API_KEY)

# Gemini model ID
model_id = "gemini-2.0-flash"

# Google Search tool
google_search_tool = Tool(google_search=GoogleSearch())

def analyze_news(news_input, model_id=model_id, google_search_tool=google_search_tool):
    """Analyze news or claim using Gemini."""
    try:
        response = client.models.generate_content(
            model=model_id,
            contents=news_input,
            config=GenerateContentConfig(
                system_instruction="""
                <system_prompt>
YOU ARE THE WORLD'S LEADING FAKE NEWS DETECTION AGENT, TRAINED IN OPEN-SOURCE INTELLIGENCE (OSINT), FACT-CHECKING, AND MEDIA FORENSICS. YOUR ROLE IS TO ANALYZE A GIVEN NEWS ARTICLE OR CLAIM AND DETERMINE ITS VERACITY WITH EXPERT PRECISION. YOU MUST RETURN A STRUCTURED JSON OBJECT CONTAINING YOUR VERDICT, CONFIDENCE LEVEL, SUPPORTING REASONING, AND SOURCES USED.

###OBJECTIVE###
- IDENTIFY WHETHER A GIVEN CLAIM OR ARTICLE IS FACTUAL (REAL), FABRICATED (FAKE), OR INCONCLUSIVE (UNCERTAIN)
- EMPLOY A METHODICAL CHAIN OF THOUGHT TO ARRIVE AT A RELIABLE VERDICT
- OUTPUT A JSON OBJECT WITH 4 FIELDS: "verdict", "confidence", "reason", "sources"

---
NOTE: TF POSSIBLE USE INDIAN OFFILIAL SOURCES, SUCH AS NEWS ARTICLES, GOVERNMENT REPORTS, OR ACADEMIC STUDIES. DO NOT USE SOCIAL MEDIA OR UNVERIFIED WEBSITES.

###CHAIN OF THOUGHTS###

1. **UNDERSTAND**:
   - PARSE the entire text of the article or claim
   - IDENTIFY its main assertion(s) and implied facts

2. **BASICS**:
   - DETERMINE the core factual components (names, dates, events, places, data)
   - ISOLATE claims that require verification

3. **BREAK DOWN**:
   - SEGMENT the article into claimable units that can be checked independently
   - CATEGORIZE each as either factual, speculative, opinion-based, or manipulated

4. **ANALYZE**:
   - CROSS-REFERENCE each core claim with trusted fact-checking databases, news archives, and expert sources
   - VALIDATE claims using credible, dated, and verifiable information

5. **BUILD**:
   - SYNTHESIZE verified data to DETERMINE the article’s overall authenticity
   - IF MIXED, classify as "Uncertain" and explain the discrepancies

6. **EDGE CASES**:
   - ACCOUNT for satire, opinion pieces, partial truths, or manipulated media
   - DETECT stylistic patterns common in fake news (clickbait, false attribution, deepfakes)

7. **FINAL ANSWER**:
   - OUTPUT a JSON object:
```json
{
  "verdict": "Real" | "Fake" | "Uncertain",
  "confidence": float (0.0 - 1.0),
  "reason": "Clear explanation using evidence and logical deduction.",
  "sources": {
    "title1": "source1_url_or_name",
    "title2": "source2_url_or_name"
  }
}
```

---

###WHAT NOT TO DO###

- DO NOT OUTPUT AN OPINION OR GUESS WITHOUT JUSTIFICATION
- NEVER FABRICATE SOURCES OR REFERENCE UNSUBSTANTIATED INFORMATION
- DO NOT MARK SOMETHING AS “FAKE” UNLESS STRONGLY SUPPORTED BY EVIDENCE
- NEVER IGNORE EDGE CASES SUCH AS SATIRE, CONTEXT LOSS, OR TIME-SENSITIVE NEWS
- AVOID GENERATING TEXT OUTSIDE THE JSON FORMAT
- NEVER IGNORE THE CHAIN OF THOUGHT — IT IS MANDATORY TO VALIDATE EACH CLAIM STRUCTURALLY

---

###FEW-SHOT EXAMPLES###

**INPUT CLAIM**: “NASA confirms the Earth will be hit by an asteroid in 2025.”

**OUTPUT JSON**:
```json
{
  "verdict": "Fake",
  "confidence": 0.93,
  "reason": "NASA has made no such official statement. The claim is commonly found on satirical or misleading websites.",
  "sources": {
    "NASA Media Statement": "https://www.nasa.gov/planetarydefense",
    "Snopes Fact Check": "https://www.snopes.com/fact-check/nasa-asteroid-2025/"
  }
}
```

**INPUT CLAIM**: “The WHO declared COVID-19 no longer a global health emergency in May 2023.”

**OUTPUT JSON**:
```json
{
  "verdict": "Real",
  "confidence": 0.98,
  "reason": "WHO officially announced the end of COVID-19's global health emergency status on May 5, 2023.",
  "sources": {
    "WHO Press Release": "https://www.who.int/news/item/05-05-2023-covid-19-public-health-emergency",
    "Reuters": "https://www.reuters.com/world/who-ends-covid-global-emergency-2023-05-05/"
  }
}
```

</system_prompt>

                """,
                tools=[google_search_tool]
            )
        )
        return response.text
    except Exception as e:
        logger.error(f"Error analyzing news: {e}")
        return json.dumps({
            "verdict": "Error", 
            "confidence": 0, 
            "reason": f"Analysis failed: {str(e)}", 
            "sources": {}
        })

def extract_json_from_response(response_text):
    """Extracts JSON object from response."""
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        start = response_text.find('{')
        end = response_text.rfind('}')
        if start != -1 and end != -1 and start < end:
            try:
                return json.loads(response_text[start:end + 1])
            except:
                return None
        return None

def create_news_input(news_text="", image_url=None):
    """
    Prepares input for Gemini with image (from URL) and optional text.
    
    Args:
        news_text (str): The news article or claim.
        image_url (str): URL to the image.
    
    Returns:
        list or str: Gemini input with image part and text or just text.
    """
    try:
        if image_url:
            # Image from URL
            response = requests.get(image_url)
            response.raise_for_status()
            image_bytes = response.content
            
            image_part = Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
            text_part = news_text.strip() if news_text.strip() else "Analyze this news image"
            return [image_part, text_part]

        # If no image, return just the text
        return news_text.strip() or "No input provided."

    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return news_text or "Image load failed."

def format_response(analysis_result):
    """Format analysis result for WhatsApp message"""
    try:
        if not analysis_result:
            return "❌ Sorry, I couldn't analyze this content. Please try again with a clearer claim or news article."
            
        verdict = analysis_result.get("verdict", "Unknown")
        confidence = analysis_result.get("confidence", 0)
        reason = analysis_result.get("reason", "No reason provided")
        sources = analysis_result.get("sources", {})
        
        # Emoji based on verdict
        emoji = "✅" if verdict == "Real" else "❌" if verdict == "Fake" else "❓"
        
        response = f"{emoji} *VERDICT: {verdict.upper()}*\n\n"
        response += f"*Confidence:* {int(confidence * 100)}%\n\n"
        response += f"*Reason:* {reason}\n\n"
        
        if sources and len(sources) > 0:
            response += "*Sources:*\n"
            for title, url in sources.items():
                response += f"• {title}: {url}\n"
        
        return response
    except Exception as e:
        logger.error(f"Error formatting response: {e}")
        return "❌ Error formatting analysis results."

def json_to_information_message(json_data):
    """
    Send the JSON analysis result to Gemini LLM to get a well-formatted information text.
    The response should include links to sources in plain text format (not markdown or clickable), and should NOT include any introductory lines.
    """
    try:
        json_str = json.dumps(json_data, indent=2)
        prompt = (
            f"""You are an assistant that explains fake news analysis results for WhatsApp users.

Given a JSON analysis result, generate a well-structured and concise summary message that includes the following clearly labeled sections:

1. Verdict — State whether the news is Real, Fake, or Unclear
2. Confidence — Indicate the confidence level of the analysis (e.g., High, Medium, Low)
3. Reason — Explain the reasoning behind the verdict in clear and objective language
4. Sources — List the sources that support the analysis. Each source must include a plain title and link, in this format:
   Example Source Title: https://example.com/abc

Formatting Rules:
- The output must be in plain text only — no markdown, no emojis, and no special symbols
- Do not include any introductory or meta text (e.g., "Here is your analysis")
- Ensure each section starts on a new line and is clearly labeled
- If there are no sources, write: No sources available.
- add whatsapp formatting symbols

Return only the final message that will be sent to the WhatsApp user. Do not include explanations or comments.
json data: {json_str}
"""
            
        )
        response = client.models.generate_content(
            model=model_id,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error generating information message from JSON: {e}")
        return "❌ Error generating information message from analysis results."