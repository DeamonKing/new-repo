#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print status messages
print_status() {
    echo -e "${GREEN}[*] $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}[!] $1${NC}"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}[!] $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root"
    exit 1
fi
# Update package lists
print_status "Updating package lists..."
apt-get update

# Install required system packages
print_status "Installing system dependencies..."
apt-get install -y git python3 python3-pip nodejs npm tmux cron

# Clone the repository
print_status "Cloning repository..."
if [ -d "/opt/cocktail-mixer" ]; then
    print_warning "Repository already exists. Updating..."
    cd /opt/cocktail-mixer
    git pull
else
    git clone https://github.com/DeamonKing/new-repo.git /opt/cocktail-mixer
    cd /opt/cocktail-mixer
fi

# Copy start_at_boot.sh to the installation directory
print_status "Setting up startup script..."
if [ -f "start_at_boot.sh" ]; then
    cp start_at_boot.sh /opt/cocktail-mixer/
else
    print_error "start_at_boot.sh not found in repository!"
    exit 1
fi

# Install Python dependencies
print_status "Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip3 install --break-system-packages -r requirements.txt
else
    print_error "requirements.txt not found in repository!"
    exit 1
fi

# Install Electron
print_status "Installing Electron..."
if command -v npm >/dev/null 2>&1; then
    npm install -g electron
else
    print_error "npm not found! Please ensure Node.js and npm are properly installed."
    exit 1
fi

# Create desktop shortcut
print_status "Creating desktop shortcut..."
cat > /usr/share/applications/cocktail-mixer.desktop << EOL
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

# Create autostart directory if it doesn't exist
print_status "Setting up autostart..."
mkdir -p /home/$SUDO_USER/.config/autostart
cp /usr/share/applications/cocktail-mixer.desktop /home/$SUDO_USER/.config/autostart/

# Configure taskbar settings
print_status "Configuring taskbar settings..."
# For GNOME
if [ -d "/usr/share/gnome-shell/extensions" ]; then
    gsettings set org.gnome.shell.extensions.dash-to-dock autohide true
    gsettings set org.gnome.shell.extensions.dash-to-dock dock-fixed false
    gsettings set org.gnome.shell.extensions.dash-to-dock intellihide true
fi

# For KDE
if [ -d "/usr/share/plasma" ]; then
    kwriteconfig5 --file ~/.config/plasma-org.kde.plasma.desktop-appletsrc --group Containments --group 1 --group General --key hideTimeout 0
fi

# Make start_at_boot.sh executable
print_status "Making start_at_boot.sh executable..."
chmod +x /opt/cocktail-mixer/start_at_boot.sh

# Set up crontab for startup
print_status "Setting up crontab for startup..."
# Check if the entry already exists
if ! crontab -l | grep -q "start_at_boot.sh"; then
    # Add the startup entry using crontab -e
    (crontab -l 2>/dev/null; echo "@reboot /opt/cocktail-mixer/start_at_boot.sh") | crontab -
fi

# Set proper permissions
print_status "Setting permissions..."
chown -R $SUDO_USER:$SUDO_USER /opt/cocktail-mixer
chown $SUDO_USER:$SUDO_USER /usr/share/applications/cocktail-mixer.desktop

print_status "Installation completed successfully!"
print_status "The application will start automatically on boot."
print_status "You can also find it in your applications menu." 