// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')

async function loadFile(){ //TODO:這樣會有問題嗎
  let d
  try{//讀不到檔案的例外處理
    d = fs.readFileSync("./event.json","utf-8")
  }catch{
    fs.writeFileSync("./event.json","[]")
    mainWindow.webContents.send('createNewFile', 0)
  }finally{
    d = fs.readFileSync("./event.json","utf-8")
  }
  
  data = JSON.parse(d)
  //console.log(data)
  //return d//TODO: Maybe here's the probem?
  return data
}
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  globalThis['mainWindow'] = mainWindow
  //console.log("a")

  ipcMain.on('write-to-console',(event, text)=>{
    console.log(text)
  })

  ipcMain.on('fileUpdate', (event, dataList)=>{
    fs.writeFileSync("./event.json",dataList)
  })

  // mainWindow.on('close',(e)=>{
  //   e.preventDefault()
  //   console.log("a")
  //   mainWindow.webContents.send('onWindowCloseOperation')
  // })


  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  
  ipcMain.handle('fileRead', loadFile)
  createWindow() 

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
