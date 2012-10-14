define(function(require, exports, module) {

    var ls = require("ls");

    function keydown(evt)
    {
        // 38 = up
        // 40 = down
        // 39 = right
        // 37 = left
        // 46 = delete
        // 8 = backspace
        //

        if (evt.keyCode == 8) {
            evt.target.remover();
            evt.stopPropagation();
            evt.preventDefault();
        }

        console.log("block keydown: ");
        console.log(evt);
    }

    function parseResponse(response)
    {
        var files = response.split('\n');
        console.log(files);
    }

    exports.make_block = function(command, response, remover)
    {
        var out = document.createElement("div");
        out.setAttribute("class", "command_block");
        out.setAttribute("tabIndex", "0");

        var cmd = document.createElement("pre");
        cmd.setAttribute("class", "command_string");
        cmd.innerHTML = command;

        var closer = document.createElement("div");
        closer.setAttribute("class", "output_closer");
        var cbut = document.createElement("button");
        cbut.innerText="close";
        cbut.addEventListener("click", remover(out), false);
        closer.appendChild(cbut);


        out.appendChild(cmd);
        out.appendChild(closer);

       
        console.log("command is: " + command);
        if (command.match("^ls")) {
            var parsed = ls.process(command, response);
            var ui = ls.make_ui(parsed);
            out.appendChild(ui);
        }
        else {
            var pre = document.createElement("pre");
            pre.setAttribute("class", "shell_output");
            pre.innerHTML += response;
            out.appendChild(pre);
        }

        out.addEventListener("keydown", keydown);
        out.remover = remover(out);

        return out;
    }
});
