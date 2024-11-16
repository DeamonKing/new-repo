import json
import os
import base64
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

# Define the base directory as the directory where this script is located
base_dir = os.path.dirname(__file__)
web_dir = os.path.join(base_dir, "static")  # Define `static` folder path
img_dir = os.path.join(web_dir, "upload")  # Path to the img directory
db_file_path = os.path.join(web_dir, "db.json")  # Path to db.json

class JsonChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.is_processing = False  # Flag to prevent re-entrance

    def on_modified(self, event):
        if event.src_path == db_file_path and not self.is_processing:
            print(f"{db_file_path} has been modified.")
            self.process_json()

    def process_json(self):
        self.is_processing = True  # Set the flag to indicate processing has started
        try:
            with open(db_file_path, "r") as file:
                data = json.load(file)

            # Track if any changes are made
            changes_made = False
            
            # Assuming data[0].data is where the ingredients are stored
            for ingredient in data[0]["data"]:
                if "ING_IMG" in ingredient and ingredient["ING_IMG"]:  # Check if ING_IMG exists
                    original_img = ingredient["ING_IMG"]  # Store original image path
                    save_image(ingredient)
                    
                    # Check if the ING_IMG has changed
                    if ingredient["ING_IMG"] != original_img:
                        changes_made = True

            # Save the updated db.json only if changes were made
            if changes_made:
                with open(db_file_path, "w") as file:
                    json.dump(data, file, indent=2)

        except Exception as e:
            print(f"Error processing {db_file_path}: {e}")
        finally:
            self.is_processing = False  # Reset the flag after processing

def save_image(ingredient):
    img_data = ingredient.get("ING_IMG")
    
    # Check if the image data is in Base64 format
    if img_data and 'base64,' in img_data:
        print(f"Processing Base64 image data for {ingredient['ING_Name']}: {img_data}")
        try:
            # Extract the Base64 part
            header, encoded = img_data.split(',', 1)
            extension = header.split(';')[0].split('/')[1]  # Get the image type (e.g., png, jpeg)

            # Create a filename based on the ingredient name and extension
            filename = f"{ingredient['ING_Name'].replace(' ', '_').lower()}.{extension}"
            file_path = os.path.join(img_dir, filename)

            # Write the image to a file
            with open(file_path, "wb") as img_file:
                img_file.write(base64.b64decode(encoded))
            
            # Update the ingredient's image path
            ingredient["ING_IMG"] = f"/upload/{filename}"

            print(f"Image saved at: {file_path}")
        except Exception as e:
            print(f"Error saving image for {ingredient['ING_Name']}: {e}")

    # Check if the image data is a file path
    elif img_data and img_data.startswith("/upload/"):
        print(f"Image already formatted for {ingredient['ING_Name']}: {img_data}")

# Start watching for changes in db.json
def start_watching():
    event_handler = JsonChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=web_dir, recursive=False)
    observer.start()
    print("Watching for changes in db.json...")

    try:
        while True:
            time.sleep(1)  # Sleep to prevent busy waiting
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    # Start watching
    start_watching()