import { app, BrowserWindow, screen } from 'electron';
import * as path from 'node:path';
import * as url from 'node:url';

const isDev = process.argv.at(2) === 'dev';

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    title: 'VRG v1.0.0',
    icon: url.format({
      pathname: path.resolve(__dirname, 'logo.ico'),
    })
  });

  win.setMenu(null);
  win.maximize();
  win.webContents.openDevTools();

  if (isDev) {
    win.loadURL(url.format({
      hostname: 'localhost',
      port: 4200,
      protocol: 'http'
    }));
  } else {
    win.loadFile(url.format({
      pathname: path.resolve(__dirname, 'renderer', 'index.html'),
      protocol: 'file',
      slashes: true
    }));
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
