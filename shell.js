console.log('hi')

var PATH="/users/armen";

var output = document.getElementById("output");
var input = document.getElementById("input");
var prompt = document.getElementById("prompt");

document.addEventListener('keypress', keypress, false);
document.addEventListener('keydown', keydown, false);

function keypress(evt)
{
    input.innerHTML += String.fromCharCode(evt.keyCode);
}

function keydown(evt)
{
    if (evt.keyCode == 8) {
        var s = input.innerHTML;
        if (s.length > 0) {
            input.innerHTML = s.slice(0,-1);
        }
        evt.preventDefault();
    }
    else if (evt.keyCode == 27 || (evt.keyCode == 67 && evt.ctrlKey)) {
        input.innerHTML = "";
        evt.preventDefault();
    }
    else if (evt.keyCode == 13) {
        var cmd = input.innerHTML;
        input.innerHTML = "";
        if (cmd.length > 0) { 
            execute(cmd);
        }
        evt.preventDefault();
    }
    else if (evt.keyCode == 76 && evt.ctrlKey) {
        clearAll();
        evt.preventDefault();
    }
    else {
        console.log(evt);
    }
}

function clearAll()
{
    for (var i = output.childNodes.length-1; i >= 0; --i) {
        output.removeChild(output.childNodes[i]);
    }
}

function item_remover(node)
{
    return function () {
        node.parentNode.removeChild(node);
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
        setPwd(parsed[1]);
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


    var cmd = document.createElement("pre");
    cmd.setAttribute("class", "command_string");
    cmd.innerHTML = path;

    var closer = document.createElement("div");
    closer.setAttribute("class", "output_closer");
    var cbut = document.createElement("button");
    cbut.innerText="close";
    cbut.addEventListener("click", item_remover(out), false);
    closer.appendChild(cbut);

    output.appendChild(out);

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

    var out = document.createElement("div");
    out.setAttribute("class", "command_block");
    var pre = document.createElement("pre");
    pre.setAttribute("class", "shell_output");

    var cmd = document.createElement("pre");
    cmd.setAttribute("class", "command_string");
    cmd.innerHTML = command;

    var closer = document.createElement("div");
    closer.setAttribute("class", "output_closer");
    var cbut = document.createElement("button");
    cbut.innerText="close";
    cbut.addEventListener("click", item_remover(out), false);
    closer.appendChild(cbut);

    output.appendChild(out);

    out.appendChild(cmd);
    out.appendChild(closer);
    out.appendChild(pre);

    var h = new XMLHttpRequest();
    var args = encodeURI('func=' + command + "&cwd="+PATH);
    h.open("GET", "/run?" +args, false);
    h.send(null);
    pre.innerHTML += h.response;

    window.scrollTo(0, document.body.scrollHeight);
}

setPwd("/users/armen");
execute("ls -al /usr");
