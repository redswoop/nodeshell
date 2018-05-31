// module for handling ls output

function file_keydown(evt) 
{
    if (evt.keyCode == 32) {
        evt.target.classList.toggle("selected");
        evt.preventDefault();
        evt.stopPropagation();
    }
}


function keydown(evt,elem) 
{
    if (evt.keyCode == 49) {
        elem.sourceItems = elem.sourceItems.reverse();
        add_items(elem, elem.sourceItems);
        evt.preventDefault();
        evt.stopPropagation();
    }
}

function add_items(elem, items) {
    elem.innerHTML = "";
    for (var idx in items) {
        var item = items[idx];
        
        var ielem  = document.createElement("div");
        ielem.innerHTML = item.filename;
        ielem.setAttribute("class", "fileitem");
        ielem.setAttribute("tabindex", "0");
        elem.appendChild(ielem);
        ielem.addEventListener("keydown", file_keydown);
    }
}

exports.process = function(command, data) {
    var items = data.split("\n");

    var mapper;
    if (command.match("-l")) {
        items = items.slice(1);
        mapper = function(item) {
            var cols = item.split(/[\s]+/);
            return {
                attrs: cols[0],
                owner: cols[2],
                group: cols[3],
                size: cols[4],
                date: { 
                    month: cols[5],
                    day: cols[6],
                },
                time: cols[7],
                filename: cols.slice(8).join(" ")
            };
        }
    }
    else {
        mapper = function(item) { return { filename: item }; }
    }

    var ii = items.map(mapper);
    return ii;
}


exports.make_ui = function(items) {

    var elem = document.createElement("div");
    elem.setAttribute("class", "filelist");
    elem.setAttribute("tabindex", "0");


    add_items(elem, items);
    
    elem.sourceItems = items;
    elem.addEventListener("keydown", function(evt) { keydown(evt, elem) });

    return elem;
}
