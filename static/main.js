const { app, BrowserWindow, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,  // Initial width
    height: 1080,  // Initial height
    fullscreen: false,  // Make sure the window is not in fullscreen by default
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),  // If you're using a preload.js file
      webSecurity: false
    }
  });

  // Maximize the window after creation
  mainWindow.maximize();

  // Disable cache by setting cache headers and clearing the session cache
  session.defaultSession.clearCache(() => {
    console.log('Cache cleared.');
  });

  // Load the HTML page served by your Python HTTP server
  mainWindow.loadURL('http://127.0.0.1:5000/home');  // Ensure this is the correct URL for the 'home' endpoint

  // Set cache control headers for no cache in the Electron app itself
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Cache-Control'] = 'no-store, no-cache, must-revalidate';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Reload the window when it gets focus to ensure fresh content
  mainWindow.on('focus', () => {
    mainWindow.reload(); // Force a reload on focus
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
