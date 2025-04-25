#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[*] $1${NC}"; }
print_error() { echo -e "${RED}[!] $1${NC}"; }
print_warning() { echo -e "${YELLOW}[!] $1${NC}"; }

show_progress() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    local progress=0
    local total=100
    while ps -p $pid &>/dev/null; do
        local temp=${spinstr#?}
        printf "\r[%c] %3d%%" "$spinstr" "$progress"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        progress=$((progress + 1))
        if [ $progress -gt $total ]; then progress=0; fi
    done
    printf "\r[✓] 100%%\n"
}

# Check root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root"
    exit 1
fi

# Install essential packages
print_status "Installing core dependencies..."
(apt update && apt install -y curl git build-essential python3-dev python3-pip python3-venv libjpeg-dev zlib1g-dev python3-pil dbus-x11 tmux cron) & show_progress $!

# Install Node.js and npm (via n)
print_status "Installing Node.js and npm..."
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o /usr/local/bin/n
chmod +x /usr/local/bin/n
export N_PREFIX=/usr/local
n lts & show_progress $!

# Ensure npm path is loaded
export PATH="$PATH:/usr/local/bin"

# Verify node and npm
node -v || print_error "Node.js not installed"
npm -v || print_error "npm not installed"

# Install Electron globally
print_status "Installing Electron globally..."
npm install -g electron --arch=arm64 --unsafe-perm=true & show_progress $!

# Clone or update repository
REPO_PATH="/opt/cocktail-mixer"
print_status "Cloning or updating the repository..."
if [ -d "$REPO_PATH" ]; then
    print_warning "Repository exists. Pulling latest changes..."
    cd "$REPO_PATH" && (git pull) & show_progress $!
else
    (git clone https://github.com/DeamonKing/new-repo.git "$REPO_PATH") & show_progress $!
    cd "$REPO_PATH"
fi

# Set up startup script
print_status "Setting up startup script..."
if [ -f "start_at_boot.sh" ]; then
    cp start_at_boot.sh "$REPO_PATH/"
else
    print_error "start_at_boot.sh missing in repo!"
    exit 1
fi

# Python virtual environment and dependencies
print_status "Creating Python virtual environment..."
(python3 -m venv "$REPO_PATH/venv") & show_progress $!
source "$REPO_PATH/venv/bin/activate"

print_status "Installing Python packages..."
pip install --upgrade pip & show_progress $!
pip install pyserial==3.5 firebase-admin==6.2.0 requests==2.31.0 python-dotenv==1.0.0 watchdog==3.0.0 & show_progress $!
deactivate

# Fix Python path in startup script
sed -i 's|python3|/opt/cocktail-mixer/venv/bin/python3|g' "$REPO_PATH/start_at_boot.sh"

# Create desktop entry
print_status "Creating desktop shortcut..."
cat > /usr/share/applications/cocktail-mixer.desktop << EOL
[Desktop Entry]
Name=Cocktail Mixer
Comment=Cocktail Mixing System
Exec=$REPO_PATH/start_at_boot.sh
Icon=$REPO_PATH/static/icon.png
Terminal=false
Type=Application
Categories=Utility;
X-GNOME-Autostart-enabled=true
EOL

# Set autostart
print_status "Setting up autostart..."
mkdir -p /home/$SUDO_USER/.config/autostart
cp /usr/share/applications/cocktail-mixer.desktop /home/$SUDO_USER/.config/autostart/

# Set permissions
print_status "Setting permissions..."
chown -R $SUDO_USER:$SUDO_USER "$REPO_PATH"
chown $SUDO_USER:$SUDO_USER /usr/share/applications/cocktail-mixer.desktop

# Crontab setup
print_status "Setting up crontab..."
(crontab -l 2>/dev/null; echo "@reboot $REPO_PATH/start_at_boot.sh") | crontab -

print_status "Making startup script executable..."
chmod +x "$REPO_PATH/start_at_boot.sh"

# Final message
echo -e "\n${GREEN}========================================${NC}"
print_status "Installation completed successfully!"
print_status "Application will start on boot and appear in the menu."
echo -e "${GREEN}========================================${NC}\n"
