Cocktail Mixer Application
=========================

This application is a cocktail mixing system that allows you to create and manage various cocktail recipes. It includes a web interface and integrates with hardware components for automated mixing.

Installation
-----------

1. Prerequisites:
   - Linux-based operating system
   - Root/sudo access
   - Internet connection

2. Installation Steps:
   a. Download the installer package
   b. Open a terminal and navigate to the installer directory
   c. Make the installer executable:
      ```bash
      chmod +x install.sh
      ```
   d. Run the installer as root:
      ```bash
      sudo ./install.sh
      ```

   The installer will:
   - Install required system dependencies (Python, Node.js, npm, etc.)
   - Clone the repository to /opt/cocktail-mixer
   - Install Python dependencies
   - Install Electron
   - Create a desktop shortcut
   - Set up automatic startup on boot

3. Post-Installation:
   - The application will be available in your applications menu
   - A desktop shortcut will be created
   - The application will start automatically on system boot

Uninstallation
-------------

To completely remove the application:

1. Open a terminal
2. Navigate to the installer directory
3. Make the uninstaller executable:
   ```bash
   chmod +x uninstall.sh
   ```
4. Run the uninstaller as root:
   ```bash
   sudo ./uninstall.sh
   ```

The uninstaller will:
- Remove all application files from /opt/cocktail-mixer
- Remove the desktop shortcut
- Remove the automatic startup configuration

Troubleshooting
--------------

1. If the application doesn't start:
   - Check if all dependencies are installed correctly
   - Verify that the application has proper permissions
   - Check system logs for any error messages

2. If the automatic startup doesn't work:
   - Verify that the crontab entry exists
   - Check system logs for any startup errors

3. For hardware-related issues:
   - Ensure all hardware components are properly connected
   - Check device permissions
   - Verify serial port configurations

Support
-------

For additional support or to report issues:
- Contact the development team
- Check the GitHub repository for updates and documentation

Note: This application requires root privileges for installation and uninstallation to properly set up system-wide configurations and permissions. 