const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,       // 최소 너비
    minHeight: 800,       // 최소 높이
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.setMenu(null); // 기본 메뉴바 제거

  win.loadURL(
    app.isPackaged
      ? `file://${path.join(__dirname, '../dist/index.html')}`
      : 'http://localhost:5173'
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});