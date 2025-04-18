#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print status messages with progress bar
print_status() {
    echo -e "${BLUE}[*] $1${NC}"
    echo -e "${BLUE}----------------------------------------${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}[!] $1${NC}"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}[!] $1${NC}"
}

# Function to show progress bar
show_progress() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    local progress=0
    local total=100
    
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf "\r[%c] %3d%%" "$spinstr" "$progress"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        progress=$((progress + 1))
        if [ $progress -gt $total ]; then
            progress=0
        fi
    done
    printf "\r[✓] 100%%\n"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root"
    exit 1
fi

# Install system dependencies for Python packages
print_status "Installing system dependencies for Python packages..."
(apt-get install -y python3-dev python3-setuptools build-essential libjpeg-dev zlib1g-dev python3-pil python3-requests python3-venv) & show_progress $!

# Install pv if not present
if ! command -v pv >/dev/null 2>&1; then
    print_status "Installing progress viewer..."
    apt-get install -y pv
fi

# Remove problematic PPA if it exists
if [ -f "/etc/apt/sources.list.d/appimagelauncher-team-ubuntu-stable-plucky.list" ]; then
    print_warning "Removing problematic AppImage Launcher PPA..."
    rm -f /etc/apt/sources.list.d/appimagelauncher-team-ubuntu-stable-plucky.list
fi

# Update package lists with progress bar
print_status "Updating package lists..."
(apt-get update 2>/dev/null) & show_progress $!

# Install required system packages with progress bar
print_status "Installing system dependencies..."
(apt-get install -y git python3 python3-pip nodejs npm tmux cron dbus-x11 python3-venv) & show_progress $!

# Clone the repository with progress bar
print_status "Cloning repository..."
if [ -d "/opt/cocktail-mixer" ]; then
    print_warning "Repository already exists. Updating..."
    cd /opt/cocktail-mixer
    (git pull) & show_progress $!
else
    (git clone https://github.com/DeamonKing/new-repo.git /opt/cocktail-mixer) & show_progress $!
    cd /opt/cocktail-mixer
fi

# Copy start_at_boot.sh with progress bar
print_status "Setting up startup script..."
if [ -f "start_at_boot.sh" ]; then
    (cp start_at_boot.sh /opt/cocktail-mixer/) & show_progress $!
else
    print_error "start_at_boot.sh not found in repository!"
    exit 1
fi

# Install Python dependencies with progress bar
print_status "Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    # Create a virtual environment
    print_status "Setting up Python virtual environment..."
    (python3 -m venv /opt/cocktail-mixer/venv) & show_progress $!
    
    # Activate virtual environment and install packages
    source /opt/cocktail-mixer/venv/bin/activate
    
    # Install pyserial
    (pip install pyserial==3.5) & show_progress $!
    # Install firebase-admin
    (pip install firebase-admin==6.2.0) & show_progress $!
    # Install requests
    (pip install requests==2.31.0) & show_progress $!
    # Install python-dotenv
    (pip install python-dotenv==1.0.0) & show_progress $!
    # Install watchdog
    (pip install watchdog==3.0.0) & show_progress $!
    
    # Deactivate virtual environment
    deactivate
    
    # Update start_at_boot.sh to use virtual environment
    sed -i 's|python3|/opt/cocktail-mixer/venv/bin/python3|g' /opt/cocktail-mixer/start_at_boot.sh
else
    print_error "requirements.txt not found in repository!"
    exit 1
fi

# Install Electron with progress bar
print_status "Installing Electron..."
if command -v npm >/dev/null 2>&1; then
    (npm install -g electron) & show_progress $!
else
    print_error "npm not found! Please ensure Node.js and npm are properly installed."
    exit 1
fi

# Create desktop shortcut
print_status "Creating desktop shortcut..."
(cat > /usr/share/applications/cocktail-mixer.desktop << EOL
[Desktop Entry]
Name=Cocktail Mixer
Comment=Cocktail Mixing System
Exec=/opt/cocktail-mixer/start_at_boot.sh
Icon=/opt/cocktail-mixer/static/icon.png
Terminal=false
Type=Application
Categories=Utility;
StartupWMClass=cocktail-mixer
X-GNOME-Autostart-enabled=true
EOL
) & show_progress $!

# Create autostart directory if it doesn't exist
print_status "Setting up autostart..."
(mkdir -p /home/$SUDO_USER/.config/autostart
cp /usr/share/applications/cocktail-mixer.desktop /home/$SUDO_USER/.config/autostart/) & show_progress $!

# Configure taskbar settings
print_status "Configuring taskbar settings..."
# For GNOME
if [ -d "/usr/share/gnome-shell/extensions" ]; then
    # Start dbus session
    export $(dbus-launch)
    (gsettings set org.gnome.shell.extensions.dash-to-dock autohide true
    gsettings set org.gnome.shell.extensions.dash-to-dock dock-fixed false
    gsettings set org.gnome.shell.extensions.dash-to-dock intellihide true) & show_progress $!
fi

# For KDE
if [ -d "/usr/share/plasma" ]; then
    (kwriteconfig5 --file ~/.config/plasma-org.kde.plasma.desktop-appletsrc --group Containments --group 1 --group General --key hideTimeout 0) & show_progress $!
fi

# Make start_at_boot.sh executable
print_status "Making start_at_boot.sh executable..."
(chmod +x /opt/cocktail-mixer/start_at_boot.sh) & show_progress $!

# Set up crontab for startup
print_status "Setting up crontab for startup..."
if ! crontab -l | grep -q "start_at_boot.sh"; then
    print_status "Adding start_at_boot.sh to crontab..."
    (crontab -l 2>/dev/null; echo "@reboot /opt/cocktail-mixer/start_at_boot.sh") | crontab -
    if [ $? -eq 0 ]; then
        print_status "Successfully added to crontab"
    else
        print_error "Failed to add to crontab"
    fi
else
    print_warning "start_at_boot.sh already exists in crontab"
fi

# Set proper permissions
print_status "Setting permissions..."
(chown -R $SUDO_USER:$SUDO_USER /opt/cocktail-mixer
chown $SUDO_USER:$SUDO_USER /usr/share/applications/cocktail-mixer.desktop) & show_progress $!

echo -e "\n${GREEN}========================================${NC}"
print_status "Installation completed successfully!"
print_status "The application will start automatically on boot."
print_status "You can also find it in your applications menu."
echo -e "${GREEN}========================================${NC}\n" 