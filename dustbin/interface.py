import streamlit as st
import cv2
import tempfile
import os
from analyzer import analyze_with_gemini_vision
from database import save_to_db
import sqlite3
import generate_qr
from PIL import Image

st.title("♻️ Recycle Item Scanner & QR Generator")

def capture_image_from_webcam(save_path, key=None):
    # Pass a unique key to each camera_input to avoid StreamlitDuplicateElementId
    img_file = st.camera_input("Take a picture for this object", key=key)
    if img_file is not None:
        with open(save_path, "wb") as f:
            f.write(img_file.getbuffer())
        st.success("Image captured!")
        st.image(save_path, caption="Captured Image")
        return save_path
    return None

def main():
    user_id = st.text_input("Enter your user ID:")
    num_objects = st.number_input("Number of different objects to scan:", min_value=1, step=1)
    all_objects = []
    analysis_reports = []

    if user_id and num_objects:
        for i in range(int(num_objects)):
            st.subheader(f"Object {i+1}")
            num_items = st.number_input(f"Number of items for object {i+1}:", min_value=1, step=1, key=f"num_items_{i}")
            save_path = f"captured_item_{i+1}.jpg"
            # Pass a unique key for each camera_input
            img_path = capture_image_from_webcam(save_path, key=f"camera_{i}")
            if img_path:
                # Ensure response_text is a dict, not a string with markdown or code block
                response_text = analyze_with_gemini_vision(img_path)
                # If response_text is a string with ```json ... ```, clean it up:
                if isinstance(response_text, str):
                    # Remove markdown code block if present
                    if response_text.strip().startswith("```json"):
                        response_text = response_text.strip()
                        response_text = response_text.lstrip("`").lstrip("json").strip()
                        if response_text.endswith("```"):
                            response_text = response_text[:-3].strip()
                    import json
                    try:
                        response_text = json.loads(response_text)
                    except Exception as e:
                        st.error(f"Failed to parse analysis result as JSON: {e}")
                        response_text = {}

                st.write("♻️ Analysis Result:")
                st.json(response_text)
                analysis_reports.append(response_text)  # Collect the analysis report for QR

                # Convert dict to string before saving to DB
                import json
                save_to_db(user_id, json.dumps(response_text))
                # Fetch last inserted row
                conn = sqlite3.connect("recycle_data.db")
                cursor = conn.cursor()
                cursor.execute("SELECT id, user_id, product_type, estimated_value_inr, full_response FROM recycle_reports ORDER BY id DESC LIMIT 1")
                row = cursor.fetchone()
                conn.close()
                if row:
                    estimated_value = row[3] if row[3] else 0
                    total_estimated_value = int(num_items) * float(estimated_value)
                    obj_data = {
                        "product_id": row[0],
                        "product_name": row[4] if row[4] else "Unknown",
                        "number_of_items": int(num_items),
                        "estimated_value": total_estimated_value,
                        "recyclable": row[2]
                    }
                    all_objects.append(obj_data)
                    st.success(f"Object {i+1} processed and added.")
                else:
                    st.error("No data found in database for this object.")

        if analysis_reports and st.button("Generate QR Code for All Analysis Reports"):
            qr_path = generate_qr.generate_qr(analysis_reports)
            st.success(f"QR code generated at: {qr_path}")
            st.image(qr_path, caption="Generated QR Code")

if __name__ == "__main__":
    main()
