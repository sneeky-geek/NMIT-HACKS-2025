import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("Gemini_API"))
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_with_gemini_vision(image_path):
    image = Image.open(image_path)

    prompt = """You are an expert in waste management and recycling in India.

Your task is to analyze the object shown in the provided image and respond to the following strictly in valid JSON format (no explanations or additional comments):

{
    "object": "name of the object",
    "product_type": "type of product (e.g., plastic, metal, paper, etc.)",
  "recyclable": "Yes" or "No",
  "estimated_value": approximate value (number only, no ₹ symbol),
  "profit_rating_out_of_10": integer rating from 1 to 10
}

Guidelines:
- "recyclable" should be "Yes" only if the object can be commonly recycled in India.
- "estimated_value" should reflect approximate income from recycling that item (based on scrap/reuse value).
- "profit_rating_out_of_10" should be higher for higher recycling profit potential.

Do not include anything other than the JSON output.
"""

    response = model.generate_content([prompt, image])
    return response.text

