import cv2

def capture_image_from_mobile(stream_url, save_path):
    cap = cv2.VideoCapture(stream_url)
    print("📱 Mobile Camera Activated: Press 's' to scan or 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠️ Failed to grab frame.")
            continue

        cv2.imshow("Mobile Camera", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord('s'):
            cv2.imwrite(save_path, frame)
            print("📸 Image saved.")
            break
        elif key == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            return None  # Changed from exit() to return None for backend compatibility

    cap.release()
    cv2.destroyAllWindows()
    return save_path
