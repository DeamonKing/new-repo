# loading_screen.py
import tkinter as tk
from PIL import Image, ImageTk
import itertools
import os
import platform


def create_loading_screen():
    try:
        root = tk.Tk()
        root.title("Loading...")
        root.attributes("-fullscreen", True)
        root.configure(bg="black")
        
        # Add error handling for ESC key to exit
        root.bind('<Escape>', lambda e: root.destroy())
        
        # Add loading progress
        progress_var = tk.DoubleVar()
        progress_bar = tk.ttk.Progressbar(
            root, 
            variable=progress_var,
            maximum=100,
            mode='determinate'
        )
        progress_bar.pack(pady=10)

        # Create a frame to center the content
        center_frame = tk.Frame(root, bg="black")
        center_frame.pack(expand=True)  # Center the frame in the middle of the screen

        # Load the logo image without resizing
        if platform.system() == "Linux":
            logo_image = Image.open("/home/jecon/new-repo/static/img/logo.png")
        else:
            logo_image = Image.open("D:/new-repo/static/img/logo.png")
        
        logo_photo = ImageTk.PhotoImage(logo_image)  # No resizing or scaling
    except Exception as e:
        print(f"Error loading logo: {e}")
        logo_photo = None

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