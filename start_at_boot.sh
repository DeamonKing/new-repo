#!/bin/bash

# Set the display environment variable
export DISPLAY=:0

# Start the loading screen in the background
python3 /home/jecon/new-repo/loading_screen.py &

# Wait a moment to ensure the process starts
sleep 1

# Get the PID of the loading screen using ps and grep
LOADING_PID=$(ps aux | grep 'loading_screen.py' | grep -v 'grep' | awk '{print $2}')
echo "Loading screen PID found using grep: $LOADING_PID"

# Check if the PID was found
if [ -z "$LOADING_PID" ]; then
    echo "Failed to get loading screen PID. Ensure loading_screen.py is running."
    exit 1
fi

# Loop until the display is connected
while true; do
    # Check if the display is connected
    if xrandr | grep " connected"; then
        echo "Display is connected. Terminating loading screen and launching the Python application in tmux..."
        tmux new-session -d -s myapp 'cd /home/jecon/new-repo && python3 app1.py'
        sleep 3
        kill "$LOADING_PID"
        echo "Python application is running in tmux session 'myapp'."
        break
    else
        echo "Display not connected. Checking again in 1 seconds..."
        sleep 1
    fi
done
