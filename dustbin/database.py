import sqlite3
import json
import re

def extract_json(text):
    import re
    pattern = r"```json(.*?)```"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()
def get_estimated_value_inr(value_data):
    """
    Extracts a numeric estimate from Gemini's 'recycling_value_INR' field.
    Prioritizes average of 'low' and 'high' if present.
    """

    if isinstance(value_data, (int, float)):
        return float(value_data)

    if isinstance(value_data, str):
        value_data = value_data.replace("INR", "").replace("₹", "").strip()
        parts = value_data.split('-')
        try:
            if len(parts) == 2:
                return (float(parts[0]) + float(parts[1])) / 2
            return float(parts[0])
        except:
            return 0.0

    if isinstance(value_data, dict):
        if "low" in value_data and "high" in value_data:
            try:
                return (float(value_data["low"]) + float(value_data["high"])) / 2
            except:
                return 0.0

        if "total" in value_data:
            try:
                return float(value_data["total"])
            except:
                return 0.0

        for val in value_data.values():
            if isinstance(val, (int, float)):
                return float(val)

    return 0.0



def save_to_db(user_id, gemini_response_text):
    try:
        clean_json_str = extract_json(gemini_response_text)
        response_json = json.loads(clean_json_str)

        recyclable = response_json.get("recyclable", "").strip().lower()
        if recyclable == "yes":
            product_type = "Recyclable"
        elif recyclable == "no":
            product_type = "Not recyclable"
        else:
            product_type = "Unknown"

        estimated_value = get_estimated_value_inr(response_json.get("recycling_value_INR") or response_json.get("recycling_value_inr"))
        if estimated_value is None:
            estimated_value = "0"

        conn = sqlite3.connect('recycle_data.db')
        cursor = conn.cursor()

        object_name = response_json.get("object", "Unknown")

        cursor.execute("""
            INSERT INTO recycle_reports (user_id, product_type, estimated_value_inr, full_response)
            VALUES (?, ?, ?, ?)
        """, (user_id, product_type, estimated_value, object_name))


        conn.commit()
        conn.close()

        print("✅ Data saved to database with parsed values.")
    except json.JSONDecodeError as e:
        print(f"⚠️ Failed to parse Gemini JSON response. Data not saved. Error: {e}")
    except Exception as e:
        print(f"⚠️ Error saving to database: {e}")
