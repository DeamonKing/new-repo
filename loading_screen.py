# loading_screen.py
import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import itertools
import os
import platform


def create_loading_screen():
    root = tk.Tk()
    root.title("Loading...")
    root.attributes("-fullscreen", True)
    root.configure(bg="black")
    
    # Add error handling for ESC key to exit
    root.bind('<Escape>', lambda e: root.destroy())
    
    # Create a frame to center the content
    center_frame = tk.Frame(root, bg="black")
    center_frame.pack(expand=True)  # Center the frame in the middle of the screen
    
    # Add loading progress
    progress_var = tk.DoubleVar()
    progress_bar = ttk.Progressbar(
        root, 
        variable=progress_var,
        maximum=100,
        mode='determinate'
    )
    progress_bar.pack(pady=10)

    # Load the logo image without resizing
    logo_photo = None
    try:
        if platform.system() == "Linux":
            logo_path = "/home/jecon/new-repo/static/img/logo.png"
        else:
            logo_path = os.path.join(os.path.dirname(__file__), "static", "img", "logo.png")
        
        if os.path.exists(logo_path):
            logo_image = Image.open(logo_path)
            logo_photo = ImageTk.PhotoImage(logo_image)  # No resizing or scaling
        else:
            print(f"Logo file not found at: {logo_path}")
    except Exception as e:
        print(f"Error loading logo: {e}")

    # Display logo
    if logo_photo:
        logo_label = tk.Label(center_frame, image=logo_photo, bg="black")
        logo_label.image = logo_photo  # Keep a reference to avoid garbage collection
        logo_label.pack(pady=20)

    # Loading text with animation
    loading_text = tk.Label(center_frame, text="Loading", font=("Helvetica", 24), fg="white", bg="black")
    loading_text.pack()

    # Create an animation sequence for dots
    dots_sequence = itertools.cycle(["", ".", "..", "..."])

    def animate():
        # Update the loading text with the next sequence of dots
        loading_text.config(text="Loading" + next(dots_sequence))
        root.after(500, animate)  # Repeat every 500ms

    # Start the animation
    animate()

    root.mainloop()

if __name__ == "__main__":
    create_loading_screen()