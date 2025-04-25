#!/bin/bash

# Exit on error
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
print_status() { echo -e "${BLUE}[*] $1${NC}\n----------------------------------------"; }
print_error() { echo -e "${RED}[!] $1${NC}"; }
print_warning() { echo -e "${YELLOW}[!] $1${NC}"; }
show_progress() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    local progress=0
    local total=100

    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf "\r[%c] %3d%%" "$spinstr" "$progress"
        spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        progress=$((progress + 3))
        [ $progress -gt $total ] && progress=0
    done
    printf "\r[✓] 100%%\n"
}

# Root check
[ "$EUID" -ne 0 ] && print_error "Please run as root" && exit 1

# Set noninteractive for apt
export DEBIAN_FRONTEND=noninteractive

# Force update sources
print_status "Updating apt sources..."
(apt-get update --allow-releaseinfo-change -y && apt-get upgrade -y) & show_progress $!

# Add NodeSource for Node.js (LTS)
print_status "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &> /dev/null
(apt-get install -y nodejs) & show_progress $!

# Install dependencies
print_status "Installing system dependencies..."
(apt-get install -y \
    git python3 python3-pip python3-venv \
    python3-dev python3-setuptools \
    build-essential libjpeg62-turbo-dev zlib1g-dev \
    python3-pil python3-requests tmux cron dbus-x11 \
    software-properties-common apt-transport-https curl) & show_progress $!

# Remove broken PPA if present
if [ -f "/etc/apt/sources.list.d/appimagelauncher-team-ubuntu-stable-plucky.list" ]; then
    print_warning "Removing broken AppImage Launcher PPA..."
    rm -f /etc/apt/sources.list.d/appimagelauncher-team-ubuntu-stable-plucky.list
fi

# Clone or update repo
print_status "Cloning/updating repo..."
if [ -d "/opt/cocktail-mixer" ]; then
    cd /opt/cocktail-mixer && git pull & show_progress $!
else
    git clone https://github.com/DeamonKing/new-repo.git /opt/cocktail-mixer & show_progress $!
    cd /opt/cocktail-mixer
fi

# Copy startup script
print_status "Setting up startup script..."
if [ -f "start_at_boot.sh" ]; then
    cp start_at_boot.sh /opt/cocktail-mixer/ & show_progress $!
else
    print_error "Missing start_at_boot.sh"
    exit 1
fi

# Python setup
print_status "Setting up Python virtual environment..."
(python3 -m venv /opt/cocktail-mixer/venv) & show_progress $!
source /opt/cocktail-mixer/venv/bin/activate

print_status "Installing Python packages..."
(pip install --upgrade pip) & show_progress $!
(pip install pyserial==3.5 firebase-admin==6.2.0 requests==2.31.0 python-dotenv==1.0.0 watchdog==3.0.0) & show_progress $!
deactivate

# Replace python3 with full path
sed -i 's|python3|/opt/cocktail-mixer/venv/bin/python3|g' /opt/cocktail-mixer/start_at_boot.sh

# Install Electron (via npm)
print_status "Installing Electron globally (may take a while)..."
(npm install -g electron --unsafe-perm=true --allow-root) & show_progress $!

# Create desktop shortcut
print_status "Creating desktop entry..."
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

# Add to autostart
print_status "Setting up autostart..."
mkdir -p /home/$SUDO_USER/.config/autostart
cp /usr/share/applications/cocktail-mixer.desktop /home/$SUDO_USER/.config/autostart/ & show_progress $!

# GNOME/KDE taskbar settings
print_status "Configuring taskbar settings..."
if [ -d "/usr/share/gnome-shell/extensions" ]; then
    export $(dbus-launch)
    gsettings set org.gnome.shell.extensions.dash-to-dock autohide true
    gsettings set org.gnome.shell.extensions.dash-to-dock dock-fixed false
    gsettings set org.gnome.shell.extensions.dash-to-dock intellihide true
elif [ -d "/usr/share/plasma" ]; then
    kwriteconfig5 --file ~/.config/plasma-org.kde.plasma.desktop-appletsrc \
        --group Containments --group 1 --group General --key hideTimeout 0
fi

# Permissions
chmod +x /opt/cocktail-mixer/start_at_boot.sh
chown -R $SUDO_USER:$SUDO_USER /opt/cocktail-mixer
chown $SUDO_USER:$SUDO_USER /usr/share/applications/cocktail-mixer.desktop

# Crontab
print_status "Setting up crontab..."
if ! crontab -l | grep -q "start_at_boot.sh"; then
    (crontab -l 2>/dev/null; echo "@reboot /opt/cocktail-mixer/start_at_boot.sh") | crontab -
fi

# Done
echo -e "\n${GREEN}========================================${NC}"
print_status "Installation complete!"
print_status "Reboot to test autostart, or run manually:"
echo -e "${GREEN}   /opt/cocktail-mixer/start_at_boot.sh${NC}"
echo -e "${GREEN}========================================${NC}\n"
