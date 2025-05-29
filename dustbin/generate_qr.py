import qrcode
import os

def generate_qr(data):
    if isinstance(data, list) and data:
        
        if isinstance(data[0], dict) and 'id' in data[0]:
            qr_filename = f"{data[0]['id']}_multi.png"
        else:
            qr_filename = "qr_analysis_multi.png"
    elif isinstance(data, dict):
        qr_filename = f"{data.get('id', 'qr_analysis')}.png"
    else:
        qr_filename = "qr_unknown.png"

    qr_dir = "static/qr_codes"
    os.makedirs(qr_dir, exist_ok=True)
    qr_path = os.path.join(qr_dir, qr_filename)

    # Generate QR code with the data (as string)
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(str(data))
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    img.save(qr_path)
    return qr_path

