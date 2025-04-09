# Cocktail Mixing System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Windows Setup](#windows-setup)
3. [Raspberry Pi Setup](#raspberry-pi-setup)
4. [Application Features](#application-features)
5. [Troubleshooting](#troubleshooting)

## System Overview

The Cocktail Mixing System is a comprehensive solution for automated cocktail preparation. It consists of:
- A web-based user interface for cocktail selection and management
- A Python backend for processing orders and controlling hardware
- Serial communication with Arduino for pump control
- Support for both Windows and Raspberry Pi platforms

## Windows Setup

### Prerequisites
- Windows 10 or later
- Python 3.11 or later
- Git (optional, for version control)

### Installation Steps

1. **Install Python**
   - Download Python 3.11 from [python.org](https://www.python.org/downloads/)
   - During installation, check "Add Python to PATH"
   - Verify installation by opening Command Prompt and typing `python --version`

2. **Clone or Download Repository**
   ```bash
   git clone [repository-url]
   ```
   Or download the ZIP file and extract it

3. **Directory Structure**
   Ensure your project has the following structure:
   ```
   project_root/
   ├── app.py
   ├── setup.py
   ├── setup.bat
   ├── requirements.txt
   ├── static/
   │   ├── index.html
   │   ├── style.css
   │   ├── script.js
   │   ├── config.json
   │   └── db.json
   └── img/
       ├── logo.png
       └── favicon.ico
   ```

4. **Create Executable**
   - Double-click `setup.bat`
   - Wait for the process to complete
   - The executable will be created in the `dist` folder

5. **Run the Application**
   - Navigate to the `dist` folder
   - Double-click `CocktailApp.exe`
   - The application will start and be accessible at `http://127.0.0.1:5000`

## Raspberry Pi Setup

### Prerequisites
- Raspberry Pi 4 (recommended) or Raspberry Pi 3
- MicroSD card (16GB or larger recommended)
- Power supply
- HDMI cable and monitor (for initial setup)
- Keyboard and mouse (for initial setup)
- Internet connection

### Installation Steps

1. **Install Raspberry Pi OS**
   - Download Raspberry Pi OS from [raspberrypi.org](https://www.raspberrypi.org/software/)
   - Use Raspberry Pi Imager to write the OS to your MicroSD card
   - Insert the MicroSD card into your Raspberry Pi
   - Connect peripherals and power on the device

2. **Initial Setup**
   - Complete the initial setup wizard
   - Update the system:
     ```bash
     sudo apt update
     sudo apt upgrade
     ```

3. **Install Required Software**
   ```bash
   sudo apt install python3-pip python3-venv git
   ```

4. **Set Up Python Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Configure Serial Port**
   ```bash
   sudo raspi-config
   ```
   - Navigate to "Interface Options"
   - Enable Serial Port
   - Disable Serial Console
   - Reboot when prompted

6. **Clone or Download Repository**
   ```bash
   git clone [repository-url]
   ```
   Or download the ZIP file and extract it

7. **Configure Auto-Start**
   Create a service file:
   ```bash
   sudo nano /etc/systemd/system/cocktail.service
   ```
   Add the following content:
   ```ini
   [Unit]
   Description=Cocktail Mixing System
   After=network.target

   [Service]
   ExecStart=/home/pi/venv/bin/python /home/pi/cocktail/app.py
   WorkingDirectory=/home/pi/cocktail
   StandardOutput=inherit
   StandardError=inherit
   Restart=always
   User=pi

   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start the service:
   ```bash
   sudo systemctl enable cocktail.service
   sudo systemctl start cocktail.service
   ```

8. **Configure Network**
   - Set a static IP address if needed
   - Configure firewall if necessary:
     ```bash
     sudo ufw allow 5000/tcp
     ```

## Application Features

### Cocktail Management
- Add/Edit/Delete cocktails
- Manage ingredients
- Assign ingredients to pumps
- Set drink intensity (light/medium/strong)
- Configure alcoholic/non-alcoholic options

### Hardware Control
- Serial communication with Arduino
- Pump control for precise measurements
- Real-time status monitoring
- Error handling and safety features

### User Interface
- Modern, responsive design
- Real-time updates
- Intuitive navigation
- Customizable theme
- Touch-screen optimized

## Troubleshooting

### Windows Issues
1. **Executable Creation Fails**
   - Ensure all required files are in place
   - Check Python installation
   - Verify directory structure

2. **Application Won't Start**
   - Check if port 5000 is available
   - Verify serial port connection
   - Check system requirements

### Raspberry Pi Issues
1. **Serial Communication Problems**
   - Verify serial port configuration
   - Check Arduino connection
   - Review system logs: `sudo journalctl -u cocktail.service`

2. **Network Connectivity**
   - Verify IP address
   - Check firewall settings
   - Test network connection

3. **Service Won't Start**
   - Check service status: `sudo systemctl status cocktail.service`
   - Review logs for errors
   - Verify file permissions

### General Issues
1. **Pump Control Problems**
   - Check serial connection
   - Verify pump assignments
   - Review error logs

2. **Database Issues**
   - Verify file permissions
   - Check JSON file integrity
   - Ensure proper formatting

## Support
For additional support, please contact:
- Email: [support-email]
- GitHub: [repository-url]
- Documentation: [documentation-url] 