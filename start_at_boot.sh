#!/bin/bash

# Set the display environment variable
export DISPLAY=:0

# Start the loading screen in the background
python3 /home/jecon/new-repo/loading_screen.py &
LOADING_PID=$!  # Get the PID of the loading screen

# Loop until the display is connected
while true; do
    # Check if the display is connected
    if xrandr | grep " connected"; then
        echo "Display is connected. Terminating loading screen and launching the Python application in tmux..."

        # Kill the loading screen
        kill $LOADING_PID

        # Start a new tmux session named 'myapp' and run the Python application
        tmux new-session -d -s myapp 'cd /home/jecon/new-repo && python3 app1.py'

        echo "Python application is running in tmux session 'myapp'."
        break
    else
        echo "Display not connected. Checking again in 5 seconds..."
        sleep 5
    fi
done
