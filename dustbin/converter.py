import json
import re
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def extract_product_info(analysis_text):
    """
    Extract structured product information from the analysis text.
    
    Args:
        analysis_text (str): The raw text analysis from Gemini Vision or other analyzer
        
    Returns:
        dict: Structured product information as a dictionary
    """
    # Default values
    product_info = {
        "product_name": "Unknown",
        "product_type": "Unknown",
        "recyclable": False,
        "estimated_value_inr": 0.0,
        "raw_analysis": analysis_text
    }
    
    try:
        # Try to parse as JSON first (in case the analyzer already returns JSON)
        try:
            json_data = json.loads(analysis_text)
            if isinstance(json_data, dict):
                logger.info("Analysis text was already in JSON format")
                # If it's valid JSON, update our product_info with any fields it contains
                for key in product_info.keys():
                    if key in json_data:
                        product_info[key] = json_data[key]
                return product_info
        except json.JSONDecodeError:
            # Not valid JSON, continue with text parsing
            logger.info("Analysis text is not in JSON format, parsing as text")
        
        # Extract product name/type using pattern matching
        # Look for product identifiers
        product_patterns = [
            r"product(?:\s+name)?[:\s]+([A-Za-z0-9 ]+)",
            r"item(?:\s+name)?[:\s]+([A-Za-z0-9 ]+)",
            r"object[:\s]+([A-Za-z0-9 ]+)",
            r"identified as[:\s]+([A-Za-z0-9 ]+)"
        ]
        
        for pattern in product_patterns:
            match = re.search(pattern, analysis_text, re.IGNORECASE)
            if match:
                product_info["product_name"] = match.group(1).strip()
                break
        
        # Extract product material/type
        material_patterns = [
            r"material[:\s]+([A-Za-z0-9 ]+)", 
            r"type[:\s]+([A-Za-z0-9 ]+)",
            r"made of[:\s]+([A-Za-z0-9 ]+)"
        ]
        
        for pattern in material_patterns:
            match = re.search(pattern, analysis_text, re.IGNORECASE)
            if match:
                product_info["product_type"] = match.group(1).strip()
                break
                
        # Check if no specific product_type was found, try to infer from common materials
        if product_info["product_type"] == "Unknown":
            materials = ["plastic", "glass", "metal", "paper", "cardboard", "aluminum"]
            for material in materials:
                if material.lower() in analysis_text.lower():
                    product_info["product_type"] = material.capitalize()
                    break
        
        # Check recyclability
        recyclable_keywords = ["recyclable", "can be recycled", "is recyclable"]
        non_recyclable_keywords = ["not recyclable", "cannot be recycled", "non-recyclable"]
        
        # Check for non-recyclable first (more specific)
        for keyword in non_recyclable_keywords:
            if keyword.lower() in analysis_text.lower():
                product_info["recyclable"] = False
                break
        else:
            # If not found non-recyclable, check for recyclable
            for keyword in recyclable_keywords:
                if keyword.lower() in analysis_text.lower():
                    product_info["recyclable"] = True
                    break
        
        # Extract estimated value if present
        value_match = re.search(r"value[:\s]+([\d.]+)\s*(?:inr|rs|rupees)?", analysis_text, re.IGNORECASE)
        if value_match:
            try:
                product_info["estimated_value_inr"] = float(value_match.group(1))
            except ValueError:
                pass
    
    except Exception as e:
        logger.error(f"Error parsing analysis text: {e}")
        # Return the default product_info with raw analysis text
    
    logger.info(f"Extracted product info: {product_info}")
    return product_info

def text_to_json(analysis_text):
    """
    Convert analysis text to a structured JSON object.
    
    Args:
        analysis_text (str): The raw text analysis from Gemini Vision
        
    Returns:
        str: JSON string representation of the analysis
    """
    product_info = extract_product_info(analysis_text)
    return json.dumps(product_info)

def parse_analysis_result(analysis_text):
    """
    Main function to be called from other modules.
    Parses analysis text and returns both dict and JSON string.
    
    Args:
        analysis_text (str): The raw text analysis
        
    Returns:
        tuple: (dict, str) - The parsed data as both a dictionary and JSON string
    """
    product_info = extract_product_info(analysis_text)
    json_string = json.dumps(product_info, indent=2)
    return product_info, json_string

# Example usage
if __name__ == "__main__":
    sample_text = """
    The image shows a plastic bottle. This item is recyclable.
    Estimated value: 5.0 INR per item.
    """
    product_dict, json_result = parse_analysis_result(sample_text)
    print("Parsed data (dict):", product_dict)
    print("\nJSON output:")
    print(json_result)
