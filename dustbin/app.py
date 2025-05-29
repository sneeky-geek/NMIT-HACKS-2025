from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import generate_qr
import camera
import analyzer
import database
import json  # Add missing import
from typing import List, Dict, Any

# Import for debugging
import logging
import os  # Make sure os is imported at module level
logging.basicConfig(level=logging.INFO)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
templates = Jinja2Templates(directory="structure")

# Serve static files (QR codes)
app.mount("/static", StaticFiles(directory="static"), name="static")
# Add mounts for CSS and JS if not already present
app.mount("/static/css", StaticFiles(directory="static/css"), name="static_css")
app.mount("/static/js", StaticFiles(directory="static/js"), name="static_js")

def get_product_by_id(product_id: int):
    conn = sqlite3.connect("recycle_data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, product_type, estimated_value_inr, full_response FROM recycle_reports WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        # Try to extract the estimated_value from full_response if available
        estimated_value = row[2] if row[2] is not None else 0
        try:
            if row[3]:  # If full_response exists
                response_json = json.loads(row[3])
                if "estimated_value" in response_json:
                    estimated_value = response_json["estimated_value"]
        except:
            logging.warning(f"Could not parse full_response for product {product_id}")
            
        return {
            "product_id": row[0],
            "product_type": row[1],
            "estimated_value_inr": estimated_value
        }
    return None

@app.get("/product/{product_id}", response_class=JSONResponse)
async def product_details(request: Request, product_id: int):
    product = get_product_by_id(product_id)
    if product:
        # QR code path (relative to /static)
        qr_filename = f"{product_id}.png"
        qr_url = f"/static/qr_codes/{qr_filename}"
        # Check if QR code exists
        qr_path = os.path.join("static", "qr_codes", qr_filename)
        qr_exists = os.path.exists(qr_path)
        return JSONResponse(content={
            "product": product,
            "qr_code_url": qr_url if qr_exists else None
        })
    return JSONResponse(content={"error": "Product not found"}, status_code=404)

class ScanObject(BaseModel):
    number_of_items: int

class ScanRequest(BaseModel):
    user_id: str
    objects: list[ScanObject]

@app.post("/scan", response_class=JSONResponse)
async def scan_objects(scan_request: ScanRequest):
    try:
        all_objects = []
        user_id = scan_request.user_id

        for idx, obj in enumerate(scan_request.objects):
            # 1. Capture image from mobile IP webcam
            try:
                image_path = camera.capture_image_from_mobile("http://172.17.11.177:8080/video", "captured_item.jpg")
                print("Returned image_path:", image_path)
            except Exception as e:
                print("Exception during image capture:", e)
                return JSONResponse(content={"error": f"Exception during image capture: {e}"}, status_code=500)

            # Ensure the capture_image_from_mobile function returns the correct image path
            if image_path is None:
                print("Error: capture_image_from_mobile did not return an image path. Please check the function in camera.py.")
                return JSONResponse(content={"error": "Image capture failed. The function did not return an image path. Fix camera.py to return the saved image path."}, status_code=500)
            if not os.path.exists(image_path):
                print("Error: Image file does not exist at path:", image_path)
                return JSONResponse(content={"error": f"Image file does not exist at path: {image_path}"}, status_code=500)

            # 2. Analyze image
            try:
                response_text = analyzer.analyze_with_gemini_vision(image_path)
            except Exception as e:
                print("Image analysis failed:", e)
                return JSONResponse(content={"error": f"Image analysis failed: {e}"}, status_code=500)
            if not response_text:
                print("Image analysis returned empty result.")
                return JSONResponse(content={"error": "Image analysis failed."}, status_code=500)

            # 3. Save to DB
            try:
                database.save_to_db(user_id, response_text)
            except Exception as e:
                print("Database save failed:", e)
                return JSONResponse(content={"error": f"Database save failed: {e}"}, status_code=500)

            # 4. Fetch last inserted row
            try:
                conn = sqlite3.connect("recycle_data.db")
                cursor = conn.cursor()
                cursor.execute("SELECT id, user_id, product_type, estimated_value_inr, full_response FROM recycle_reports ORDER BY id DESC LIMIT 1")
                row = cursor.fetchone()
                conn.close()
            except Exception as e:
                print("Database fetch failed:", e)
                return JSONResponse(content={"error": f"Database fetch failed: {e}"}, status_code=500)

            if row:
                estimated_value = row[3] if row[3] else 0
                total_estimated_value = obj.number_of_items * float(estimated_value)
                obj_data = {
                    "id": row[0],
                    "product_name": row[4] if row[4] else "Unknown",
                    "number_of_items": obj.number_of_items,
                    "estimated_value": total_estimated_value,
                    "recyclable": row[2]
                }
                all_objects.append(obj_data)
            else:
                print("No data found in database for this object.")
                return JSONResponse(content={"error": "No data found in database for this object."}, status_code=500)

        if all_objects:
            try:
                qr_path = generate_qr.generate_qr(all_objects)
                qr_url = "/static/qr_codes/" + os.path.basename(qr_path)
            except Exception as e:
                print("QR code generation failed:", e)
                return JSONResponse(content={"error": f"QR code generation failed: {e}"}, status_code=500)
            return JSONResponse(content={
                "objects": all_objects,
                "qr_code_url": qr_url
            })
        else:
            print("No objects detected, QR code not generated.")
            return JSONResponse(content={"error": "No objects detected, QR code not generated."}, status_code=500)
    except Exception as e:
        # Print error to server log and return error message
        print("Error in /scan endpoint:", e)
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), user_id: str = Form(...)):
    logging.info(f"Received file {file.filename} from user {user_id}")
    try:
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        logging.info(f"Saved image to {temp_path}")

        # Basic response for testing
        response_data = {"message": "Analysis complete", "filename": file.filename, "user_id": user_id}
        return JSONResponse(content=response_data)

    except Exception as e:
        logging.exception("Error in /analyze")
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Add '/generate_qr' endpoint to handle QR code generation from web interface
class AnalysisObject(BaseModel):
    number_of_items: int
    analysis: Dict[str, Any]

