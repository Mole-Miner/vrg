import { app, BrowserWindow, screen } from 'electron';

const isDev = process.argv.at(2) === 'dev';

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    title: 'VRG v1.0.0',
    icon: __dirname + '/logo.ico'
  });

  win.setMenu(null);
  win.maximize();

  if (isDev) {
    win.webContents.openDevTools();
  }

  if (isDev) {
    win.loadURL('http://localhost:4200');
  } else {
    win.loadFile('../renderer/index.html');
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
