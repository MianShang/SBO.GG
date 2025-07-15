const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const psList = require('ps-list').default; // 프로세스 리스트 가져오는 모듈

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,       // 최소 너비
    minHeight: 800,       // 최소 높이
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // IPC 사용을 위해 false (보안 강화 시 preload 사용 권장)
    }
  });

  win.setMenu(null); // 기본 메뉴바 제거

  win.loadURL(
    app.isPackaged
      ? `file://${path.join(__dirname, '../dist/index.html')}`
      : 'http://localhost:5173'
  );
}

// 프로세스 요청 수신
ipcMain.handle('get-process-list', async () => {
  const processes = await psList();
  return processes;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});