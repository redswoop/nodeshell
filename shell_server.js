var spawn = require('child_process').spawn;
var querystring = require('querystring');


var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');


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

http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url);
    var uri = parsedUrl.pathname;
    var args = querystring.parse(parsedUrl.query);
    console.log('request: ' + req.url);
    if (uri == '/run') {
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
        return;
    }
    else if (uri == '/view') {
        var filename = path.resolve(args.cwd, args.filename);
        console.log("Viewing " + filename);
        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
        return;
    }
   
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
}).listen(1337);

