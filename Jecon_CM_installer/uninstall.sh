#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Function to print status messages
print_status() {
    echo -e "${GREEN}[*] $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}[!] $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root"
    exit 1
fi

# Remove application files
print_status "Removing application files..."
if [ -d "/opt/cocktail-mixer" ]; then
    rm -rf /opt/cocktail-mixer
fi

# Remove desktop shortcut
print_status "Removing desktop shortcut..."
if [ -f "/usr/share/applications/cocktail-mixer.desktop" ]; then
    rm /usr/share/applications/cocktail-mixer.desktop
fi

# Remove crontab entry
print_status "Removing crontab entry..."
TEMP_CRON=$(mktemp)
crontab -l > "$TEMP_CRON" 2>/dev/null || true
if grep -q "start_at_boot.sh" "$TEMP_CRON"; then
    sed -i '/start_at_boot.sh/d' "$TEMP_CRON"
    crontab "$TEMP_CRON"
fi
rm "$TEMP_CRON"

print_status "Uninstallation completed successfully!" 