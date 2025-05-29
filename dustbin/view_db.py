import sqlite3

def view_db():
    conn = sqlite3.connect('recycle_data.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM recycle_reports")
    rows = cursor.fetchall()

    for row in rows:
        print(f"ID: {row[0]}")
        print(f"User ID: {row[1]}")
        print(f"Product Type: {row[2]}")
        print(f"Estimated Value (INR): {row[3]}")
        print(f"Full Response: {row[4]}")
        print("-" * 40)

    conn.close()

if __name__ == "__main__":
    view_db()