class GenerateQRRequest(BaseModel):
    user_id: str
    objects: List[AnalysisObject]

@app.post("/generate_qr", response_class=JSONResponse)
async def generate_qr_endpoint(request: GenerateQRRequest):
    logging.info(f"GENERATE_QR ENDPOINT: Received request with objects: {len(request.objects)}")
    try:
        user_id = request.user_id
        all_objects = []
        
        for idx, obj in enumerate(request.objects):
            # Save each analysis to the database
            analysis_json = obj.analysis
            logging.info(f"Processing object {idx+1}, number_of_items: {obj.number_of_items}")
            logging.info(f"Analysis: {str(analysis_json)[:100]}...")
            
            database.save_to_db(user_id, json.dumps(analysis_json))
            
            # Get the latest inserted record
            conn = sqlite3.connect("recycle_data.db")
            cursor = conn.cursor()
            cursor.execute("SELECT id, product_type, estimated_value_inr, full_response FROM recycle_reports ORDER BY id DESC LIMIT 1")
            row = cursor.fetchone()
            conn.close()
            
            if row:
                # Fix: Get estimated_value from analysis_json directly if possible
                estimated_value = 0
                if isinstance(analysis_json, dict) and "estimated_value" in analysis_json:
                    estimated_value = float(analysis_json["estimated_value"])
                elif row[2] is not None:
                    estimated_value = float(row[2])
                    
                logging.info(f"Using estimated value: {estimated_value}")
                
                # Ensure object data structure matches your JSON structure
                obj_data = {
                    "id": row[0],
                    "object": analysis_json.get("object", "Unknown"),
                    "product_type": row[1] if row[1] else analysis_json.get("product_type", "Unknown"),
                    "number_of_items": obj.number_of_items,
                    "estimated_value": obj.number_of_items * float(estimated_value),
                    "recyclable": analysis_json.get("recyclable", "Unknown"),
                    "profit_rating_out_of_10": analysis_json.get("profit_rating_out_of_10", 0)
                }
                
                logging.info(f"Object data: {obj_data}")
                all_objects.append(obj_data)
            else:
                logging.error("No data found in database after saving")
        
        if not all_objects:
            logging.error("No objects processed successfully")
            return JSONResponse(content={"error": "No objects processed successfully"}, status_code=500)
            
        # Generate QR code
        logging.info(f"Generating QR code for {len(all_objects)} objects")
        qr_path = generate_qr.generate_qr(all_objects)
        logging.info(f"QR code generated at: {qr_path}")
        qr_url = "/static/qr_codes/" + os.path.basename(qr_path)
        
        response = {
            "objects": all_objects,
            "qr_code_url": qr_url
        }
        logging.info(f"Returning response: {str(response)[:100]}...")
        return JSONResponse(content=response)
    except Exception as e:
        logging.error(f"GENERATE_QR ERROR: {str(e)}")
        import traceback
        logging.error(traceback.format_exc())
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Add endpoint to serve web_interface.html
@app.get("/", response_class=HTMLResponse)
async def serve_web_interface():
    with open("d:/NMIT_HACKS/web_interface.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

# Add the following endpoint for simpler scanning flow
@app.post("/scan-item", response_class=JSONResponse)
async def scan_item(file: UploadFile = File(...), user_id: str = Form(...), num_items: int = Form(1)):
    logging.info(f"SCAN ITEM: Received image from user {user_id} with {num_items} items")
    try:
        # Save uploaded image temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
            logging.info(f"Saved image to {temp_path}")
        
        # Analyze the image using analyzer.py
        result = analyzer.analyze_with_gemini_vision(temp_path)
        
        # Extract JSON data from the response if needed
        if isinstance(result, str):
            if result.strip().startswith("```json"):
                result = result.strip().lstrip("`").lstrip("json").strip()
                if result.endswith("```"):
                    result = result[:-3].strip()
            try:
                result_json = json.loads(result)
            except:
                result_json = {"raw_text": result}
        else:
            result_json = result
        
        # Ensure result_json has all required fields
        expected_keys = ["object", "product_type", "recyclable", "estimated_value", "profit_rating_out_of_10"]
        for key in expected_keys:
            if key not in result_json:
                logging.warning(f"Missing key in result_json: {key}")
                if key == "object":
                    result_json[key] = "Unknown Object"
                elif key == "product_type":
                    result_json[key] = "Unknown"
                elif key == "recyclable":
                    result_json[key] = "Unknown"
                elif key == "estimated_value":
                    result_json[key] = 0
                elif key == "profit_rating_out_of_10":
                    result_json[key] = 0
        
        # Save to database
        database.save_to_db(user_id, json.dumps(result_json))
        
        # Get the last record
        conn = sqlite3.connect("recycle_data.db")
        cursor = conn.cursor()
        cursor.execute("SELECT id, product_type, estimated_value_inr, full_response FROM recycle_reports ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        conn.close()
        
        if row:
            # Fix: Make sure to extract estimated_value correctly
            estimated_value = 0
            if "estimated_value" in result_json:
                estimated_value = result_json["estimated_value"]
            elif row[2] is not None:
                estimated_value = row[2]
                
            logging.info(f"Using estimated value from result_json: {estimated_value}")
            
            obj_data = {
                "id": row[0],
                "object": result_json.get("object", "Unknown"),
                "product_type": result_json.get("product_type", "Unknown"),
                "number_of_items": num_items,
                "estimated_value": num_items * float(estimated_value),
                "recyclable": result_json.get("recyclable", "Unknown"),
                "profit_rating_out_of_10": result_json.get("profit_rating_out_of_10", 0)
            }
            
            # Generate QR code for this item
            all_objects = [obj_data]
            qr_path = generate_qr.generate_qr(all_objects)
            qr_url = "/static/qr_codes/" + os.path.basename(qr_path)
            
            # Remove temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
            return JSONResponse(content={
                "object": obj_data,
                "qr_code_url": qr_url,
                "analysis": result_json
            })
        else:
            return JSONResponse(content={"error": "Failed to save data to database"}, status_code=500)
    except Exception as e:
        logging.error(f"Error in scan-item: {str(e)}")
        import traceback
        logging.error(traceback.format_exc())
        return JSONResponse(content={"error": str(e)}, status_code=500)

