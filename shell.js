const { path } = require("./path")
const { block } = require("./block")


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


function dispatchWork(args) 
{    
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
}






console.log('hi')

var PATH="/users/armen";

var command_output = document.getElementById("output");
var input = document.getElementById("input");
var prompt = document.getElementById("prompt");
var command_blocks = [];

var focus_block = -1;

document.addEventListener('keypress', keypress, false);
document.addEventListener('keydown', keydown, false);


document.addEventListener('focus', document_focus, true);

function document_focus(evt)
{
    if (evt.target == document.body) {
        console.log("doc focus") 
        console.log(evt);
        focus_block = -1;
        console.log("Scrolling to " + document.body.scrollHeight);
        window.scrollTo(0, document.body.scrollHeight);
        evt.preventDefault();
    }
    else {
    }
}


function keypress(evt)
{
    input.innerHTML += String.fromCharCode(evt.keyCode);
}

function keydown(evt)
{
    // 38 = up
    // 40 = down
    // 39 = right
    // 37 = left
    // 46 = delete
    // 8 = backspace
   

    if (evt.keyCode == 80 && evt.ctrlKey) {
        if (focus_block < 0) {
            focus_block = command_blocks.length-1;
        }
        else if (focus_block > 0) {
            focus_block--;
        }
        command_blocks[focus_block].focus();
        evt.stopPropagation();
        evt.preventDefault();
    }
    else if (evt.keyCode == 38) {
        command_blocks[command_blocks.length-1].focus(); 
        evt.preventDefault();
    }
    else if (evt.keyCode == 8) {
        var s = input.innerHTML;
        if (s.length > 0) {
            input.innerHTML = s.slice(0,-1);
        }
        evt.preventDefault();
    }
    else if (evt.keyCode == 27 || (evt.keyCode == 67 && evt.ctrlKey)) {
        if (evt.target != document.body) {
            document.body.focus();
        }
        else {
            input.innerHTML = "";
        }
        evt.preventDefault();
        evt.stopPropagation();
    }
    else if (evt.keyCode == 13) {
        var cmd = input.innerHTML;
        input.innerHTML = "";
        if (cmd.length > 0) { 
            execute(cmd);
        }
        evt.preventDefault();
    }
    else if (evt.keyCode == 76 && evt.ctrlKey) { // ctrl-l
        clearAll();
        evt.stopPropagation();
        evt.preventDefault();
    }
    else {
        console.log("doc keydown:");
        console.log(evt);
    }
}

function clearAll()
{
    for (var i = command_output.childNodes.length-1; i >= 0; --i) {
        command_output.removeChild(command_output.childNodes[i]);
    }
    command_blocks.lenght = 0;
    focus_block = -1;
}

function item_remover(node)
{
    return function () {
        node.parentNode.removeChild(node);
        var idx = command_blocks.indexOf(node);
        command_blocks.splice(idx, 1);
    }
}

function setPwd(path)
{
    PATH = path;
    var path_node = document.getElementById("path");
    path_node.innerHTML = PATH;
}

function builtins(command)
{
    var parsed = command.split(" ");
    if (parsed[0] == 'cd') {
        var p = path.composePath(PATH, parsed[1]);
        setPwd(p);
        return true;
    }
    else if (parsed[0] == 'view') {
        viewFile(parsed[1]);
        return true;
    }

    return false;
}

function make_cwd_path(path, cwd)
{
    var result = encodeURI("cwd="+cwd);
    return path+"?"+result;
}

function viewFile(path)
{
    var out = document.createElement("div");
    out.setAttribute("class", "command_block");
    out.setAttribute("tabIndex", "0");


    var cmd = document.createElement("pre");
    cmd.setAttribute("class", "command_string");
    cmd.innerHTML = path;

    var closer = document.createElement("div");
    closer.setAttribute("class", "output_closer");
    var cbut = document.createElement("button");
    cbut.innerText="close";
    cbut.addEventListener("click", item_remover(out), false);
    closer.appendChild(cbut);

    command_output.appendChild(out);

    out.appendChild(cmd);
    out.appendChild(closer);

    var h = new XMLHttpRequest();
    var url = make_cwd_path(path, PATH);
    h.open("GET", url, false);
    h.send(null);

    var res_node;
    var type = h.getResponseHeader("Content-Type");
    if (type.substr(0, 5) == "image") {
        res_node = document.createElement("image");
        res_node.setAttribute("src", url);
    }

    if (res_node)
        out.appendChild(res_node);


    window.scrollTo(0, document.body.scrollHeight);
}







function execute(command)
{
    if (builtins(command))
        return;

    const {ipcRenderer} = require('electron')    
    console.log("sending")
    ipcRenderer.send("run", {func:command, cwd:PATH})

    var out = block.make_block(command, "Some fake response", item_remover);

    command_output.appendChild(out);
    command_blocks.push(out);

    window.scrollTo(0, document.body.scrollHeight);
}

setPwd("/users/armen");
//execute("ls -l");
