"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const createWindow = () => {
    const { width, height } = electron_1.screen.getPrimaryDisplay().workAreaSize;
    const win = new electron_1.BrowserWindow({
        width,
        height,
        minWidth: 800,
        minHeight: 600
    });
    win.setMenu(null);
    win.maximize();
    win.webContents.openDevTools();
    win.loadFile('index.html');
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
