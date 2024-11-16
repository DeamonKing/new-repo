import json
import os
import platform
import subprocess
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import serial  # Import the serial library

# Define the base directory as the directory where this script is located
base_dir = os.path.dirname(__file__)
web_dir = os.path.join(base_dir, "static")  # Define `static` folder path

class CustomHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # If the requested path is '/home', serve `index.html` from the `static` folder
        if path == "/home":
            return os.path.join(web_dir, "index.html")

        # For all other paths, serve files from `web_dir` (static folder)
        return os.path.join(web_dir, path.lstrip("/"))

    def do_GET(self):
        # Use default GET behavior with the updated `translate_path`
        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)

        # Handling focus-in and focus-out events
        if self.path == "/focus-in":
            if platform.system() != "Windows":
                threading.Thread(
                    target=self.execute_shell_script, args=("keyboardstart.sh",)
                ).start()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Focus-in event received, running keyboardstart.sh")
            else:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(
                    b"Focus-in event received, but keyboard functionality is disabled on Windows."
                )

        elif self.path == "/focus-out":
            if platform.system() != "Windows":
                threading.Thread(
                    target=self.execute_shell_script, args=("keyboardstop.sh",)
                ).start()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Focus-out event received, running keyboardstop.sh")
            else:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(
                    b"Focus-out event received, but keyboard functionality is disabled on Windows."
                )

        elif self.path == "/shutdown":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Server shutting down...")
            print("Shutting down the server...")
            httpd.shutdown()  # Graceful shutdown of the server
            os._exit(0)

        elif self.path == "/addIngredient":
            self.add_ingredient(post_data)
            
        elif self.path == "/send-pipes":
            self.handle_send_pipes(post_data)
            return

        else:
            self.send_response(404)
            self.end_headers()

    def execute_shell_script(self, script_name):
        # Run scripts from the same directory as the Python script
        script_path = os.path.join(base_dir, script_name)
        if platform.system() == "Windows":
            subprocess.Popen(["cmd", "/c", script_path])
        elif platform.system() == "Linux":
            subprocess.Popen(["sh", script_path])
        else:
            print(f"Unsupported operating system for script execution.")

    def add_ingredient(self, post_data):
        # Load the existing ingredients from db.json
        try:
            with open(os.path.join(web_dir, "db.json"), "r") as file:
                data = json.load(file)

            # Parse the new ingredient data
            new_ingredient = json.loads(post_data)

            # Append the new ingredient to the existing data
            data[0]["data"].append(new_ingredient)

            # Write the updated data back to db.json
            with open(os.path.join(web_dir, "db.json"), "w") as file:
                json.dump(data, file, indent=2)

            self.send_response(201)
            self.end_headers()
            self.wfile.write(b"Ingredient added successfully")
        except Exception as e:
            print(f"Error adding ingredient: {e}")  # Log the error to the console
            self.send_response(500)  # Internal Server Error
            self.end_headers()
            self.wfile.write(f"Error saving ingredient: {str(e)}".encode())
    
    def handle_send_pipes(self, post_data):
        # Parse the incoming data
        assigned_pipes = json.loads(post_data)

        # Send data to serial output and get the response
        response = self.send_to_serial_output(assigned_pipes)

        if response == "OK":
            # Respond back to the client with 'OK'
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"OK")  # Send 'OK' response back to JavaScript
        else:
            # If there was an error, respond with the error message
            self.send_response(500)  # Internal Server Error
            self.end_headers()
            self.wfile.write(response.encode())  # Send the error message back to JavaScript

    def send_to_serial_output(self, assigned_pipes):
        # Open the serial port (adjust the port and baudrate as necessary)
        try:
            with serial.Serial('/dev/ttyUSB0', 9600, timeout=1) as ser:  # Example for Linux
                for ingredient, pipe in assigned_pipes.items():
                    message = f"{ingredient}: {pipe}\n"
                    ser.write(message.encode('utf-8'))  # Send the message to the serial port
                    print(f"Sent to serial: {message.strip()}")  # Log the sent message

                # Wait for an 'OK' response from the serial machine
                while True:
                    if ser.in_waiting > 0:
                        response = ser.readline().decode('utf-8').strip()  # Read response from serial
                        if response == 'OK':  # Check if the response is 'OK'
                            print("Received OK from serial machine.")
                            return "OK"  # Return OK to indicate success
        except serial.SerialException as e:
            error_message = f"Serial error: {str(e)}"
            print(error_message)
            return error_message  # Return the error message for the frontend
        except Exception as e:
            error_message = f"Error sending to serial output: {str(e)}"
            print(error_message)
            return error_message  # Return the error message for the frontend


def start_http_server():
    global httpd
    httpd = HTTPServer(("127.0.0.1", 5000), CustomHandler)
    print("HTTP server running on http://127.0.0.1:5000")
    httpd.serve_forever()


def start_electron_app():
    time.sleep(2)
    os.environ["DISPLAY"] = ":0"
    if platform.system() == "Windows":
        electron_executable = r"C:\Users\LOQ\AppData\Roaming\npm\node_modules\electron\dist\electron.exe"
    elif platform.system() == "Linux":
        electron_executable = "/usr/local/bin/electron"
    else:
        raise EnvironmentError("Unsupported operating system")

    # Disable caching by adding the --no-cache flag to the Electron process
    electron_process = subprocess.Popen(
        [
            electron_executable,
            os.path.join(web_dir, "main.js"),
        ]
    )
    electron_process.communicate()
    
def start_image_handler():
    """Start the image handler script in a separate thread."""
    subprocess.Popen(["python", os.path.join(base_dir, "image_handler.py")])


if __name__ == "__main__":
    # Start the HTTP server in a separate thread
    http_thread = threading.Thread(target=start_http_server)
    http_thread.start()
    
    start_image_handler()

    # Start the Electron app after a slight delay to ensure the server is up
    start_electron_app()
