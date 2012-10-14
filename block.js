define(function(require, exports, module) {

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

    exports.make_block = function(command, response, remover)
    {
        var out = document.createElement("div");
        out.setAttribute("class", "command_block");
        out.setAttribute("tabIndex", "0");
        var pre = document.createElement("pre");
        pre.setAttribute("class", "shell_output");

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
        out.appendChild(pre);

        pre.innerHTML += response;

        out.addEventListener("keydown", keydown);
        out.remover = remover(out);

        return out;
    }
});
