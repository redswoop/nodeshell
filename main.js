const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const http = require('http')
const fs = require('fs')

var spawn = require('child_process').spawn;
var querystring = require('querystring');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};


function return_code(req)
{
    return function (code) {
        if (code != 0) {
            req.write("\nexit code: " +code);
        }
        req.end();
    }
}


ipcMain.on('run', (event, args) => {
    console.log(`Received data ${args}`)
    console.log('wants to run: ' + args.func + ", cwd: " + args.cwd);
    var cwd = args.cwd;
    var split = args.func.split(" ");
    var aa = [];
    for (var i = 1; i < split.length; ++i) {
        console.log("arg item: " + split[i]);
        aa.push(split[i]);
    }
    console.log("arg0 is '" + split[0] + "'" + " aa length is " + aa.length);
    var ls = spawn(split[0], aa, {cwd: cwd});
    ls.stdout.pipe(res);
    ls.on('exit', return_code(res));
})

ipcMain.on('view', (event, args) => {
    var filename = path.resolve(args.cwd, args.filename);
    console.log("Viewing " + filename);
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
})

/*
http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url);
    var uri = parsedUrl.pathname;
    var args = querystring.parse(parsedUrl.query);
    console.log('request: ' + req.url);
    if (uri == '/run') {
    
        return;
    }
    else if (uri == '/view') {
        
        return;
    }

    // What did this part do?  Too bad I didn't leave myself any comments.
    var filename;
    if (args.cwd) {
        console.log("resolving with cwd " + args.cwd);
        filename = path.resolve(args.cwd, uri.substr(1));
    }
    else {
        filename = path.join(process.cwd(), uri);
    }
    fs.exists(filename, function(exists) {
        if(!exists) {
            console.log("not exists: " + filename);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
            return;
        }
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        res.writeHead(200, {'Content-Type': mimeType});

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);

    }); //end path.exists

*/



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {


    console.log("Activate")

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.