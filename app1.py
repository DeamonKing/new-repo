import os
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
import subprocess
import time
import platform

# Define the base directory as the directory where this script is located
base_dir = os.path.dirname(__file__)
web_dir = os.path.join(base_dir, 'static')  # Define `static` folder path

class CustomHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # If the requested path is '/home', serve `index.html` from the `static` folder
        if path == '/home':
            return os.path.join(web_dir, 'index.html')
        
        # For all other paths, serve files from `web_dir` (static folder)
        return os.path.join(web_dir, path.lstrip('/'))

    def do_GET(self):
        # Use default GET behavior with the updated `translate_path`
        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        # Handling focus-in and focus-out events
        if self.path == '/focus-in':
            threading.Thread(target=self.execute_shell_script, args=('keyboardstart.sh',)).start()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Focus-in event received, running keyboardstart.sh")
        elif self.path == '/focus-out':
            threading.Thread(target=self.execute_shell_script, args=('keyboardstop.sh',)).start()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Focus-out event received, running keyboardstop.sh")
        elif self.path == '/shutdown':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Server shutting down...")
            print("Shutting down the server...")
            httpd.shutdown()  # Graceful shutdown of the server
            os._exit(0)
        else:
            self.send_response(404)
            self.end_headers()

    def execute_shell_script(self, script_name):
        # Run scripts from the same directory as the Python script
        script_path = os.path.join(base_dir, script_name)
        if platform.system() == "Windows":
            subprocess.Popen(['cmd', '/c', script_path])
        elif platform.system() == "Linux":
            subprocess.Popen(['sh', script_path])
        else:
            print(f"Unsupported operating system for script execution.")

def start_http_server():
    global httpd
    httpd = HTTPServer(("127.0.0.1", 5000), CustomHandler)
    print("HTTP server running on http://127.0.0.1:5000")
    httpd.serve_forever()

def start_electron_app():
    time.sleep(1)
    if platform.system() == "Windows":
        electron_executable = r'C:\Users\LOQ\AppData\Roaming\npm\node_modules\electron\dist\electron.exe'
    elif platform.system() == "Linux":
        electron_executable = 'electron'
    else:
        raise EnvironmentError("Unsupported operating system")

    # Disable caching by adding the --no-cache flag to the Electron process
    electron_process = subprocess.Popen([electron_executable, '--disable-gpu', '--no-sandbox', '--use-gl=swiftshader', '--no-cache', os.path.join(web_dir, 'main.js')])
    electron_process.communicate()

if __name__ == "__main__":
    # Start the HTTP server in a separate thread
    http_thread = threading.Thread(target=start_http_server)
    http_thread.start()

    # Start the Electron app after a slight delay to ensure the server is up
    start_electron_app()
