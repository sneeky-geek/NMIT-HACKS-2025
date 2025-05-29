from camera import capture_image_from_mobile
from analyzer import analyze_with_gemini_vision
from database import save_to_db
import sqlite3
import generate_qr
from converter import parse_analysis_result  

IMAGE_PATH = "captured_item.jpg"

def main():
    user_id = input("Enter your user ID: ").strip()
    all_objects = []

    # User enters the number of different objects to scan here:
    num_objects = int(input("Enter number of different objects to scan: ").strip())
    for i in range(num_objects):
        print(f"\n--- Scanning object {i+1} of {num_objects} ---")
        # User enters the number of items for each object here:
        num_items = int(input(f"Enter number of items for object {i+1}: ").strip())
        
        capture_image_from_mobile("http://172.17.11.177:8080/video", IMAGE_PATH)
        response_text = analyze_with_gemini_vision(IMAGE_PATH)

        print("\n--- ♻️ Analysis Result ---")
        print(response_text)
        
        # Convert the analysis text to structured data
        structured_data, json_string = parse_analysis_result(response_text)
        print("\n--- 📊 Structured Data ---")
        print(json_string)

        # Save the structured data to database
        save_to_db(user_id, json_string)  # Assuming save_to_db can handle JSON string

        # Create object data using the structured format
        obj_data = {
            "product_name": structured_data["product_name"],
            "product_type": structured_data["product_type"],
            "number_of_items": num_items,
            "estimated_value": num_items * structured_data["estimated_value_inr"],
            "recyclable": structured_data["recyclable"]
        }
        
        all_objects.append(obj_data)
        print(f"Added object: {obj_data['product_name']} ({num_items} items)")

    if all_objects:
        qr_path = generate_qr.generate_qr(all_objects)
        print(f"QR code generated at: {qr_path}")
    else:
        print("No objects detected, QR code not generated.")

if __name__ == "__main__": 
    main()
