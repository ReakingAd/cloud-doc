const { app, BrowserWindow,Menu,ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate');
const AppWindow = require('./src/AppWindow');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    // mainWindow = new BrowserWindow({
    //     width: 1024,
	// 	height: 680,
	// 	webPreferences:{
	// 		nodeIntegration:true
	// 	}
	// })
	const mainWindowConfig = {
		width: 1440,
		height: 768
	}
	const urlLocation = isDev ? 'http://localhost:3000' : `file://${ path.join(__dirname,'./build/index.html') }`;
	mainWindow = new AppWindow( mainWindowConfig,urlLocation );
	mainWindow.on('closed',() => {
		mainwidow = null;
	})

	ipcMain.on('open-settings-window',() => {
		const settingsWindowConfig = {
			width:500,
			height:400,
			parent:mainWindow
		}

		const settingFileLocation = `file://${ path.join(__dirname,'./settings/settings.html') }`
		settingsWindow = new AppWindow( settingsWindowConfig,settingFileLocation );
	})
	// mainWindow.loadURL( urlLocation );
	// Open the DevTools.
	mainWindow.webContents.openDevTools();
	const menu = Menu.buildFromTemplate( menuTemplate() );
	Menu.setApplicationMenu( menu );
})